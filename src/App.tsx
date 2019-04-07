import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChangeEvent } from "react";
import * as SocketIO from "socket.io-client";

import { Youtube } from "./components/Youtube";
import { ChatPanel } from "./components/ChatPanel";

// a lot of code below is just copy paste will need tech debt
import $ = require('jquery');
import { Constants } from "./common/constants";
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
        socket: SocketIOClient.Socket
    }
}

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

        window.socket = io();
        window.socket.on('messageAdded', (msg: any) => {
            this.setState(state => {
                const newMsgs = [...state.messages, msg];

                return {
                    messages: newMsgs
                };
            });
            $('.chat-list').scrollTop($('.chat-list')[0].scrollHeight); // for chat-panel component
        });

        window.socket.on('messageDeleted', (msg: any) => {
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
        if ((event && event.key === 'Enter') || clicked) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            var obj = {
                name: this.state.name,
                message: this.state.message
            };
            this.setState({ message: '' });
            $.post(Constants.baseURL + 'messages', obj);
        }
    }

    deleteMessage(i: number) {
        $.ajax({
            url: Constants.baseURL + 'messages',
            type: 'DELETE',
            data: this.state.messages[i]
        });
    }

    loadMoreMsgs() {
        return Promise.resolve($.get(Constants.baseURL + 'messages', this.state.messages[0], (data: Array<any>) => {
            // console.log(data);
            this.setState(state => {
                const newMsgs = data.concat(state.messages);

                return {
                    messages: newMsgs
                };
            });
        }));
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row h-100">
                    <div className="col-8">
                        <Youtube />
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
        $.get(Constants.baseURL + 'messages', (data: Array<any>) => {
            ReactDOM.render(
                <App messages={data} />,
                document.getElementById("app")
            );
        }).catch(err => {
            console.log(err);
            ReactDOM.render(
                <App messages={[]} />,
                document.getElementById("app")
            );
        });
    });
}
