import secret from "./secret";
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');

const app: express.Application = express();
import httpImport = require('http');
var http = new httpImport.Server(app);
import ioImport = require('socket.io');
var io = ioImport(http);

import mongoose = require('mongoose');
import * as path from 'path';
import { Room } from "./_backend/room";

app.use(express.static("dist"));
app.use("/room/*", express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var RoomModel = new Room(app, io);

io.on('connection', (socket) => {
  console.log('a user is connected')
  socket.on('subscribe', function(roomId: string) { 
    socket.join(roomId);

    io.in(roomId).clients((error: any, clients: []) => {
      if (error) throw error;
      // console.log(clients);
      // console.log(roomId);
      io.emit(roomId + 'GuestUpdate', { clients: clients });
    });
  });

  socket.on('unsubscribe', function(roomId: string) { 
    socket.leave(roomId);

    io.in(roomId).clients((error: any, clients: []) => {
      if (error) throw error;
      io.emit(roomId + 'GuestUpdate', { clients: clients });
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    // socket.leaveAll();
  });
});

mongoose.connect(secret.privateDbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected', err);
});
var server: any = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});