import * as React from "react";
import { TextField, IconButton } from "@material-ui/core";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import FastForward from "@material-ui/icons/FastForward";
import FastRewind from "@material-ui/icons/FastRewind";
import Slider from '@material-ui/lab/Slider';
import Snackbar from '@material-ui/core/Snackbar';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import $ = require('jquery');
import { CueVid, VideoState } from "../_backend/youtubeHandler";
import { createScript } from "../utils/common";

interface YoutubeProps {
    roomId: string
}
interface YoutubeState {
    videoCued: boolean;
    audioValue: number;
    snackBarOpen: boolean;
    videoCuedOpen: boolean;
    popoverOpen: boolean;
}

export class Youtube extends React.Component<YoutubeProps, YoutubeState> {
    private ytPlayer: any;
    constructor(props: YoutubeProps) {
        super(props);
        var self = this;

        this.state = {
            audioValue: 100,
            snackBarOpen: false,
            videoCued: false,
            videoCuedOpen: false,
            popoverOpen: false
        };

        var ytState = $.get("/youtube", { roomId: this.props.roomId });

        createScript("https://www.youtube.com/iframe_api", () => {
            window.onYouTubeIframeAPIReady = function () {
                self.initPlayer(ytState);
            };
        }, () => {
            throw Error("Unable to add https://www.youtube.com/iframe_api script tag");
        }, () => {
            self.initPlayer(ytState);
        });
    }

    changeAudio(event: React.ChangeEvent<{}>, audioValue: number) {
        this.setState({ audioValue: audioValue });
        this.ytPlayer.setVolume(audioValue);
    }

    seekBasedOnState(state: VideoState) {
        if (state.isPaused) {
            this.ytPlayer.seekTo(state.timeOffset);
            this.ytPlayer.playVideo();
            this.ytPlayer.pauseVideo();
        }
        if (!state.isPaused) {
            var startDate = state.startDate as Date;
            this.ytPlayer.seekTo(state.timeOffset + ((new Date().getTime() - new Date(startDate).getTime()) / 1000));
            this.ytPlayer.playVideo();
        }
    }

    initPlayer(ytState: JQuery.jqXHR<any>) {
        var self = this;
        ytState.then((res: VideoState | null) => {
            var settings = {
                videoId: '',
                playerVars: {
                    origin: window.location.origin, disablekb: 1, controls: 0, start: 0,
                },
                events: {
                    'onReady': () => { },
                    'onStateChange': () => { }
                },
                width: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? undefined: 1600,
                height: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? undefined: 700
            };
            if (res && res.id) {
                settings.videoId = res.id;
                settings.events.onReady = function () {
                    self.seekBasedOnState(res);
                    self.setState({ videoCued: true });
                }
            }
            // @ts-ignore
            self.ytPlayer = new YT.Player('player', settings);
        });

        window.socket.on('cueVideo', (res: string) => {
            self.ytPlayer.cueVideoById(res);
            self.ytPlayer.seekTo(0);
            self.ytPlayer.playVideo();
            self.ytPlayer.pauseVideo();
            self.setState({ videoCued: true, videoCuedOpen: true });
        });
        window.socket.on('playVideo', () => {
            self.ytPlayer.playVideo();
        });
        window.socket.on('pauseVideo', () => {
            self.ytPlayer.pauseVideo();
        });
        window.socket.on('seekVideo', (res: VideoState) => {
            self.seekBasedOnState(res);
        });
        window.socket.on('videoTimeout', () => {
            this.setState({
                snackBarOpen: true
            });
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

    seekVideo(by: number) {
        window.socket.emit('seekVideo', { by: by, roomId: this.props.roomId });
    }

    snackBarClose(event: object, reason: string) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            snackBarOpen: false
        });
    }

    componentWillUnmount() {
        window.socket.off("cueVideo");
        window.socket.off("playVideo");
        window.socket.off("pauseVideo");
        window.socket.off("seekVideo");
        window.socket.off("videoTimeout");
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
                        defaultValue="https://www.youtube.com/watch?v=QzLgBxUC_Yc"
                    />
                    {this.state.videoCued ? <div className="fade-in youtube-controls">
                        <IconButton onClick={this.playVideo.bind(this)}>
                            <PlayCircleFilled />
                        </IconButton>
                        <IconButton onClick={this.pauseVideo.bind(this)}>
                            <PauseCircleFilled />
                        </IconButton>
                        <IconButton onClick={this.seekVideo.bind(this, -10)}>
                            <FastRewind />
                        </IconButton>
                        <IconButton onClick={this.seekVideo.bind(this, 10)}>
                            <FastForward />
                        </IconButton>
                        <Slider className="audio-slider" onChange={(e, v) => this.changeAudio(e, v)} value={this.state.audioValue} />
                    </div> : <p className="mx-auto">Load Youtube videos by inserting a Youtube URL into the text field and then pressing 'Enter'</p>}
                </div>
                <div hidden={!this.state.videoCued} className="fade-in row no-gutters"
                    onMouseEnter={() => { this.setState({ popoverOpen: true }) }}
                    onMouseLeave={() => { this.setState({ popoverOpen: false }) }}>
                    <div id="player" tabIndex={-1}>
                    </div>
                </div>
                <Popover
                    open={this.state.popoverOpen}
                    disableRestoreFocus
                >
                    <Typography>I use Popover.</Typography>
                </Popover>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={this.state.snackBarOpen}
                    onClose={this.snackBarClose.bind(this)}
                    autoHideDuration={1000}
                    message={<span>Please wait.</span>}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={this.state.videoCuedOpen}
                    onClose={() => { this.setState({ videoCuedOpen: false }); }}
                    autoHideDuration={1000}
                    message={<span>Video queued, ready to play</span>}
                />
            </div>
        );
    }
}