import { Server } from '../server';

let server = new Server("localhost", 3000);

server.get("/")
    .subscribe(e => {
        e.res.json({
            msg: "hello world!",
        })
    });

server.post('/')
.subscribe(e => {
    e.res.json({
        msg: `Hello, ${e.req.body.name}`
    })
})