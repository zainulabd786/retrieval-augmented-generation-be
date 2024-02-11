import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from 'express';

export function invalidPayloadError(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    next();
}