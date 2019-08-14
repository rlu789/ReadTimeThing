import * as React from "react";
import { Chess } from "chess.js";
import $ = require('jquery');
import { createScript, createStyle } from "../utils/common";
import { BoardConfig } from "chessboardjs";

interface ChessViewProps {
}
interface ChessViewState {
}

export class ChessView extends React.Component<ChessViewProps, ChessViewState> {
    constructor(props: ChessViewProps) {
        super(props);

        $("body").css("overscroll-behavior-y", "contain"); /* Disables pull-to-refresh but allows overscroll glow effects. */
    }

    componentDidMount() {
        var self = this;
        createStyle('/assets/chessboardjs/css/chessboard-1.0.0.min.css');

        var doneFunc = function () {
            var c = new Chess();
            console.log(c.ascii());

            var config: BoardConfig = {
                draggable: true,
                position: 'start',
                pieceTheme: ((piece: string) => {
                    return '/img/chesspieces/wikipedia/' + piece + '.png';
                }) as any // BoardConfig type doesn't account for pieceTheme being a func
            };

            var board = window.Chessboard('myBoard', config);
        }
        createScript('/assets/chessboardjs/js/chessboard-1.0.0.min.js', doneFunc, undefined, doneFunc);
    }

    render() {
        return (
            <div className="container">
                <div id="myBoard" className="chess-board"></div>
            </div>
        );
    }
}