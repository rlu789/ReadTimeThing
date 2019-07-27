import * as React from "react";
import { RouteComponentProps } from "react-router";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        var routeParams: any = (this.props.match.params);
        console.log(routeParams.id);
        window.socket.emit('subscribe', routeParams.id);
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    hello there
                </div>
            </div>
        );
    }
}