import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChangeEvent } from "react";
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

interface AppState {
    messages: Array<any>, name: string, message: string
}

class App extends React.Component<{ messages: Array<any> }, AppState> {
    constructor(props: { messages: Array<any> }) {
        super(props);
        this.state = {
            name: '',
            message: '',
            messages: props.messages
        };

        var socket: SocketIOClient.Socket = io();
        socket.on('messageAdded', (msg: any) => {
            this.setState(state => {
                const newMsgs = [...state.messages, msg];

                return {
                    messages: newMsgs
                };
            });
            $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight); // for chat-panel component
        });

        socket.on('messageDeleted', (msg: any) => {
            this.setState(state => {
                const newMsgs = state.messages.filter((m) => m._id !== msg._id);

                return {
                    messages: newMsgs
                };
            });
        });
    }

    handleChange(key: string, event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        var v = event.currentTarget.value;
        this.setState(prevState => ({
            ...prevState,
            [key]: v,
        }))
    }

    sendMessage(event?: React.KeyboardEvent<HTMLDivElement>, clicked?: boolean) {
        if ((event && event.key == 'Enter') || clicked) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            var obj = {
                name: this.state.name,
                message: this.state.message
            };
            this.setState({ message: '' });
            $.post('http://localhost:3001/messages', obj);
        }
    }

    deleteMessage(i: number) {
        $.ajax({
            url: 'http://localhost:3001/messages',
            type: 'DELETE',
            data: this.state.messages[i]
        });
    }

    loadMoreMsgs() {
        $.get('http://localhost:3001/messages', this.state.messages[0], (data: Array<any>) => {
            // console.log(data);
            this.setState(state => {
                const newMsgs = data.concat(state.messages);

                return {
                    messages: newMsgs
                };
            });
            $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight); // for chat-panel component
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row h-100">
                    <div className="col-8">
                        <div className="jumbotron">
                            <h1 className="display-4">Page Content</h1>
                        </div>
                    </div>
                    <div className="col-4 h-100">
                        <ChatPanel name={this.state.name} message={this.state.message} messages={this.state.messages} deleteMessage={this.deleteMessage.bind(this)} loadMoreMsgs={this.loadMoreMsgs.bind(this)}
                            handleChange={this.handleChange.bind(this)} sendMessage={this.sendMessage.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

function complete() {
    $(() => {
        $.get('http://localhost:3001/messages', (data: Array<any>) => {
            ReactDOM.render(
                <App messages={data} />,
                document.getElementById("app")
            );
        });
    });
}
