import * as React from "react";
import { Chess, ChessInstance, Square } from "chess.js";
import $ = require('jquery');
import { createScript, createStyle } from "../utils/common";
import { BoardConfig, ChessBoardInstance } from "chessboardjs";

interface ChessViewProps {
}
interface ChessViewState {
}

export class ChessView extends React.Component<ChessViewProps, ChessViewState> {
    private game!: ChessInstance;
    private board!: ChessBoardInstance;
    constructor(props: ChessViewProps) {
        super(props);

        $("body").css("overscroll-behavior-y", "contain"); /* Disables pull-to-refresh but allows overscroll glow effects. */
    }

    initChess() {
        var self = this;
        self.game = new Chess();
        console.log(self.game.fen());

        function onDragStart(source: string, piece: string, position: Object, orientation: string) {
            // do not pick up pieces if the game is over
            if (self.game.game_over()) return false

            // only pick up pieces for the side to move
            if ((self.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (self.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false
            }
        }

        function onDrop(source: Square, target: Square) {
            // see if the move is legal
            var move = self.game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            })

            // illegal move
            if (move === null) return 'snapback'

            updateStatus()
        }

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        function onSnapEnd() {
            self.board.position(self.game.fen())
        }

        function updateStatus() {
            var status = ''

            var moveColor = 'White'
            if (self.game.turn() === 'b') {
                moveColor = 'Black'
            }

            // checkmate?
            if (self.game.in_checkmate()) {
                status = 'Game over, ' + moveColor + ' is in checkmate.'
            }

            // draw?
            else if (self.game.in_draw()) {
                status = 'Game over, drawn position'
            }

            // game still on
            else {
                status = moveColor + ' to move'

                // check?
                if (self.game.in_check()) {
                    status += ', ' + moveColor + ' is in check'
                }
            }

            // $status.html(status)
            // $fen.html(game.fen())
            // $pgn.html(game.pgn())
        }

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

        function mobile() {
            var w = $(window).width();
            if (w && (w <= 420))
                $('div[class^="square-"]').addClass('chess-tile');
            else 
                $('.chess-tile').removeClass('chess-tile');
        }
        $(window).resize(function () {
            mobile();
        });
        mobile();
        // $('.chess-tile').attr("style", "");
        // $('.chess-tile img').attr("style", "");
    }

    componentDidMount() {
        createStyle('/assets/chessboardjs/css/chessboard-1.0.0.min.css');
        createScript('/assets/chessboardjs/js/chessboard-1.0.0.min.js', this.initChess.bind(this), undefined, this.initChess.bind(this));
    }

    render() {
        return (
            <div className="chess-view">
                <div id="myBoard" className="chess-board"></div>
            </div>
        );
    }
}