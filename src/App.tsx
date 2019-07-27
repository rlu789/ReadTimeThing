import * as React from "react";
import * as ReactDOM from "react-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Book from '@material-ui/icons/Book';
import { Lobbies } from "./components/Lobbies";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Test } from "./components/Test";

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
                            <Link to="/test/1">
                                <IconButton color="inherit">
                                    <Book>
                                    </Book>
                                </IconButton>
                            </Link>
                        </Toolbar>
                    </AppBar>

                    <Route path="/" exact component={Lobbies} />
                    <Route path="/test/:id" component={Test} />
                </Router>
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
