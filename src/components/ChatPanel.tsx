import * as React from "react";

interface ChatPanelProps {
    messages: Array<any>;
    deleteMessage: (index: number) => void;
    loadMoreMsgs: () => void;
}

export class ChatPanel extends React.Component<ChatPanelProps, {}> {
    constructor(props: ChatPanelProps) {
        super(props);
    }

    render() {
        var msgs = this.props.messages.map((msg, index) => {
            return (
                <div>
                    <h4>{msg.name}</h4>
                    <button type="button" className="close" onClick={() => this.props.deleteMessage(index)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p>{msg.message}</p>
                </div>
            );
        });
        return (
            <div>
                {msgs}
                <button onClick={() => this.props.loadMoreMsgs()} className="btn btn-info">Load More</button>
            </div>
        );
    }
}