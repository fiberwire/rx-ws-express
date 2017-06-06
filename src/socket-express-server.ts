import { Message } from './message';
import { Observable } from 'rx';
import { RequestResponse } from './../out/src/request-response.d';
import { SocketServer } from './socket-server';
import { Server } from './server';

export class SocketExpressServer<T, U> {

    express: Server
    socket: SocketServer<T, U>
    constructor(
        initialState: U,
        apply: (data: T, state: U) => U,
        public host: string = process.env.HOST || "localhost",
        public httpPort: number = process.env.PORT || 3001,
        public socketPort: number = httpPort + 1,
    ) {
        this.express = new Server(host, httpPort);
        this.socket = new SocketServer<T, U>(
            initialState,
            apply,
            host,
            socketPort
        );
    }

    public get requests(): Observable<RequestResponse> {
        return this.express.requests;
    }

    public get messages(): Observable<Message<T>> {
        return this.socket.messages;
    }

    public get state(): Observable<U> {
        return this.socket.state;
    }
}