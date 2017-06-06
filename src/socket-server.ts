import { Message } from './message';
import { Subject, Observable, Scheduler, IDisposable, BehaviorSubject } from 'rx';
import * as WebSocket from 'ws';
import { Server } from './server';

export class SocketServer<T, U> {

    private i: Subject<Message<T>>;
    private o: BehaviorSubject<U>;

    public server: WebSocket.Server
    private _state: U

    constructor(
        public initialState: U,
        public apply: (data: T, state: U) => U,
        public host: string = process.env.HOST || "localhost",
        public port: number = process.env.PORT || 3001,
        public fps: number = 1,
    ) {

        this._state = initialState;

        this.i = new Subject<Message<T>>();
        this.o = new BehaviorSubject<U>(this._state);

        this.initialize(host, port);
        this.listen(this.i);
        this.applyChanges();
        this.syncState(fps);
        this.broadcastState();
    }

    public get messages(): Observable<Message<T>> {
        return this.i;
    }

    public get state(): Observable<U> {
        return this.o;
    }

    public setState(state: U){
        this._state = state;
    }

    public broadcast(state: U) {
        this.server.clients.forEach(client => {
            client.send(JSON.stringify(state));
        })
    }

    private broadcastState(): IDisposable {
        return this.state
            .do(s => console.log(`(Server): broadcasting state`))
            .subscribe(state => this.broadcast(state));
    }

    private syncState(fps: number): IDisposable {
        return Observable.interval(1000 / fps)
            .do(t => {
                this.o.onNext(this._state);
                console.log(`(Server): synced state`);
            })
            .subscribe();
    }

    private applyChanges(): IDisposable {
        return this.messages
            .do(msg => console.log(`(Server): applying changes`))
            .map(msg => msg.data)
            .map(data => this.apply(data, this._state))
            .subscribe(state => this._state = state);
    }

    private initialize(host: string, port: number) {
        console.log(`(Server): starting socket server`)
        this.server = new WebSocket.Server({ host, port });

        this.server.on('open', () => {
            console.log(`(Server): Socket server started on ${port}`)
        })
    }

    private listen(i: Subject<Message<T>>) {
        this.server.on('connection', (client, request) => {
            console.log(`(Server): client connected`)

            //send client the server state on connection
            client.send(JSON.stringify(this._state));

            //parse and add data to i
            client.on('message', (data: string) => {
                console.log(`(Server): received data: ${data}`);
                i.onNext({ client, data: JSON.parse(data) });
            })

            client.on('close', (code, message) => {
                console.log(`(Server): client disconnected: code: ${code}, message: ${message}`);
            })
        })
    }
}