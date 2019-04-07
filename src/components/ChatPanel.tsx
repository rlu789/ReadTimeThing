import * as React from "react";
import { ChangeEvent } from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ = require('jquery');

interface ChatPanelProps {
    name: string;
    message: string;
    messages: Array<any>;
    deleteMessage: (index: number) => void;
    loadMoreMsgs: () => Promise<any>;
    handleChange: (key: string, event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    sendMessage: (event?: React.KeyboardEvent<HTMLDivElement>, clicked?: boolean) => void;
}

interface ChatPanelState {
    btnLoading: boolean
}

export class ChatPanel extends React.Component<ChatPanelProps, ChatPanelState> {
    constructor(props: ChatPanelProps) {
        super(props);

        this.state = {
            btnLoading: false
        }
    }

    render() {
        var msgs = this.props.messages.map((msg, index) => {
            return (
                <div className="chat-messages">
                    <span className="chat-author">{msg.name}</span>
                    <button type="button" className="close" onClick={() => this.props.deleteMessage(index)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p className="chat-message">{msg.message}</p>
                </div>
            );
        });

        var internalBtn = this.state.btnLoading ? <CircularProgress size={20} /> : 'Load More';

        return (
            <div className="chat-panel h-100">
                <div className="chat-list">
                    <Button disabled={this.state.btnLoading} variant="contained" color="primary" fullWidth={true} onClick={() => {
                        this.props.loadMoreMsgs().then(() => this.setState({ btnLoading: false }));
                        this.setState({ btnLoading: true });
                    }}>
                        {internalBtn}
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