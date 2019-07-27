import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChangeEvent } from "react";
import * as SocketIO from "socket.io-client";

// a lot of code below is just copy paste will need tech debt
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
            <div className="container-fluid">
                test
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
