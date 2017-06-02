
import { Subject } from "rxjs/Rx";
import { Server } from 'ws';

export class SocketServer {

    public i: Subject<string>;
    public o: Subject<string>;
    
    public server: Server

    constructor(public port: number) {
        this.server = new Server({port});
    }
}