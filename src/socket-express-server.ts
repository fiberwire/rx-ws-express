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