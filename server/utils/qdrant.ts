
import { QdrantCollectionNames } from "./enums";
import type { CreatePayloadIndexArgs } from "../types"; 
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { getEmbeddingsModel, getQdrantClient } from ".";

export const createPayloadIndex = async (collectionName: QdrantCollectionNames, args: CreatePayloadIndexArgs[]) => {
    try {
        const client = getQdrantClient();
        const promises = args.map(({ field, schema }) => client.createPayloadIndex(collectionName, {
            field_name: field,
            field_schema: schema,
        }))
        await Promise.all(promises);
    } catch (e) {
        console.error("Unable to create index!", args, e)
        throw e
    }
}

export const ensureCollection = async (collectionName: QdrantCollectionNames, indexArgs?: CreatePayloadIndexArgs[]): Promise<void> => {
    try {
        const vectorStore = new QdrantVectorStore(getEmbeddingsModel(), {
            client: getQdrantClient(), collectionName
        });
        await vectorStore.ensureCollection();

        if (indexArgs) {
            // indexing the keys that we will use to perform filtering on data
            await createPayloadIndex(collectionName, indexArgs)
        }
    } catch (e) {
        console.error(`Unable to ensure collection: ${collectionName}`, e)
        throw e
    }
}

export const ensureCollectionsOnInit = async () => {
    return await ensureCollection(QdrantCollectionNames.knowledge_base, [
        {
            field: "metadata.source",
            schema: "keyword",
        },
        {
            field: "metadata.loc.pageNumber",
            schema: "keyword",
        },
        {
            field: "metadata.loc.lines.from",
            schema: "keyword",
        },
        {
            field: "metadata.loc.lines.to",
            schema: "keyword",
        }
    ]);
}