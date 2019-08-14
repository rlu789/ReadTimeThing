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
import { createScript } from "./utils/common";
import { ChessBoardFactory } from "chessboardjs";

createScript('/socket.io/socket.io.js', complete);
window.$ = window.jQuery = $; // for chessboardjs

declare global {
    interface Window {
        onYouTubeIframeAPIReady: (() => void) | undefined;
        socket: SocketIOClient.Socket;
        $: JQueryStatic;
        jQuery: JQueryStatic;
        Chessboard: ChessBoardFactory;
    }
}

class App extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);

        window.socket.on('disconnect', (reason: string) => {
            console.log('disconnected');
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                window.socket.connect();
            }
            // else the socket will automatically try to reconnect
        });

        window.socket.on('reconnect', (attemptNumber: number) => {
            console.log('reconnect' + attemptNumber);
        });
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
