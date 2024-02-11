import { Request, Response } from 'express';
import { SchemaFor, Schemas as SchemasType } from "@qdrant/js-client-rest/dist/types/types";

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

export interface CreatePayloadIndexArgs {
    field: string;
    schema: SchemasType["PayloadFieldSchema"]
}
