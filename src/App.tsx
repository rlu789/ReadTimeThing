import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SocketIO from "socket.io-client";

import { ChatPanel } from "./components/ChatPanel";

// a lot of code below is just copy paste will need tech debt
import $ = require('jquery');
var head = document.getElementsByTagName('head')[0];
var script: any = document.createElement('script');
script.type = 'text/javascript';
script.src = '/socket.io/socket.io.js'; // load this script dynamically so that compiler doesn't die when compiling react
head.appendChild(script);
script.onreadystatechange = function () {
    if (this.readyState == 'complete') complete();
}
script.onload = complete;

class App extends React.Component<{ messages: Array<any> }, { messages: Array<any>, name: string, message: string }> {
    constructor(props: { messages: Array<any> }) {
        super(props);
        this.state = {
            name: '',
            message: '',
            messages: props.messages
        };

        this.nameChange = this.nameChange.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        var socket: SocketIOClient.Socket = io();
        socket.on('messageAdded', (msg: any) => {
            console.log(msg);
            this.setState(state => {
                const newMsgs = [msg, ...state.messages];

                return {
                    message: '',
                    messages: newMsgs
                };
            });
        });

        socket.on('messageDeleted', (msg: any) => {
            console.log(msg);
            this.setState(state => {
                const newMsgs = state.messages.filter((m) => m._id !== msg._id);

                return {
                    messages: newMsgs
                };
            });
        });
    }

    nameChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ name: event.currentTarget.value });
    }
    messageChange(event: React.FormEvent<HTMLTextAreaElement>) {
        this.setState({ message: event.currentTarget.value });
    }

    sendMessage() {
        var obj = {
            name: this.state.name,
            message: this.state.message
        };
        $.post('http://localhost:3001/messages', obj);
    }
    
    deleteMessage(i: number) {
        $.ajax({
            url: 'http://localhost:3001/messages',
            type: 'DELETE',
            data: this.state.messages[i]
        });
    }

    loadMoreMsgs() {
        $.get('http://localhost:3001/messages', this.state.messages[this.state.messages.length - 1], (data: Array<any>) => {
            // console.log(data);
            this.setState(state => {
                const newMsgs = state.messages.concat(data);

                return {
                    messages: newMsgs
                };
            });
        })
    }

    render() {
        return (
            <div className="container">
                <br />
                <div className="jumbotron">
                    <h1 className="display-4">Send Message</h1>
                    <br />
                    <input className="form-control" placeholder="Name" value={this.state.name} onChange={this.nameChange}></input>
                    <br />
                    <textarea className="form-control" placeholder="Your Message Here" value={this.state.message} onChange={this.messageChange}></textarea>
                    <br />
                    <button onClick={this.sendMessage} className="btn btn-success">Send</button>
                </div>
                <ChatPanel messages={this.state.messages} deleteMessage={this.deleteMessage.bind(this)} loadMoreMsgs={this.loadMoreMsgs.bind(this)} />
            </div>
        );
    }
}

function complete() {
    var msgData: Array<any> = [];
    $(() => {
        getMessages();
    })

    function getMessages() {
        $.get('http://localhost:3001/messages', (data: Array<any>) => {
            ReactDOM.render(
                <App messages={data} />,
                document.getElementById("app")
            );
        })
    }
}
