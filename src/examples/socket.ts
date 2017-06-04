import { SocketServer } from '../socket-server';
import { Message } from "../message";

import * as ws from 'ws';

let server = new SocketServer<Message<string>>();

server.messages
    .subscribe((msg) => {
        console.log(`client: ${msg.client.url} data: ${msg.data}`);
    })

let socket = new ws(`http://${server.host}:${server.port}`);
socket.send(JSON.stringify({ name: "andrew" }));