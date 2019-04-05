import * as React from "react";
import { TextField } from "@material-ui/core";

interface YoutubeProps {

}

interface YoutubeState {
    scriptLoaded: boolean;
    player: any;
}

declare global {
    interface Window { onYouTubeIframeAPIReady: (() => void) | undefined }
}

export class Youtube extends React.Component<YoutubeProps, YoutubeState> {
    constructor(props: YoutubeProps) {
        super(props);

        var self = this;
        window.onYouTubeIframeAPIReady = function () {
            self.setState({ scriptLoaded: true });
            window.onYouTubeIframeAPIReady = undefined;
        }
        this.state = {
            scriptLoaded: false,
            player: null
        };

        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag.parentNode)
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        else throw Error("Unable to add https://www.youtube.com/iframe_api script tag");
    }

    loadVideo(event: React.KeyboardEvent<HTMLDivElement>) {
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

            if (this.state.player) {
                this.state.player.cueVideoById(video_id);
            }
            else {
                this.setState({ player: 
                    // @ts-ignore
                    new YT.Player('player', {
                        height: '768',
                        width: '1024',
                        videoId: video_id,
                    }) 
                });
            }
        }
    }

    render() {
        const scriptLoaded = this.state.scriptLoaded;
        var element: React.ReactElement;

        if (scriptLoaded) {
            element = (<div id="player"></div>);
        }
        else element = <div></div>;

        return (
            <div className="youtube-container">
                <TextField
                    label="Youtube URL"
                    margin="normal"
                    fullWidth={true}
                    onKeyDownCapture={(e) => this.loadVideo(e)}
                />
                {element}
            </div>
        );
    }
}