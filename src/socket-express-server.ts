import { RequestResponse } from './request-response';
import { Message } from './message';
import { Observable } from 'rx';
import { SocketServer } from './socket-server';
import { Server } from './server';

export class SocketExpressServer<T, U> {

    private express: Server
    private socket: SocketServer<T, U>

    constructor(
        initialState: U,
        apply: (data: T, state: U) => U,
        public host: string = process.env.HOST || "localhost",
        public port: number = process.env.PORT || 3000
    ) {
        this.express = new Server(host, port);
        this.socket = new SocketServer<T, U>(
            initialState,
            apply,
            port,
            this.express.server,
        );
    }

    public get requests(): Observable<RequestResponse> {
        return this.express.requests;
    }

    public get messages(): Observable<Message<T>> {
        return this.socket.messages;
    }

    public get currentState(): Observable<U> {
        return this.socket.currentState;
    }

    public get state(): U {
        return this.socket.state;
    }

    public set state(state: U) {
        this.socket.state = state;
    }

    public broadcast(state: U) {
        this.socket.broadcast(state);
    }

    public get(route: string): Observable<RequestResponse> {
        return this.express.get(route);
    }

    public post(route: string): Observable<RequestResponse> {
        return this.express.post(route);
    }

    public put(route: string): Observable<RequestResponse> {
        return this.express.put(route);
    }

    public delete(route: string): Observable<RequestResponse> {
        return this.express.delete(route);
    }

}