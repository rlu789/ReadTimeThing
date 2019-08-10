import * as React from "react";
import { TextField, IconButton } from "@material-ui/core";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilled from "@material-ui/icons/PauseCircleFilled";
import Slider from '@material-ui/lab/Slider';
import $ = require('jquery');

interface YoutubeProps {

}
interface YoutubeState {
}

export class Youtube extends React.Component<YoutubeProps, YoutubeState> {
    private ytPlayer: any;
    constructor(props: YoutubeProps) {
        super(props);
    }

    componentDidMount() {
        var self = this;

        if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) { // youtube script hasnt been added
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag.parentNode)
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            else throw Error("Unable to add https://www.youtube.com/iframe_api script tag");

            window.onYouTubeIframeAPIReady = function () {
                self.initPlayer();
            };
        }
        else {
            this.initPlayer();
        }
    }

    initPlayer() {
        // @ts-ignore
        self.ytPlayer = new YT.Player('player', {
            videoId: 'M7lc1UVf-VE',
            playerVars: { 'origin': window.location.origin }
        });
    }

    playVideo() {
        
    }

    pauseVideo() {

    }

    render() {
        return (
            <div className="youtube">
                <div className="youtube-controls">
                    <IconButton onClick={this.playVideo}>
                        <PlayCircleFilled />
                    </IconButton>
                    <IconButton onClick={this.pauseVideo.bind(this)}>
                        <PauseCircleFilled />
                    </IconButton>
                    {/* <Slider className="audio-slider" onChange={(e, v) => this.changeAudio(e, v)} value={this.state.audioValue} /> */}
                </div>
                <div id="player" tabIndex={-1}>
                </div>
            </div>
        );
    }
}