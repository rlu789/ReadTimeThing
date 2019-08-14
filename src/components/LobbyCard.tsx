import * as React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { IRoom } from "../_backend/room";
import { History } from "history";
import { RoomTypes } from "../_backend/constants";

interface LobbyCardProps {
    roomModel: IRoom;
    history: History;
}
interface LobbyCardState {
    guests: number;
}

export class LobbyCard extends React.Component<LobbyCardProps, LobbyCardState> {
    constructor(props: LobbyCardProps) {
        super(props);

        var self = this;
        this.state = {
            guests: this.props.roomModel.guests
        };

        window.socket.on(this.props.roomModel._id + 'GuestUpdate', (update: { clients: {} }) => {
            this.setState({
                guests: Object.keys(update.clients).length
            });
        });
    }

    joinRoom(roomId: string) {
        this.props.history.push("/room/" + roomId);
    }

    render() {
        var l = this.props.roomModel;
        return (
            <Card className="lobby-card">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {l.name}
                    </Typography>
                    <Typography color="textSecondary">
                        {(() => {
                            switch (l.roomType) {
                                case RoomTypes.Youtube:
                                    return <span>Watching Vids</span>
                                case RoomTypes.Chess:
                                    return <span>Being nerds</span>
                            }
                        })()}
                    </Typography>
                    {l.description ? (
                        <Typography variant="body2" component="p">
                            {l.description}
                        </Typography>) :
                        undefined}
                    <Typography variant="body2" component="p">
                        No of ppl: {this.state.guests}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => { this.joinRoom(l._id) }}>Join</Button>
                </CardActions>
            </Card>
        );
    }
}