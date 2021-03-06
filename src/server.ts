import { RequestResponse } from './request-response';
import { Application, Request, Response } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Subject, Observable } from "rx";
import { parse } from 'url';

export class Server {

    server: Application;
    requests: Subject<RequestResponse>;

    constructor(public host: string = process.env.IP || '127.0.0.1', public port: number = process.env.PORT || '3000') {
        this.requests = new Subject<RequestResponse>();
        this.server = express();
        this.server.use(bodyParser.urlencoded({ 'extended': true }));
        this.server.use(bodyParser.json());

        this.server.use((req: Request, res: Response) => {
            this.log({ req, res });
            this.requests.onNext({ req, res });
        })

        this.server.listen(port);
        console.log(`(Server): Listening on port ${port}...`);
    }

    public get(route: string): Observable<RequestResponse> {
        return this.requests
            .filter(e => e.req.method == 'GET')
            .filter(e => parse(e.req.url).pathname == route)
    }

    public post(route: string): Observable<RequestResponse> {
        return this.requests
            .filter(e => e.req.method == 'POST')
            .filter(e => parse(e.req.url).pathname == route)
    }

    public put(route: string): Observable<RequestResponse> {
        return this.requests
            .filter(e => e.req.method == 'PUT')
            .filter(e => parse(e.req.url).pathname == route)
    }

    public delete(route: string): Observable<RequestResponse> {
        return this.requests
            .filter(e => e.req.method == 'DELETE')
            .filter(e => parse(e.req.url).pathname == route)
    }

    private log(e: RequestResponse): void {
        console.log(`Received request ${e.req.method}: ${e.req.originalUrl}`);
    }
}