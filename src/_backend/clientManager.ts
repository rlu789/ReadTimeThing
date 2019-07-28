import express = require('express');
import ioImport = require('socket.io');
import mongoose = require('mongoose');
import { Room } from './room';

interface ClientData {
    rooms: { [key: string]: string };
}

export class ClientManager {
    public clients: { [key: string]: ClientData } = {};

    constructor(public app: express.Application, public io: ioImport.Server, public roomModel: Room) {

    }

    private updateGuestCount(roomId: string) {
        this.io.in(roomId).clients((error: any, clients: []) => {
            if (error) throw error;
            if (clients.length === 0)
                this.roomModel.removeRoom(roomId);
            else
                this.io.emit(roomId + 'GuestUpdate', { clients: clients });
        });
    }

    public newClient(socket: ioImport.Socket) {
        var self = this;
        this.clients[socket.id] = {
            rooms: {}
        };

        console.log('a user is connected');
        socket.on('subscribe', function (roomId: string) {
            socket.join(roomId);
            self.clients[socket.id].rooms[roomId] = roomId;

            self.io.in(roomId).clients((error: any, clients: []) => {
                if (error) throw error;
                self.io.emit(roomId + 'GuestUpdate', { clients: clients });
            });
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
            })

        });
    }
}