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
import { ClientManager } from "./_backend/clientManager";
import { Message } from "./_backend/message";
import { RoomManager } from "./_backend/roomManager";
import { YoutubeHandler } from "./_backend/youtubeHandler";

app.use(express.static("dist"));
app.use("/room/*", express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var RoomModel = new Room(app, io);
var MessageModel = new Message(app, io);
var Rooms = new RoomManager(app, io, RoomModel, MessageModel);
var Clients = new ClientManager(app, io, Rooms);
var YT = new YoutubeHandler(app, io);

io.on('connection', (socket) => {
  Clients.newClient(socket);
  YT.registerEvents(socket);
});

mongoose.connect(secret.privateDbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected', err);
});
var server: any = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});