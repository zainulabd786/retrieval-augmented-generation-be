/**
 * This file is a replica of node_modules/@langchain/community/dist/embeddings/hf_transformers.cjs
 * 
 * This change was needed because when we tried to import HuggingFaceTransformersEmbeddings as below:
 * import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
 * 
 * We got the following error:
 * 
 * Specter_BE/node_modules/@langchain/community/dist/embeddings/hf_transformers.cjs:4
    const transformers_1 = require("@xenova/transformers");
                        ^
    Error [ERR_REQUIRE_ESM]: require() of ES Module /home/user/Specter_BE/node_modules/@xenova/transformers/src/transformers.js from /home/user/Specter_BE/node_modules/@langchain/community/dist/embeddings/hf_transformers.cjs not supported.
    Instead change the require of transformers.js in /home/user/Specter_BE/node_modules/@langchain/community/dist/embeddings/hf_transformers.cjs to a dynamic import() which is available in all CommonJS modules.
        at Object.<anonymous> (/home/user/Specter_BE/node_modules/@langchain/community/dist/embeddings/hf_transformers.cjs:4:24)
    ERROR: "server" exited with 1.
 * 
 * This error was because of the way langchain internally imports the @xenova/transformers, So we had to change the way the @xenova/transformers is imported in langchain
 * 
 * Helpful links behind this change
 * * https://js.langchain.com/docs/integrations/text_embedding/transformers
 * * https://github.com/xenova/transformers.js/issues/80#issuecomment-1638773862
 * * https://stackoverflow.com/questions/76883048/err-require-esm-for-import-with-xenova-transformers
 * 
 */
// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuggingFaceTransformersEmbeddings = void 0;
// const transformers_1 = require("@xenova/transformers");
const TransformersApi = Function('return import("@xenova/transformers")')();

const embeddings_1 = require("@langchain/core/embeddings");
const chunk_array_1 = require("@langchain/core/utils/chunk_array");
/**
 * @example
 * ```typescript
 * const model = new HuggingFaceTransformersEmbeddings({
 *   modelName: "Xenova/all-MiniLM-L6-v2",
 * });
 *
 * // Embed a single query
 * const res = await model.embedQuery(
 *   "What would be a good company name for a company that makes colorful socks?"
 * );
 * console.log({ res });
 *
 * // Embed multiple documents
 * const documentRes = await model.embedDocuments(["Hello world", "Bye bye"]);
 * console.log({ documentRes });
 * ```
 */
class HuggingFaceTransformersEmbeddings extends embeddings_1.Embeddings {
    constructor(fields) {
        super(fields ?? {});
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Xenova/all-MiniLM-L6-v2"
        });
        Object.defineProperty(this, "batchSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 512
        });
        Object.defineProperty(this, "stripNewLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pipelinePromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = fields?.modelName ?? this.modelName;
        this.stripNewLines = fields?.stripNewLines ?? this.stripNewLines;
        this.timeout = fields?.timeout;
    }
    async embedDocuments(texts) {
        const batches = (0, chunk_array_1.chunkArray)(this.stripNewLines ? texts.map((t) => t.replace(/\n/g, " ")) : texts, this.batchSize);
        const batchRequests = batches.map((batch) => this.runEmbedding(batch));
        const batchResponses = await Promise.all(batchRequests);
        const embeddings = [];
        for (let i = 0; i < batchResponses.length; i += 1) {
            const batchResponse = batchResponses[i];
            for (let j = 0; j < batchResponse.length; j += 1) {
                embeddings.push(batchResponse[j]);
            }
        }
        return embeddings;
    }
    async embedQuery(text) {
        const data = await this.runEmbedding([
            this.stripNewLines ? text.replace(/\n/g, " ") : text,
        ]);
        return data[0];
    }
    async runEmbedding(texts) {
        const transformers_1 = await TransformersApi;
        const pipe = await (this.pipelinePromise ??= (0, transformers_1.pipeline)("feature-extraction", this.modelName));
        return this.caller.call(async () => {
            const output = await pipe(texts, { pooling: "mean", normalize: true });
            return output.tolist();
        });
    }
}
exports.HuggingFaceTransformersEmbeddings = HuggingFaceTransformersEmbeddings;
