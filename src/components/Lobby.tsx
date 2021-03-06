import * as React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { LobbyAdd } from "./LobbyAdd";
import { IRoom, RoomReq } from "../_backend/room";
import $ = require('jquery');
import { LobbyCard } from "./LobbyCard";
import { RouteComponentProps } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import stateManager from "../utils/state";

interface LobbyProps extends RouteComponentProps {

}
interface LobbyState {
    modalOpen: boolean;
    username: string;
    prevUsername: string;
    snackBarOpen: boolean;
    rooms?: IRoom[];
}

export class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);
        $("body").css("overscroll-behavior-y", "initial"); /* Enables pull-to-refresh but allows overscroll glow effects. */

        this.state = {
            modalOpen: false,
            snackBarOpen: false,
            username: stateManager.get("user"),
            prevUsername: stateManager.get("user")
        };

        $.get("/allRooms").then((res: IRoom[]) => {
            this.setState({
                rooms: res.filter(r => {
                    return r.guests;
                })
            });
        });


        window.socket.on('roomAdded', (lobby: IRoom) => {
            lobby.guests = 1;
            var roomState = this.state.rooms;
            if (!roomState) roomState = [];
            roomState.unshift(lobby);

            // hard reset rooms array
            // because of issues where when you add a room, other clients see the added room but the no of ppl is bugged
            this.setState({ rooms: [] });
            this.setState({ rooms: roomState });
        });

        window.socket.on('roomRemoved', (roomId: string) => {
            var roomState = this.state.rooms;
            if (roomState) {
                var newState = roomState.filter(r => r._id !== roomId);
                this.setState({ rooms: [] });
                this.setState({ rooms: newState });
            }
        });
    }

    componentWillUnmount() {
        window.socket.off('roomAdded');
        window.socket.off('roomRemoved');
    }

    handleClose(lReq?: RoomReq) {
        this.setState({
            modalOpen: false
        });
        if (lReq) {
            $.post("/addRoom", lReq).then((room: IRoom) => {
                this.props.history.push("/room/" + room.roomType + "/" + room._id);
            });
        }
    }

    addLobby() {
        this.setState({
            modalOpen: true
        });
    }

    handleChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        var v = event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v,
        }));
    }

    updateName() {
        if (this.state.username !== this.state.prevUsername)
            $.post("/user", { name: this.state.username, id: window.socket.id }).then(() => {
                stateManager.set("user", this.state.username);
                this.setState({
                    snackBarOpen: true,
                    prevUsername: this.state.username
                });
            });
    }

    snackBarClose(event: object, reason: string) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackBarOpen: false
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-3">
                        <Paper className="lobby">
                            <TextField
                                margin="dense"
                                label="Your Name"
                                type="text"
                                value={this.state.username}
                                onChange={(e) => this.handleChange("username", e)}
                                onBlur={() => this.updateName()}
                                fullWidth
                            />
                        </Paper>
                    </div>
                    <div className="col-md-6 col-lg-9">
                        <Paper className="lobby fade-in">
                            <Typography variant="h5" component="h2">
                                Rooms
                            {this.state.rooms ? <IconButton className="fade-in" color="primary" onClick={this.addLobby.bind(this)}>
                                <AddIcon />
                            </IconButton > : undefined}
                            </Typography>
                            <LobbyAdd open={this.state.modalOpen} handleClose={this.handleClose.bind(this)}></LobbyAdd>
                            {this.state.rooms ? (this.state.rooms.map((r) => {
                                return <LobbyCard roomModel={r} history={this.props.history}></LobbyCard>
                            })) : <div className="loader"><CircularProgress /></div>}
                        </Paper>
                    </div>
                </div>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackBarOpen}
                    onClose={this.snackBarClose.bind(this)}
                    autoHideDuration={800}
                    message={<span id="message-id">Name updated</span>}
                />
            </div>
        );
    }
}