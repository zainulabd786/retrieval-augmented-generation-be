import { QdrantClient } from '@qdrant/js-client-rest';
import { ChatOpenAI } from "@langchain/openai";

// @ts-ignore
import { HuggingFaceTransformersEmbeddings } from "../utils/hf_transformers";


export const getQdrantClient = () => new QdrantClient({
    url: process.env.QDRANT_HOST,
    apiKey: process.env.QDRANT_KEY,
    port: Number(process.env.QDRANT_PORT)
});

export const getEmbeddingsModel = () => new HuggingFaceTransformersEmbeddings({
    modelName: process.env.EMBEDDING_MODEL
});

export const getLLMModel = () => new ChatOpenAI({
    openAIApiKey: process.env.LLM_KEY,
    configuration: {
        baseURL: process.env.LLM_URL,
    },
    modelName: process.env.LLM_MODEL,
    streaming: true,
});