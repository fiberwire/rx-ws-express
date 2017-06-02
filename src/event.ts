import {Request, Response} from 'express';

export interface Event {
    req: Request;
    res: Response;
}