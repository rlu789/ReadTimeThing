import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose');

export interface LobbyReq {
    name: string;
    description?: string;
}
export interface ILobby {
    name: string;
    description: string;
    guests: number;
    createAt: string;
    _id: string;
}

// room ~= lobby ????
export class Lobby {
    public static init(app: express.Application, io: ioImport.Server) {
        var Lobby = mongoose.model('Lobby', new mongoose.Schema({
            name: String,
            description: String,
            guests: { type: Number, default: 0 },
            createAt: { type: Date, default: Date.now },
        }));

        // Lobby.find().exec((err, lobbies) => {
        //     if (err) throw err;

        //     lobbies.forEach(lobby => {
        //         var room = io.in(lobby.id);
        //         room.clients((c: any, d: any) => {
        //             console.log(d)
        //         });
        //         room.on('connection', function (socket) {
        //             console.log("Someone joined the room.");
        //             // console.log(lobby.toObject());
        //             lobby.update({ $inc: { guests: 1 }}, (err, res) => {});
        //             socket.on('disconnect', function () {
        //                 console.log("Someone left the room.");
        //                 lobby.update({ $inc: { guests: -1 }}, (err, res) => {});
        //             });
        //         });
        //     });
        // });

        app.get('/lobbies', (req, res) => {
            Lobby.find().sort({ createAt: -1 }).exec((err, lobbies) => {
                if (!err) {
                    res.status(200).send(lobbies);
                }
                else console.log(err);
            });
        });

        app.post('/lobby', (req, res) => {
            var lob = new Lobby(req.body);
            lob.save((err, product) => {
                if (err)
                    res.sendStatus(500);
                io.emit('lobbyAdded', product);
                res.sendStatus(200);
            });
        });
    }
}