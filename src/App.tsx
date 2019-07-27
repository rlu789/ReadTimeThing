import * as React from "react";
import * as ReactDOM from "react-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Lobbies } from "./components/Lobbies";

var head = document.getElementsByTagName('head')[0];
var script: any = document.createElement('script');
script.type = 'text/javascript';
script.src = '/socket.io/socket.io.js'; // load this script dynamically so that compiler doesn't die when compiling react
head.appendChild(script);
script.onreadystatechange = function () {
    if (this.readyState == 'complete') complete();
}
script.onload = complete;

declare global {
    interface Window {
        socket: SocketIOClient.Socket
    }
}

class App extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};

        window.socket = io();
    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="menu">
                            <HomeIcon></HomeIcon>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div className="container">
                    <div className="row">
                        <Lobbies></Lobbies>
                    </div>
                </div>
            </div>
        );
    }
}

function complete() {
    ReactDOM.render(
        <App />,
        document.getElementById("app")
    );
}
