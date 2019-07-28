import * as React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { IRoom } from "../_backend/room";
import { History } from "history";

interface LobbyCardProps {
    lobbyModel: IRoom;
    history: History;
}
interface LobbyCardState {
}

export class LobbyCard extends React.Component<LobbyCardProps, LobbyCardState> {
    constructor(props: LobbyCardProps) {
        super(props);
    }

    joinRoom(roomId: string) {
        this.props.history.push("/room/" + roomId);
    }

    render() {
        var l = this.props.lobbyModel;
        return (
            <Card className="lobby-card">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {l.name}
                    </Typography>
                    {l.description ? (
                        <Typography variant="body2" component="p">
                            {l.description}
                        </Typography>) :
                        undefined}
                    <Typography variant="body2" component="p">
                        No of ppl: {l.guests}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => { this.joinRoom(l._id) }}>Join</Button>
                </CardActions>
            </Card>
        );
    }
}