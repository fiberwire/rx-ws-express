import {Request, Response} from 'express';

export interface RequestResponse {
    req: Request;
    res: Response;
}