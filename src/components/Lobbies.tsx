import * as React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { LobbiesAdd } from "./LobbiesAdd";
import { ILobby, LobbyReq } from "../_backend/lobby";
import $ = require('jquery');
import { LobbiesCard } from "./LobbiesCard";
import { RouteComponentProps } from "react-router-dom";

interface LobbiesProps extends RouteComponentProps {

}
interface LobbiesState {
    modalOpen: boolean;
    lobbies?: ILobby[];
}

export class Lobbies extends React.Component<LobbiesProps, LobbiesState> {
    constructor(props: LobbiesProps) {
        super(props);
        // console.log(this.props);

        this.state = {
            modalOpen: false
        };

        $.get("/lobbies").then((res) => {
            this.setState({ lobbies: res });
        });

        window.socket.on('lobbyAdded', (lobby: ILobby) => {
            this.setState(state => {
                var arr = state.lobbies;
                if (!arr) arr = [];
                arr.unshift(lobby);
                console.log(arr);
                return {
                    lobbies: arr
                };
            });
        });
    }

    handleClose(lReq?: LobbyReq) {
        this.setState({
            modalOpen: false
        });
        if (lReq) {
            $.post("/lobby", lReq);
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
                    <Paper className="lobbies">
                        <Typography variant="h5" component="h2">
                            Lobbies
                            <IconButton color="primary" onClick={this.addLobby.bind(this)}>
                                <AddIcon />
                            </IconButton >
                        </Typography>
                        <LobbiesAdd open={this.state.modalOpen} handleClose={this.handleClose.bind(this)}></LobbiesAdd>
                        {this.state.lobbies ? (this.state.lobbies.map((l) => {
                            return <LobbiesCard lobbyModel={l} history={this.props.history}></LobbiesCard>
                        })) : <div>Loading</div>}
                    </Paper>
                </div>
            </div>
        );
    }
}