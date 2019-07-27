import * as React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ILobby } from "../_backend/lobby";

interface LobbiesCardProps {
    lobbyModel: ILobby;
}
interface LobbiesCardState {
}

export class LobbiesCard extends React.Component<LobbiesCardProps, LobbiesCardState> {
    constructor(props: LobbiesCardProps) {
        super(props);
    }

    render() {
        var l = this.props.lobbyModel;
        return (
            <Card className="lobbies-card">
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {l.name}
                    </Typography>
                    {l.description ? (
                        <Typography variant="body2" component="p">
                            {l.description}
                        </Typography>) :
                        undefined}
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary">Join</Button>
                </CardActions>
            </Card>
        );
    }
}