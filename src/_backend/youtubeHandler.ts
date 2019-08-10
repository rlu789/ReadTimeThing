import express = require('express');
import ioImport = require('socket.io');

export interface VideoState {
    id: string;
    startDate: Date | null;
    isPaused: boolean;
    timeOffset: number;
}
export interface VideoStateClient {
    id: string;
    startDate: Date;
    isPaused: boolean;
    timeOffset: number;
}

export interface CueVid {
    vidId: string;
    roomId: string;
}

export class YoutubeHandler {
    private videos: {[roomId: string]: VideoState} = {};

    constructor(public app: express.Application, public io: ioImport.Server) {
        app.get('/youtube', (req, res) => {
            var roomId = req.query.roomId;
            var videoState = this.videos[roomId];
            if (videoState) {
                res.status(200).send(videoState);
            }
            else {
                this.videos[roomId] = {
                    id: '',
                    startDate: null,
                    isPaused: true,
                    timeOffset: 0
                };
                res.send();
            }
        });
    }

    public registerEvents (socket: ioImport.Socket) {
        socket.on('cueVideo', (cue: CueVid) => {
            this.videos[cue.roomId] = {
                id: cue.vidId,
                startDate: null,
                isPaused: true,
                timeOffset: 0
            };
            this.io.in(cue.roomId).emit('cueVideo', cue.vidId);
        });

        socket.on('playVideo', (roomId: string) => {
            this.videos[roomId].startDate = new Date();
            this.videos[roomId].isPaused = false;
            this.io.in(roomId).emit('playVideo');
        });

        socket.on('pauseVideo', (roomId: string) => {
            var pauseDate = new Date();
            if (this.videos[roomId].startDate)
                this.videos[roomId].timeOffset += (pauseDate.getTime() - (<Date>this.videos[roomId].startDate).getTime()) / 1000;
            this.videos[roomId].isPaused = true;
            console.log(this.videos[roomId]);
            this.io.in(roomId).emit('pauseVideo');
        });
    }
}