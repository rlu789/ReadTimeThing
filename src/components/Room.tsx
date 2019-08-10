import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ChatPanel } from "./ChatPanel";
import { Youtube } from "./Youtube";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
    clients: {[key: string]: string};
    roomId: string;
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        var routeParams: any = (this.props.match.params);
        window.socket.emit('subscribe', routeParams.id);

        this.state = {
            clients: {},
            roomId: routeParams.id
        };

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
                    <div className="col-md-6 col-lg-8">
                        <Youtube roomId={this.state.roomId}></Youtube>
                        <p>hello there: </p>
                        {Object.keys(this.state.clients).map((c) => {
                            return <p>{this.state.clients[c]}</p>
                        })}</div>
                    <div className="col-md-6 col-lg-4">
                        <ChatPanel roomId={this.state.roomId} clients={this.state.clients}></ChatPanel>
                    </div>
                </div>
            </div>
        );
    }
}