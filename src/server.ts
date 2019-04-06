import secret from "./secret";
import express = require('express');
import bodyParser = require('body-parser');

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

app.get('/messages', (req, res) => {
  var conditions = req.query.createAt ? { createAt: { $lt: <Date>req.query.createAt } } : { createAt: { $gte: new Date(2000, 1, 1) } };
  Message.find(conditions).sort({ createAt: -1 }).limit(5).exec((err, messages) => {
    res.send(messages.reverse());
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

app.post('/video', (req, res) => {
  io.emit('cueVideo', req.body.video_id);
});
app.post('/playVideo', (req, res) => {
  io.emit('playVideo', req.body.video_id);
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