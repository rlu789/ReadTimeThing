import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose');

export class Lobby {
    constructor(public app: express.Application, public io: ioImport.Server) {
        
    }
}