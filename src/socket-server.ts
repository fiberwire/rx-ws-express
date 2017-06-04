import { Subject, Observable } from 'rx';
import * as ws from 'ws';
import { Server } from './server';

export class SocketServer<T> extends Server {

    private i: Subject<T>;
    private o: Subject<T>;

    public sockets: ws.Server

    constructor(
        public host: string = process.env.HOST || "localhost",
        public port: number = process.env.PORT || 3000,
        public socketPort: number = port + 1) {
        super(host, port);

        this.i = new sub

        this.sockets = new ws.Server({ host, port: socketPort });

        this.sockets.on('open', () => {
            console.log(`Socket server started on ${socketPort}`)
        })

        this.sockets.on('connection', (client, request) => {
            console.log(`client connected: @${client.url}: ${request.method}: ${request.url}`)
            client.on('message', (data: string) => {
                this.i.onNext(JSON.parse(data));
            })
        })
    }

    get messages(): Observable<T> {
        return this.i;
    }
}