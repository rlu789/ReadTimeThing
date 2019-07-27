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

app.use(express.static("dist"));
app.use("/test/*", express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// var Message = mongoose.model('Message', new mongoose.Schema({
//   name: String,
//   message: String,
//   createAt: { type: Date, default: Date.now },
// }));

// app.use(cors());

io.on('connection', (socket) => {
  console.log('a user is connected')
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
mongoose.connect(secret.privateDbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected', err);
});
var server: any = http.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});