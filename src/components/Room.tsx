import * as React from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { RouteComponentProps } from "react-router";
import { ChatPanel } from "./ChatPanel";
import { Youtube } from "./Youtube";
import $ = require('jquery');
import { IRoom } from "../_backend/room";
import { CircularProgress } from "@material-ui/core";
import { RoomTypes } from "../_backend/constants";
import { ChessView } from "./ChessView";

interface RoomProps extends RouteComponentProps {

}
interface RoomState {
    clients: { [key: string]: string };
    roomId: string;
    roomType: string;
    tabValue: number;
    roomInfo: IRoom | "" | null;
}

export class Room extends React.Component<RoomProps, RoomState> {
    constructor(props: RoomProps) {
        super(props);

        var routeParams: any = (this.props.match.params);
        window.socket.emit('subscribe', routeParams.id);

        this.state = {
            clients: {},
            roomId: routeParams.id,
            roomType: routeParams.type,
            tabValue: 0,
            roomInfo: null
        };

        $.get("/room", { roomId: routeParams.id }).then((res: IRoom | "") => {
            this.setState({ roomInfo: res });
        });

        window.socket.on(routeParams.id + 'GuestUpdate', (update: { clients: { [key: string]: string } }) => {
            var oldClients = this.state.clients;
            var newClients = update.clients;
            Object.keys(oldClients).forEach(old => {
                if (!newClients[old]) { // if client has left room
                    if (!oldClients[old].endsWith("\t[gone]"))
                        oldClients[old] += "\t[gone]";
                }
                else {  // if client is still in room or has reconnected
                    oldClients[old].replace("\t[gone]", "");
                }
            });
            $.extend( oldClients, newClients ); // merge newClients obj into oldClients obj
            
            this.setState({
                clients: oldClients
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
        var roomInfo = this.state.roomInfo;
        var roomContent: JSX.Element = <div className="loader"><CircularProgress /></div>;
        
        if (roomInfo !== null) {
            switch (this.state.roomType) {
                case RoomTypes.Youtube:
                    roomContent = <Youtube roomId={this.state.roomId}></Youtube>;
                    break;
                case RoomTypes.Chess:
                    roomContent = <ChessView roomId={this.state.roomId}></ChessView>;
                    break;
                default:
                    break;
            }
        }

        return (
            <div className="container-fluid fade-in">
                <div className="row">
                    <div className="col-md col-lg-8">
                        {roomContent}
                    </div>
                    <div className="col-md col-lg-4">
                        <Tabs variant="fullWidth" value={this.state.tabValue} onChange={this.handleTabChange.bind(this)}>
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