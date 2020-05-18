import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { RoomReq } from '../_backend/room';
import { RoomTypes } from '../_backend/constants';

interface LobbyAddProps {
    open: boolean;
    handleClose: (lReq?: RoomReq) => void;
}
interface LobbyAddState {
    lobbyName: string;
    lobbyDesc: string;
    lobbyType: number;
}

export class LobbyAdd extends React.Component<LobbyAddProps, LobbyAddState> {
    constructor(props: LobbyAddProps) {
        super(props);

        this.state = {
            lobbyName: "",
            lobbyDesc: "",
            lobbyType: 0
        }
    }

    handleChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, isSelect = false) {
        var v = isSelect ? event.target.value : event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v
        }));
    }

    createReqObject(): RoomReq {
        return {
            name: this.state.lobbyName,
            description: this.state.lobbyDesc,
            roomType: this.state.lobbyType
        }
    }

    render() {
        return (
            <Dialog fullWidth={true} maxWidth="md" onExited={() => { this.setState({ lobbyName: "", lobbyDesc: "" }) }}
                open={this.props.open} onClose={this.props.handleClose.bind(undefined, undefined)}>
                <DialogTitle id="form-dialog-title">Add Lobby</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span>Add a lobby</span>
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
                    <FormControl fullWidth>
                        <InputLabel htmlFor="lobby-type">Lobby Type</InputLabel>
                        <Select value={this.state.lobbyType} onChange={(e) => this.handleChange("lobbyType", e, true)} inputProps={{
                            id: 'lobby-type',
                        }}>
                            {Object.keys(RoomTypes).map((key: string) => {
                                return <MenuItem value={RoomTypes[key]}>{key}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose.bind(undefined, undefined)} color="primary">
                        <span>Cancel</span>
                    </Button>
                    <Button onClick={this.props.handleClose.bind(undefined, this.createReqObject())} color="primary">
                        <span>Add</span>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}