import * as React from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { RouteComponentProps } from "react-router";
import { ChatPanel } from "./ChatPanel";
import { Youtube } from "./Youtube";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
    clients: { [key: string]: string };
    roomId: string;
    tabValue: number;
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        var routeParams: any = (this.props.match.params);
        window.socket.emit('subscribe', routeParams.id);

        this.state = {
            clients: {},
            roomId: routeParams.id,
            tabValue: 0
        };

        window.socket.on(routeParams.id + 'GuestUpdate', (update: { clients: { [key: string]: string } }) => {
            this.setState({
                clients: update.clients
            });
        });
    }

    componentWillUnmount() {
        var routeParams: any = (this.props.match.params);
        window.socket.emit('unsubscribe', routeParams.id);
    }

    handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
        this.setState({ tabValue: newValue });
    }

    render() {
        return (
            <div className="container-fluid fade-in">
                <div className="row">
                    <div className="col-md-6 col-lg-8">
                        <Youtube roomId={this.state.roomId}></Youtube>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <Tabs value={this.state.tabValue} onChange={this.handleTabChange.bind(this)}>
                            <Tab label="Chat" />
                            <Tab label="Room Info" />
                        </Tabs>
                        <ChatPanel hidden={this.state.tabValue !== 0} roomId={this.state.roomId} clients={this.state.clients}></ChatPanel>
                        <div className="fade-in" hidden={this.state.tabValue !== 1}>
                            <p>Guests in lobby: </p>
                            {Object.keys(this.state.clients).map((c) => {
                                return <div>{this.state.clients[c]}</div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}