import * as React from "react";
import * as ReactDOM from "react-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Lobby } from "./components/Lobby";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Room } from "./components/Room";
import stateManager from "./utils/state";
import $ = require('jquery');
import { ClientData } from "./_backend/clientManager";

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
        onYouTubeIframeAPIReady: (() => void) | undefined;
        socket: SocketIOClient.Socket;
    }
}

class App extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="app">
                <Router>
                    <AppBar position="static">
                        <Toolbar>
                            <Link to="/">
                                <IconButton color="inherit">
                                    <HomeIcon>
                                    </HomeIcon>
                                </IconButton>
                            </Link>
                        </Toolbar>
                    </AppBar>

                    <Route path="/" exact component={Lobby} />
                    <Route path="/room/:id" component={Room} />
                </Router>
            </div>
        );
    }
}

function complete() {
    window.socket = io();
    window.socket.on('connect', function () {
        // window.socket.id exists after the connect event
        $.get("/user", { id: window.socket.id }, (res: ClientData) => {
            stateManager.set("user", res.name);
            ReactDOM.render(
                <App />,
                document.getElementById("app")
            );
        });
    });
}
