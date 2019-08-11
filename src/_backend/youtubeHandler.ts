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
    private videos: { [roomId: string]: { state: VideoState, timeout: boolean } } = {};

    private setupVid(roomId: string, vidId: string = '') {
        this.videos[roomId] = {
            state: {
                id: vidId,
                startDate: null,
                isPaused: true,
                timeOffset: 0
            },
            timeout: false
        };
    }

    private resetVid(roomId: string, vidId: string = '') {
        this.videos[roomId].state = {
            id: vidId,
            startDate: null,
            isPaused: true,
            timeOffset: 0
        };
    }

    private setRoomTimeout(roomId: string) {
        // prevent spamming of actions
        var self = this;
        self.videos[roomId].timeout = true;
        setTimeout(function () {
            console.log('timeout completed');
            self.videos[roomId].timeout = false;
        }, 1000);
    }

    constructor(public app: express.Application, public io: ioImport.Server) {
        app.get('/youtube', (req, res) => {
            var roomId = req.query.roomId;
            var video = this.videos[roomId];
            if (video) {
                res.status(200).send(video.state);
            }
            else {
                this.setupVid(roomId);
                res.send();
            }
        });
    }

    public registerEvents(socket: ioImport.Socket) {
        var self = this;
        var doActionWithTimeout = function (roomId: string, callback: () => void) {
            var v = self.videos[roomId];
            if (v.timeout)
                socket.emit("videoTimeout");
            else {
                self.setRoomTimeout(roomId);
                callback();
            }
        };

        socket.on('cueVideo', (cue: CueVid) => {
            this.resetVid(cue.roomId, cue.vidId);
            doActionWithTimeout(cue.roomId, () => {
                this.io.in(cue.roomId).emit('cueVideo', cue.vidId);
            });
        });

        socket.on('playVideo', (roomId: string) => {
            doActionWithTimeout(roomId, () => {
                var v = this.videos[roomId];
                v.state.startDate = new Date();
                v.state.isPaused = false;
                this.io.in(roomId).emit('playVideo');
            });
        });

        socket.on('pauseVideo', (roomId: string) => {
            doActionWithTimeout(roomId, () => {
                var v = this.videos[roomId];
                var pauseDate = new Date();
                if (v.state.startDate)
                    v.state.timeOffset += (pauseDate.getTime() - (<Date>v.state.startDate).getTime()) / 1000;
                v.state.isPaused = true;
                // console.log(v);
                this.io.in(roomId).emit('pauseVideo');
            });
        });
    }
}