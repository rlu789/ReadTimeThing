import * as React from "react";
import { ChangeEvent } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

interface ChatPanelProps {
    name: string;
    message: string;
    messages: Array<any>;
    deleteMessage: (index: number) => void;
    loadMoreMsgs: () => void;
    handleChange: (key: string, event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    sendMessage: (event?: React.KeyboardEvent<HTMLDivElement>, clicked?: boolean) => void;
}

export class ChatPanel extends React.Component<ChatPanelProps, {}> {
    constructor(props: ChatPanelProps) {
        super(props);
    }

    render() {
        var msgs = this.props.messages.map((msg, index) => {
            return (
                <div className="chat-messages">
                    <span className="chat-author">{msg.name}</span>
                    {/* <IconButton>
                        <DeleteIcon fontSize="small" />
                    </IconButton> */}
                    <button type="button" className="close" onClick={() => this.props.deleteMessage(index)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p className="chat-message">{msg.message}</p>
                </div>
            );
        });
        return (
            <div className="chat-panel h-100">
                <div className="chat-list">
                    <Button variant="contained" color="primary" fullWidth={true} onClick={() => this.props.loadMoreMsgs()}>
                        Load More
                    </Button>
                    {msgs}
                </div>
                <div className="chat-form">
                    <TextField
                        label="Name"
                        onChange={(e) => this.props.handleChange("name", e)}
                        margin="normal"
                        fullWidth={true}
                        value={this.props.name}
                    />
                    <TextField
                        label="Message"
                        multiline
                        rows="2"
                        margin="normal"
                        fullWidth={true}
                        onChange={(e) => this.props.handleChange("message", e)}
                        onKeyDownCapture={(e) => this.props.sendMessage(e)}
                        value={this.props.message}
                    />
                    <Button variant="contained" color="primary" onClick={() => this.props.sendMessage(undefined, true)} style={{ float: 'right' }}>
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}