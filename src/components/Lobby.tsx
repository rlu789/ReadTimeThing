import * as React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { LobbyAdd } from "./LobbyAdd";
import { IRoom, RoomReq } from "../_backend/room";
import $ = require('jquery');
import { LobbyCard } from "./LobbyCard";
import { RouteComponentProps } from "react-router-dom";

interface LobbyProps extends RouteComponentProps {

}
interface LobbyState {
    modalOpen: boolean;
    rooms?: IRoom[];
}

export class Lobby extends React.Component<LobbyProps, LobbyState> {
    constructor(props: LobbyProps) {
        super(props);
        // console.log(this.props);

        this.state = {
            modalOpen: false
        };

        $.get("/allRooms").then((res) => {
            this.setState({ rooms: res });
        });

        window.socket.on('roomAdded', (lobby: IRoom) => {
            var roomState = this.state.rooms;
            if (!roomState) roomState = [];
            roomState.unshift(lobby);

            // hard reset rooms array
            // because of issues where when you add a room, other clients see the added room but the no of ppl is bugged
            this.setState({rooms: []}); 
            this.setState({rooms: roomState});
        });

        window.socket.on('roomRemoved', (roomId: string) => {
            var roomState = this.state.rooms;
            if (roomState) {
                var newState = roomState.filter(r => r._id !== roomId);
                this.setState({rooms: []}); 
                this.setState({rooms: newState});
            }
        });
    }

    handleClose(lReq?: RoomReq) {
        this.setState({
            modalOpen: false
        });
        if (lReq) {
            $.post("/addRoom", lReq).then((room: IRoom) => {
                this.props.history.push("/room/" + room._id);
            });
        }
    }

    addLobby() {
        this.setState({
            modalOpen: true
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <Paper className="lobby">
                        <Typography variant="h5" component="h2">
                            Rooms
                            <IconButton color="primary" onClick={this.addLobby.bind(this)}>
                                <AddIcon />
                            </IconButton >
                        </Typography>
                        <LobbyAdd open={this.state.modalOpen} handleClose={this.handleClose.bind(this)}></LobbyAdd>
                        {this.state.rooms ? (this.state.rooms.map((r) => {
                            return <LobbyCard roomModel={r} history={this.props.history}></LobbyCard>
                        })) : <div>Loading</div>}
                    </Paper>
                </div>
            </div>
        );
    }
}