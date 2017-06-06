import { Server } from '../server';
import { parse } from "url";

let server = new Server("localhost", 3000);

server.get("/")
    .subscribe(e => {
        e.res.json({
            msg: `hello ${e.req.query.name}!`,
        })
    });

server.post('/')
.subscribe(e => {
    e.res.json({
        msg: `Hello, ${e.req.body.name}`
    })
})