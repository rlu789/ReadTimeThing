import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RoomReq } from '../_backend/room';

interface LobbyAddProps {
    open: boolean;
    handleClose: (lReq?: RoomReq) => void;
}
interface LobbyAddState {
    lobbyName: string
    lobbyDesc: string
}

export class LobbyAdd extends React.Component<LobbyAddProps, LobbyAddState> {
    constructor(props: LobbyAddProps) {
        super(props);

        this.state = {
            lobbyName: "",
            lobbyDesc: ""
        }
    }

    handleChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        var v = event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v,
        }))
    }
    
    createReqObject(): RoomReq {
        return {
            name: this.state.lobbyName,
            description: this.state.lobbyDesc
        }
    }

    render() {
        return (
            <Dialog fullWidth={true} maxWidth="md" onExited={() => {this.setState({lobbyName: "", lobbyDesc: ""})}} open={this.props.open} onClose={this.props.handleClose.bind(undefined, this.createReqObject())}>
                <DialogTitle id="form-dialog-title">Add Lobby</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add a lobby haha
          </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lobby Name"
                        value={this.state.lobbyName}
                        onChange={(e) => this.handleChange("lobbyName", e)}
                        type="text"
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Lobby Description"
                        value={this.state.lobbyDesc}
                        onChange={(e) => this.handleChange("lobbyDesc", e)}
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose.bind(undefined, undefined)} color="primary">
                        Cancel
          </Button>
                    <Button onClick={this.props.handleClose.bind(undefined, this.createReqObject())} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        );
    }
}