import { Request, Response } from 'express';
import { SchemaFor, Schemas as SchemasType } from "@qdrant/js-client-rest/dist/types/types";

interface UploadRequest extends Request {
    files: Express.Multer.File[]
}

interface CreatePayloadIndexArgs {
    field: string;
    schema: SchemasType["PayloadFieldSchema"]
}

interface PromptRequest extends Request {
    body: {
        text: string;
        init: boolean;
    }
}