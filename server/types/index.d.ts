import { Request, Response } from 'express';

interface IndexRequest extends Request {
    body: {
        title: string;
    },
    params: {
        id: string;
    },
    query: {
        type: string;
    }
}