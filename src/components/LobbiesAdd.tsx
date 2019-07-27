import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface LobbiesAddProps {
    open: boolean;
    handleClose: (lobbyName?: string) => void;
}
interface LobbiesAddState {
    lobbyName: string
}

export class LobbiesAdd extends React.Component<LobbiesAddProps, LobbiesAddState> {
    constructor(props: LobbiesAddProps) {
        super(props);

        this.state = {
            lobbyName: ""
        }
    }

    handleChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        var v = event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v,
        }))
    }
    


    render() {
        return (
            <Dialog fullWidth={true} maxWidth="md" onExited={() => {this.setState({lobbyName: ""})}} open={this.props.open} onClose={this.props.handleClose.bind(undefined, this.state.lobbyName)}>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose.bind(undefined, undefined)} color="primary">
                        Cancel
          </Button>
                    <Button onClick={this.props.handleClose.bind(undefined, this.state.lobbyName)} color="primary">
                        Add
          </Button>
                </DialogActions>
            </Dialog>
        );
    }
}