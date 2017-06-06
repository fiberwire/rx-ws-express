import { Observable, Subject } from 'rx';
import * as ws from 'ws';

export class SocketClient<T, U> {

    i: Subject<U>
    o: Subject<T>

    socket: ws

    constructor(address: string) {
        this.i = new Subject<U>();
        this.o = new Subject<T>();

        this.initialize(address);
    }

    public get messages(): Observable<U> {
        return this.i;
    }

    public send(data: T) {
        this.o.onNext(data);
    }

    private initialize(address: string){
        this.socket = new ws(address);

        this.socket.on('open', () => {
            this.socket.on('message', (data: string) => {
                this.i.onNext(JSON.parse(data));
            })
            this.o.subscribe(data => {
                this.socket.send(JSON.stringify(data));
            })
        })
    }
}