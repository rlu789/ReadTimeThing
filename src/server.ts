import secret from "./secret";
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { app, http, io } from './_backend/global';

import mongoose = require('mongoose');
import * as path from 'path';
import { Room } from "./_backend/room";
import { ClientManager } from "./_backend/clientManager";
import { Message } from "./_backend/message";
import { RoomManager } from "./_backend/roomManager";
import { YoutubeHandler } from "./_backend/youtubeHandler";
import { ChessHandler } from "./_backend/chessHandler";

app.use(express.static("dist"));
app.use("/room/*", express.static("dist"));
app.use("/assets", express.static("assets"));
app.use("/img", express.static("assets/chessboardjs/img"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var RoomModel = new Room();
var MessageModel = new Message();
var Rooms = new RoomManager(RoomModel, MessageModel);
var YT = new YoutubeHandler();
var Chess = new ChessHandler();
var Clients = new ClientManager(Rooms);

io.on('connection', (socket) => {
  Clients.newClient(socket, YT);
});

mongoose.connect(secret.privateDbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected', err);
});
var server: any = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});