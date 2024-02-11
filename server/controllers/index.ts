import { Response } from 'express';
import type { IndexRequest } from '../types';

export function index(req: IndexRequest, res: Response) {
    const { title } = req.body;
    const { id } = req.params;
    const { type } = req.query; 
    res.status(200).json({ 
        title,
        id,
        type
     })
}
