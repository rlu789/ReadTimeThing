import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose')
import { Message } from './message';
import { Room } from './room';

export class RoomManager {
    constructor(public app: express.Application, public io: ioImport.Server, public roomModel: Room, public msgModel: Message) {

    }
    

    removeRoom (id: string) {
        this.roomModel.Model.findByIdAndDelete({ _id: id }, (err, res) => {
            if (err) console.log(err);
        });
        this.io.emit('roomRemoved', id);

        this.msgModel.Model.deleteMany({roomId: id}, (err) => {
            if (err) console.log(err);
        });
    }
}