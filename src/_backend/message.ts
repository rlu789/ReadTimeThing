import { app, io } from './global';
import mongoose = require('mongoose');

export interface MessageReq {
    author: string;
    message: string;
    roomId: string;
}

export interface IMessage {
    author: string;
    message: string;
    createAt: string;
    roomId: string;
}

export class Message {
    public Model = mongoose.model('Message', new mongoose.Schema({
        author: String,
        message: String,
        roomId: String,
        createAt: { type: Date, default: Date.now },
    }));

    constructor() {
        app.get("/messages", (req, res) => {
            // console.log(req.query.roomId)
            this.Model.find({
                roomId: req.query.roomId
            }).sort({ createAt: 1 }).exec((err, messages) => {
                if (err) console.log(err);
                res.status(200).send(messages);
            });
        });

        app.post("/messages", (req, res) => {
            var msg = new this.Model(req.body);
            msg.save((err, product) => {
                if (err)
                    res.sendStatus(500);
                res.status(200).send(product);
                io.in(req.body.roomId).emit("messageAdded", product)
            });
        })
    }
}