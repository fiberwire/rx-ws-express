import { Event } from './event';
import { Application, Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Subject, Observable } from "rx";

export class Server {

    server: Application;
    requests: Subject<Event>;

    constructor(public host: string = process.env.IP || '127.0.0.1', public port: number = process.env.PORT || '3000') {
        this.requests = new Subject<Event>();
        this.server = express();
        this.server.use(bodyParser.urlencoded({ 'extended': true }));
        this.server.use(bodyParser.json());

        this.server.get('*', (req: Request, res: Response) => {
            this.log({ req, res })
            this.requests.onNext({ req, res });
        })

        this.server.post('*', (req: Request, res: Response) => {
            this.log({ req, res })
            this.requests.onNext({ req, res });
        })

        this.server.delete('*', (req: Request, res: Response) => {
            this.log({ req, res })
            this.requests.onNext({ req, res });
        })

        this.server.put('*', (req: Request, res: Response) => {
            this.log({ req, res })
            this.requests.onNext({ req, res });
        })

        this.server.listen(port);
        console.log(`Listening on port ${port}...`);
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
            .filter(e => e.req.url == route)
    }

    public delete(route: string): Observable<Event> {
        return this.requests
            .filter(e => e.req.method == 'DELETE')
            .filter(e => e.req.url == route)
    }

    private log(e: Event): void {
        console.log(`Received request ${e.req.method}: ${e.req.url}`);
    }
}