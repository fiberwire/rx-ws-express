import * as ws from 'ws';

export interface Message<T> {
    client: ws,
    data: T
}