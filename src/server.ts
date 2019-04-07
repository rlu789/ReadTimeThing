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
app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var Message = mongoose.model('Message', new mongoose.Schema({
  name: String,
  message: String,
  createAt: { type: Date, default: Date.now },
}));

app.use(cors());

app.get('/messages', (req, res) => {
  var conditions = req.query.createAt ? { createAt: { $lt: <Date>req.query.createAt } } : { createAt: { $gte: new Date(2000, 1, 1) } };
  Message.find(conditions).sort({ createAt: -1 }).limit(5).exec((err, messages) => {
    if (!err) {
      res.status(200).send(messages.reverse());
    }
    else console.log(err);
  });
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err, product) => {
    if (err)
      res.sendStatus(500);
    io.emit('messageAdded', product);
    res.sendStatus(200);
  });
});

app.delete('/messages', (req, res) => {
  Message.findOneAndDelete(req.body, (err) => {
    if (err)
      res.sendStatus(500);
    io.emit('messageDeleted', req.body);
    res.sendStatus(200);
  });
});

var cuedVideo: string;
app.post('/cueVideo', (req, res) => {
  io.emit('cueVideo', req.body.video_id);
  cuedVideo = req.body.video_id;
  res.sendStatus(200);
});
app.get('/getCued', (req, res) => {
  res.status(200).send(cuedVideo);
});
app.post('/playVideo', (req, res) => {
  io.emit('playVideo');
  res.sendStatus(200);
});
app.post('/pauseVideo', (req, res) => {
  io.emit('pauseVideo');
  res.sendStatus(200);
});

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