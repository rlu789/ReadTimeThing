import * as React from "react";
import { TextField, IconButton } from "@material-ui/core";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import $ = require('jquery');

interface YoutubeProps {

}

interface YoutubeState {
    scriptLoaded: boolean;
    videoCued: boolean;
    videoPlaying: boolean;
    player: any; // youtube iframe api
}

export class Youtube extends React.Component<YoutubeProps, YoutubeState> {
    private readonly constants = {
        YTPlaying: 1
    }

    constructor(props: YoutubeProps) {
        super(props);

        var self = this;
        window.onYouTubeIframeAPIReady = function () {
            self.setState({ scriptLoaded: true });
            window.onYouTubeIframeAPIReady = undefined;
        }
        this.state = {
            scriptLoaded: false,
            videoCued: false,
            videoPlaying: false,
            player: null
        };

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag.parentNode)
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        else throw Error("Unable to add https://www.youtube.com/iframe_api script tag");

        window.socket.on('cueVideo', (video_id: string) => {
            this.setState({ videoCued: false });
            if (this.state.player) {
                this.state.player.cueVideoById(video_id);
                this.setState({ videoCued: true });
            }
            else {
                this.setState({
                    player:
                        // @ts-ignore
                        new YT.Player('player', {
                            height: '768',
                            // width: '1024',
                            videoId: video_id,
                            events: {
                                'onReady': () => {
                                    this.setState({ videoCued: true })
                                },
                                'onStateChange': (event: any) => {
                                    console.log(event.data);
                                }
                            }
                        })
                });
            }
        });

        window.socket.on('playVideo', () => {
            if (this.state.player) {
                this.setState({ videoPlaying: true });
                this.state.player.playVideo();
            }
        });

        window.socket.on('pauseVideo', () => {
            if (this.state.player) {
                this.setState({ videoPlaying: false });
                this.state.player.pauseVideo();
            }
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

            $.ajax({
                url: 'http://localhost:3001/cueVideo',
                type: 'POST',
                data: { video_id: video_id }
            });
        }
    }

    playVideo() {
        $.ajax({
            url: 'http://localhost:3001/playVideo',
            type: 'POST'
        });
    }

    pauseVideo() {
        $.ajax({
            url: 'http://localhost:3001/pauseVideo',
            type: 'POST'
        });
    }

    componentDidUpdate() {
        // TODO fix tab issue
        // if (this.state.videoCued)
        //     $(".ytp-large-play-button.ytp-button").attr('tabindex', () => -1);
    }

    render() {
        const scriptLoaded = this.state.scriptLoaded;
        var element: React.ReactElement = <div></div>, controls: React.ReactElement = <div></div>;

        if (scriptLoaded) {
            element = (<div id="player"></div>);
        }

        if (this.state.videoCued) {
            controls = (
                <div>
                    <IconButton disabled={this.state.videoPlaying} onClick={this.playVideo}>
                        <PlayCircleFilled />
                    </IconButton>
                    <IconButton disabled={!this.state.videoPlaying} onClick={this.pauseVideo}>
                        <PauseCircleFilled />
                    </IconButton>
                </div>
            );
        }

        return (
            <div className="youtube-container">
                <TextField
                    label="Youtube URL"
                    margin="normal"
                    fullWidth={true}
                    onKeyDownCapture={(e) => this.cueVideo(e)}
                    value="https://www.youtube.com/watch?v=RCU_rC_3m88"
                />
                {controls}
                {element}
            </div>
        );
    }
}