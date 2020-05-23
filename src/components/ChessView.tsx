import * as React from "react";
import { Chess, ChessInstance, Square, ShortMove } from "chess.js";
import $ = require('jquery');
import { createScript, createStyle } from "../utils/common";
import { BoardConfig, ChessBoardInstance } from "chessboardjs";
import { ChessState } from "../_backend/chessHandler";

enum Player {
    Loading,
    White,
    Black,
    Spectator
}

interface ChessViewProps {
    roomId: string
}
interface ChessViewState {
    player: Player
}

export class ChessView extends React.Component<ChessViewProps, ChessViewState> {
    private game!: ChessInstance;
    private board!: ChessBoardInstance;
    private api = $.get("/chess", { roomId: this.props.roomId });
    constructor(props: ChessViewProps) {
        super(props);

        this.state = {
            player: Player.Loading
        };

        $("body").css("overscroll-behavior-y", "contain"); /* Disables pull-to-refresh but allows overscroll glow effects. */
    }

    initChess(fen: string | undefined) {
        var self = this;
        self.game = new Chess(fen);
        console.log(self.game.fen());

        function onDragStart(source: string, piece: string, position: Object, orientation: string) {
            // do not pick up pieces if the game is over
            if (self.game.game_over()) return false;

            // only pick up pieces if your turn to move
            if (self.state.player === Player.White) {
                if ((self.game.turn() === 'w' && piece.search(/^b/) !== -1) || self.game.turn() === 'b')
                    return false;
            }
            else if (self.state.player === Player.Black) {
                if (self.game.turn() === 'b' && piece.search(/^w/) !== -1 || self.game.turn() === 'w')
                    return false;
            }
            else return false;
        };

        function onDrop(source: Square, target: Square) {
            var sm: ShortMove = {
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            }
            // see if the move is legal
            var move = self.game.move(sm);

            // illegal move
            if (move === null) return 'snapback'

            updateStatus();

            window.socket.emit('chessMove', self.props.roomId, sm, self.game.fen());
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        function onSnapEnd() {
            self.board.position(self.game.fen());
        };

        function updateStatus() {
            var status = '';

            var moveColor = 'White';
            if (self.game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (self.game.in_checkmate()) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            }

            // draw?
            else if (self.game.in_draw()) {
                status = 'Game over, drawn position';
            }

            // game still on
            else {
                status = moveColor + ' to move';

                // check?
                if (self.game.in_check()) {
                    status += ', ' + moveColor + ' is in check';
                }
            }

            // $status.html(status)
            // $fen.html(game.fen())
            // $pgn.html(game.pgn())
        };

        var config: BoardConfig = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart as any,
            onDrop: onDrop as any,
            onSnapEnd: onSnapEnd as any,
            pieceTheme: ((piece: string) => {
                return '/img/chesspieces/wikipedia/' + piece + '.png';
            }) as any // as any
        };

        self.board = window.Chessboard('myBoard', config);
        self.board.position(self.game.fen());
        if (self.state.player === Player.Black) self.board.flip();

        $(window).resize(function () {
            self.board.resize();
        });
    }

    componentDidMount() {
        this.api.then((res: ChessState) => {
            console.log(res);
            if (!res.black) this.setState({ player: Player.White });
            else if (res.black && !res.started) this.setState({ player: Player.Black });
            else this.setState({ player: Player.Spectator });

            createStyle('/assets/chessboardjs/css/chessboard-1.0.0.min.css');
            createScript('/assets/chessboardjs/js/chessboard-1.0.0.min.js', this.initChess.bind(this, res.fenPosition), undefined, this.initChess.bind(this, res.fenPosition));

            window.socket.on('chessMove', (m: ShortMove) => {
                this.game.move(m);
                this.board.position(this.game.fen());
            });
        });
    }

    componentWillUnmount() {
        window.socket.off("chessMove");
    }

    render() {
        var txt: string = '';
        switch (this.state.player) {
            case Player.White:
                txt = 'Playing as white';
                break;
            case Player.Black:
                txt = 'Playing as black';
                break;
            case Player.Spectator:
                txt = 'Spectating';
                break;
        }

        return (
            <div className="chess-view">
                <div id="myBoard" className="chess-board"></div>
                <p style={{textAlign: "center"}}>{txt}</p>
            </div>
        );
    }
}