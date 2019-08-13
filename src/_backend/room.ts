import mongoose = require('mongoose');
import { app, io } from './global';
import { RoomTypes } from './constants';

export interface RoomReq {
    name: string;
    roomType: number;
    description?: string;
}
export interface IRoom {
    name: string;
    description: string;
    roomType: number;
    guests: number;
    createAt: string;
    _id: string;
}

export class Room {
    public Model = mongoose.model('Room', new mongoose.Schema({
        name: String,
        description: String,
        roomType: { type: Number, default: RoomTypes.Youtube },
        guests: { type: Number, default: 0 },
        createAt: { type: Date, default: Date.now },
    }));

    constructor() {
        app.get('/allRooms', (req, res) => {
            this.Model.find().sort({ createAt: -1 }).exec((err, rooms) => {
                if (!err) {
                    if (rooms.length) {
                        for (let i = 0; i < rooms.length; i++) {
                            io.in(rooms[i].id).clients((error: any, clients: []) => {
                                if (error) throw error;
                                rooms[i].set("guests", clients.length);
    
                                // some async issues happening with .clients()
                                // need to return response after guests has been set within this for loop
                                // very hacky fix
                                if (i === rooms.length - 1) {
                                    res.status(200).send(rooms);
                                }
                            });
                        }
                    }
                    else res.status(200).send(rooms);
                }
                else console.log(err);
            });
        });

        app.get('/room', (req, res) => {
            console.log(req.query.roomId)
            this.Model.findById(req.query.roomId, (err, product) => {
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
                res.send(product);
            });
        });

        app.post('/addRoom', (req, res) => {
            var room = new this.Model(req.body);
            room.save((err, product) => {
                if (err) {
                    res.sendStatus(500);
                    console.log(err);
                }
                res.status(200).send(product);
                io.emit('roomAdded', product);
            });
        });
    }
}