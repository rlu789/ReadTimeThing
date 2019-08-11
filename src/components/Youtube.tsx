import * as React from "react";
import { TextField, IconButton } from "@material-ui/core";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import Slider from '@material-ui/lab/Slider';
import $ = require('jquery');
import { CueVid, VideoState, VideoStateClient } from "../_backend/youtubeHandler";

interface YoutubeProps {
    roomId: string
}
interface YoutubeState {
    audioValue: number;
}

export class Youtube extends React.Component<YoutubeProps, YoutubeState> {
    private ytPlayer: any;
    constructor(props: YoutubeProps) {
        super(props);
        var self = this;

        var ytState = $.get("/youtube", { roomId: this.props.roomId });

        if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) { // youtube script hasnt been added
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag.parentNode)
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            else throw Error("Unable to add https://www.youtube.com/iframe_api script tag");

            window.onYouTubeIframeAPIReady = function () {
                self.initPlayer(ytState);
            };
        }
        else {
            this.initPlayer(ytState);
        }

        this.state = {
            audioValue: 100
        };
    }

    changeAudio(event: React.ChangeEvent<{}>, audioValue: number) {
        this.setState({ audioValue: audioValue });
        this.ytPlayer.setVolume(audioValue);
    }

    initPlayer(ytState: JQuery.jqXHR<any>) {
        var self = this;
        ytState.then((res: VideoStateClient | null) => {
            var settings = {
                videoId: '',
                playerVars: {
                    origin: window.location.origin, disablekb: 1, controls: 1, start: 0,
                },
                events: {
                    'onReady': () => { },
                    'onStateChange': () => { }
                }
            };
            if (res) {
                settings.videoId = res.id;
                settings.events.onReady = function () {
                    if (res.isPaused) {
                        self.ytPlayer.seekTo(res.timeOffset);
                        self.ytPlayer.playVideo();
                        self.ytPlayer.pauseVideo();
                    }
                    if (!res.isPaused) {
                        self.ytPlayer.seekTo(res.timeOffset + ((new Date().getTime() - new Date(res.startDate).getTime()) / 1000));
                        self.ytPlayer.playVideo();
                    }
                }
            }
            // @ts-ignore
            self.ytPlayer = new YT.Player('player', settings);
        })

        window.socket.on('cueVideo', (res: string) => {
            self.ytPlayer.cueVideoById(res);
            self.ytPlayer.seekTo(0);
            self.ytPlayer.playVideo();
            self.ytPlayer.pauseVideo();
        });
        window.socket.on('playVideo', () => {
            self.ytPlayer.playVideo();
        });
        window.socket.on('pauseVideo', () => {
            self.ytPlayer.pauseVideo();
        });
    }

    cueVideo(event: React.KeyboardEvent<HTMLDivElement>) {
        var input!: HTMLInputElement;
        if (event.key === 'Enter') {
            input = event.target as HTMLInputElement;
            var video_id = input.value.split('v=')[1];
            if (video_id) {
                var ampersandPosition = video_id.indexOf('&');
                if (ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }
            }
            else video_id = input.value;

            var cue: CueVid = {
                vidId: video_id,
                roomId: this.props.roomId
            };
            window.socket.emit('cueVideo', cue);
        }
    }

    playVideo() {
        window.socket.emit('playVideo', this.props.roomId);
    }

    pauseVideo() {
        window.socket.emit('pauseVideo', this.props.roomId);
    }

    render() {
        return (
            <div className="youtube">
                <div className="row no-gutters">
                    <TextField
                        label="Youtube URL"
                        margin="normal"
                        fullWidth={true}
                        onKeyDownCapture={(e) => this.cueVideo(e)}
                        defaultValue="https://www.youtube.com/watch?v=-2-lW9rYmh4"
                    />
                    <div className="youtube-controls">
                        <IconButton onClick={this.playVideo.bind(this)}>
                            <PlayCircleFilled />
                        </IconButton>
                        <IconButton onClick={this.pauseVideo.bind(this)}>
                            <PauseCircleFilled />
                        </IconButton>
                        <Slider className="audio-slider" onChange={(e, v) => this.changeAudio(e, v)} value={this.state.audioValue} />
                    </div>
                </div>
                <div className="row no-gutters">
                    <div id="player" tabIndex={-1}>
                    </div>
                </div>
            </div>
        );
    }
}