import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose');

export interface RoomReq {
    name: string;
    description?: string;
}
export interface IRoom {
    name: string;
    description: string;
    guests: number;
    createAt: string;
    _id: string;
}

// room ~= lobby ????
export class Lobby {
    public static init(app: express.Application, io: ioImport.Server) {
        var Room = mongoose.model('Lobby', new mongoose.Schema({
            name: String,
            description: String,
            guests: { type: Number, default: 0 },
            createAt: { type: Date, default: Date.now },
        }));

        app.get('/allRooms', (req, res) => {
            Room.find().sort({ createAt: -1 }).exec((err, rooms) => {
                if (!err) {
                    res.status(200).send(rooms);
                }
                else console.log(err);
            });
        });

        app.post('/addRoom', (req, res) => {
            var room = new Room(req.body);
            room.save((err, product) => {
                if (err)
                    res.sendStatus(500);
                io.emit('roomAdded', product);
                res.sendStatus(200);
            });
        });
    }
}