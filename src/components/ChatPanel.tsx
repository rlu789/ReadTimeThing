import * as React from "react";

interface ChatPanelProps {
    name: string;
    message: string;
    messages: Array<any>;
    deleteMessage: (index: number) => void;
    loadMoreMsgs: () => void;
    nameChange: (event: React.FormEvent<HTMLInputElement>) => void;
    messageChange: (event: React.FormEvent<HTMLTextAreaElement>) => void;
    sendMessage: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
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
                    <button type="button" className="close" onClick={() => this.props.deleteMessage(index)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p className="chat-message">{msg.message}</p>
                </div>
            );
        });
        return (
            <div className="chat-panel h-100">
                <button onClick={() => this.props.loadMoreMsgs()} className="btn btn-info w-100">Load More</button>
                <div className="chat-list">
                    {msgs}
                </div>
                <div className="chat-form">
                    <input className="form-control" placeholder="Name" value={this.props.name} onChange={this.props.nameChange}></input> <br />
                    <textarea className="form-control" placeholder="Your Message Here" value={this.props.message} onChange={this.props.messageChange}
                        onKeyDownCapture={(e) => this.props.sendMessage(e)}></textarea>
                </div>
            </div>
        );
    }
}