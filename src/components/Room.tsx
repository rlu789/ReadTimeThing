import * as React from "react";
import { RouteComponentProps } from "react-router";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
    clients: []
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        this.state = {
            clients: []
        };

        var routeParams: any = (this.props.match.params);
        window.socket.emit('subscribe', routeParams.id);
        window.socket.on(routeParams.id + 'GuestUpdate', (update: { clients: [] }) => {
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
            <div className="container">
                <p>hello there: </p>
                {this.state.clients.map((c) => {
                    return <p>{c}</p>
                })}
            </div>
        );
    }
}