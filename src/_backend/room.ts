import mongoose = require('mongoose');
import { app, io } from './global';

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

export class Room {
    public Model = mongoose.model('Room', new mongoose.Schema({
        name: String,
        description: String,
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

        app.post('/addRoom', (req, res) => {
            var room = new this.Model(req.body);
            room.save((err, product) => {
                if (err)
                    res.sendStatus(500);
                res.status(200).send(product);
                io.emit('roomAdded', product);
            });
        });
    }
}