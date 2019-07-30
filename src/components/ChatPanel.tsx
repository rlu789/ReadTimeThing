import * as React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ = require('jquery');

interface ChatPanelProps {

}
interface ChatPanelState {
}

export class ChatPanel extends React.Component<ChatPanelProps, ChatPanelState> {
    constructor(props: ChatPanelProps) {
        super(props);
    }

    render() {
        var msgs = [{ author: '123', message: "test" }, { author: '123', message: "test" }].map((msg, index) => {
            return (
                <div className="chat-messages">
                    <span className="chat-author">{msg.author}</span>
                    <p className="chat-message">{msg.message}</p>
                </div>
            );
        });

        return (<div className="chat-panel">
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
                // onChange={(e) => this.props.handleChange("message", e)}
                // onKeyDownCapture={(e) => this.props.sendMessage(e)}
                // value={this.props.message}
                />
            </div>
            <Button variant="contained" color="primary"
                // onClick={() => this.props.sendMessage(undefined, true)} 
                style={{ float: 'right' }}>
                Send
            </Button>
        </div>
        );
    }
}