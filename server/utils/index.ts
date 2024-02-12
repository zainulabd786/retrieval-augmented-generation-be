import { QdrantClient } from '@qdrant/js-client-rest';
import { ChatOpenAI } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ConversationSummaryMemory } from "langchain/memory";
// @ts-ignore
import { HuggingFaceTransformersEmbeddings } from "../utils/hf_transformers";
import { QdrantCollectionNames } from './enums';


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

export const getConversationalRetrievalQAChain = async (): Promise<ConversationalRetrievalQAChain> => {
    try {
        const client = getQdrantClient();
        const model = getLLMModel();
        const embeddings = getEmbeddingsModel();
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            { client, collectionName: QdrantCollectionNames.knowledge_base }
        );
        const retriever = vectorStore.asRetriever(10);
        const memory = new ConversationSummaryMemory({
            memoryKey: "chat_history",
            llm: model,
        });
        const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
            memory
        });

        return chain;
    } catch (e) {
        console.error("Unable to initialize ConversationalRetrievalQAChain", e);
        throw e;
    }
}