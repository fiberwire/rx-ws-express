import { Subject, Observable } from 'rxjs/Rx';
import { Event } from './event';
import { Application, Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';

export class Server {

    server: Application;
    requests: Subject<Event>;

    constructor(public host: string = process.env.IP || '127.0.0.1', public port: number = process.env.PORT || '3000') {
        this.requests = new Subject<Event>();
        this.server = express();
        this.server.use(bodyParser.urlencoded({ 'extended': true }));
        this.server.use(bodyParser.json());
        this.server.listen(port, host, (req: Request, res: Response) => {
            this.requests.next({ req, res });
        })
    }

    public get(route: string): Observable<Event> {
        return this.requests
            .filter(e => e.req.method == 'GET')
            .filter(e => e.req.url == route)
    }

    public post(route: string): Observable<Event> {
        return this.requests
            .filter(e => e.req.method == 'POST')
            .filter(e => e.req.url == route)
    }

    public put(route: string): Observable<Event> {
        return this.requests
        .filter(e => e.req.method == 'PUT')
        .filter( e=> e.req.url == route)
    }

    public delete(route: string): Observable<Event> {
        return this.requests
            .filter(e => e.req.method == 'DELETE')
            .filter(e => e.req.url == route)
    }
}