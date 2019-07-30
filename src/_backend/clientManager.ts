import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose');
import { RoomManager } from './roomManager';

export interface ClientData {
    rooms: { [key: string]: string };
    name: string;
}

export class ClientManager {
    public clients: { [key: string]: ClientData } = {};
    public count = 0;

    constructor(public app: express.Application, public io: ioImport.Server, public roomManager: RoomManager) {
        this.app.get("/user", (req, res) => {
            res.status(200).send(this.clients[req.query.id]);
        });
        this.app.post("/user", (req, res) => {
            this.clients[req.body.id].name = req.body.name;
            res.sendStatus(200);
        });
    }

    private updateGuestCount(roomId: string) {
        this.io.in(roomId).clients((error: any, roomClients: []) => {
            if (error) console.log(error);
            if (roomClients.length === 0)
                this.roomManager.removeRoom(roomId);
            else {
                // var clientsName = roomClients.map((c) => {
                //     return this.clients[c].name;
                // });
                var clientObj: {[key: string]: string} = {};
                roomClients.forEach((c) => {
                    return clientObj[c] = this.clients[c].name;
                });

                this.io.emit(roomId + 'GuestUpdate', { clients: clientObj });
            }
        });
    }

    public newClient(socket: ioImport.Socket) {
        var self = this;
        this.clients[socket.id] = {
            rooms: {},
            name: "Guest-" + self.count++
        };

        console.log('a user is connected');
        socket.on('subscribe', function (roomId: string) {
            socket.join(roomId);
            self.clients[socket.id].rooms[roomId] = roomId;

            self.updateGuestCount(roomId);
        });

        socket.on('unsubscribe', function (roomId: string) {
            socket.leave(roomId);
            delete self.clients[socket.id].rooms[roomId];

            self.updateGuestCount(roomId);
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');

            Object.keys(self.clients[socket.id].rooms).forEach(roomId => {
                self.updateGuestCount(roomId);
            });
            
            delete self.clients[socket.id];
        });
    }
}