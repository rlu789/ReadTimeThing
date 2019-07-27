import * as React from "react";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import { LobbiesAdd } from "./LobbiesAdd";

interface LobbiesProps {

}
interface LobbiesState {
    open: boolean;
}

export class Lobbies extends React.Component<LobbiesProps, LobbiesState> {
    constructor(props: LobbiesProps) {
        super(props);

        this.state = {
            open: false
        }
    }

    handleClose(lobbyName?: string) {
        console.log(lobbyName);
        this.setState({
            open: false
        });
    }

    addLobby() {
        this.setState({
            open: true
        });
    }

    render() {
        return (
            <Paper className="lobbies">
                <Typography variant="h5" component="h2">
                    Lobbies
                    <IconButton color="primary" onClick={this.addLobby.bind(this)}>
                        <AddIcon />
                    </IconButton >
                </Typography>
                <LobbiesAdd open={this.state.open} handleClose={this.handleClose.bind(this)}></LobbiesAdd>
            </Paper>
        );
    }
}