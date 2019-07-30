import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ChatPanel } from "./ChatPanel";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
    clients: {[key: string]: string}
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        this.state = {
            clients: {}
        };

        var routeParams: any = (this.props.match.params);
        window.socket.emit('subscribe', routeParams.id);
        window.socket.on(routeParams.id + 'GuestUpdate', (update: { clients: {[key: string]: string} }) => {
            this.setState({
                clients: update.clients
            });
        });
    }

    componentWillUnmount() {
        var routeParams: any = (this.props.match.params);
        window.socket.emit('unsubscribe', routeParams.id);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        <p>hello there: </p>
                        {Object.keys(this.state.clients).map((c) => {
                            return <p>{this.state.clients[c]}</p>
                        })}</div>
                    <div className="col-4">
                        <ChatPanel></ChatPanel>
                    </div>
                </div>
            </div>
        );
    }
}