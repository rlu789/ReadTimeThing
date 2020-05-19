import ioImport = require('socket.io');
import { app, io } from './global';
import { ChessInstance, ShortMove } from 'chess.js';

export interface ChessState {
    started: boolean;
    white: boolean;
    black: boolean;
    fenPosition: string | undefined;
    moves: ShortMove[];
    currentTurn: "b" | "w";
}

export class ChessHandler {
    private games: {
        [key: string]: ChessState
    } = {};

    private setupGame(id: string) {
        this.games[id] = {
            started: false,
            white: true,
            black: false,
            fenPosition: undefined,
            moves: [],
            currentTurn: "w"
        };
        return this.games[id];
    }

    constructor() {
        app.get('/chess', (req, res) => {
            let roomId = (<any>req.query).roomId;
            let game = this.games[roomId];
            if (game) {
                if (!game.black) game.black = true;
                else if (game.black) game.started = true;
                res.status(200).send(game);
            }
            else {
                res.send(this.setupGame(roomId));
            }
        });
    }

    public registerEvents(socket: ioImport.Socket) {
        socket.on('chessMove', (roomId: string, move: ShortMove, fen: string) => {
            // console.log(move);
            let game = this.games[roomId];
            game.moves.push(move);
            game.fenPosition = fen;
            socket.broadcast.to(roomId).emit('chessMove', move);
        });
    }
}