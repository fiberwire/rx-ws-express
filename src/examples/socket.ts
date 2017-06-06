import { Observable } from 'rx';
import { SocketServer } from '../socket-server';
import { Message } from "../message";

import * as ws from 'ws';

interface Vote {
    vote: string;
}

interface State {
    keepVotes: number;
    killVotes: number;
}

let serverState: State = {
    keepVotes: 0,
    killVotes: 0
}

let apply = (data: Vote, state: State) => {
    switch (data.vote) {
        case "keep":
            state.keepVotes++;
            break;
        case "kill":
            state.killVotes++;
            break;
    }

    return state;
}

//server
let server = new SocketServer<Vote, State>(serverState, apply);

server.messages
    .subscribe((msg) => {
    })


let clientState: State = {
    keepVotes: 0,
    killVotes: 0
}

//client
let socket = new ws(`http://localhost:${server.port}`)
    .on('open', () => {
        console.log(`(Client): connected to server`);

        Observable.interval(1500)
            .take(5)
            .subscribe(i => {
                socket.send(JSON.stringify({ vote: "kill" }))
                console.log(`(Client): sent vote`);
            });

        socket.on('message', (msg: string) => {
            clientState = JSON.parse(msg);
            console.log(`(Client): received state update: {keeps: ${clientState.keepVotes}, kills: ${clientState.killVotes}}`);
        });
    });