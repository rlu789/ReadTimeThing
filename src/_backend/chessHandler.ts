import ioImport = require('socket.io');
import { app, io } from './global';
import { ChessInstance } from 'chess.js';

export class ChessHandler {
    private games: {
        [key: string]: {
            started: boolean;
            white?: string;
            black?: string;
            chess: ChessInstance;
            moves: string[];
            currentTurn: "b" | "w";
        }
    } = {};

    constructor() {
    }

    public registerEvents(socket: ioImport.Socket) {
        
    }
}