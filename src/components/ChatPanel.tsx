import * as React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ = require('jquery');
import { MessageReq, IMessage } from "../_backend/message";

interface ChatPanelProps {
    roomId: string;
    clients: { [key: string]: string };
}
interface ChatPanelState {
    message: string;
    messages: IMessage[];
    loading: boolean;
}

export class ChatPanel extends React.Component<ChatPanelProps, ChatPanelState> {
    constructor(props: ChatPanelProps) {
        super(props);

        this.state = {
            loading: true,
            message: '',
            messages: []
        };

        $.get("/messages", { roomId: this.props.roomId }).then((res: IMessage[]) => {
            this.setState({ 
                loading: false,
                messages: res
            });
        })

        window.socket.on(this.props.roomId + 'messageAdded', (msg: IMessage) => {
            this.setState(state => {
                const newMsgs = [...state.messages, msg];

                return {
                    messages: newMsgs
                };
            });
            $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight); // for chat-panel component
        });
    }

    handleChange(key: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        var v = event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v
        }));
    }

    sendMessage(event?: React.KeyboardEvent<HTMLDivElement>, clicked?: boolean) {
        var msg = this.state.message.trim();
        if (((event && event.key === 'Enter') || clicked) && msg) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            var obj: MessageReq = {
                author: window.socket.id,
                roomId: this.props.roomId,
                message: this.state.message
            };
            $.post('/messages', obj);
            this.setState({ message: '' });
        }
    }

    render() {
        if (this.state.loading)
            return <div className="loader"><CircularProgress /></div>
        else {
            var msgs = this.state.messages.map((msg, index) => {
                var alias = this.props.clients[msg.author];
                return (
                    <div className="chat-messages">
                        <span className="chat-author">{alias ? alias : msg.author}</span>
                        <p className="chat-message">{msg.message}</p>
                    </div>
                );
            });

            return (
                <div className="chat-panel">
                    <div className="chat-list">
                        {/* <Button disabled={this.state.btnLoading} variant="contained" color="primary" fullWidth={true} onClick={() => {
                        this.props.loadMoreMsgs().then(() => this.setState({ btnLoading: false }));
                        this.setState({ btnLoading: true });
                    }}>
                        {internalBtn}
                    </Button> */}
                        {msgs}
                    </div>
                    <div className="chat-form">
                        <TextField
                            label="Message"
                            multiline
                            rows="2"
                            margin="normal"
                            fullWidth={true}
                            onChange={(e) => this.handleChange("message", e)}
                            onKeyDownCapture={(e) => this.sendMessage(e)}
                            value={this.state.message}
                        />
                    </div>
                    <Button variant="contained" color="primary"
                        onClick={() => this.sendMessage(undefined, true)}
                        style={{ float: 'right' }}>
                        Send
                </Button>
                </div>
            )
        };
    }
}