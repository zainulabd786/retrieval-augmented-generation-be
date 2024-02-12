import { Response } from 'express';
import type { PromptRequest, UploadRequest } from '../types';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { getConversationalRetrievalQAChain, getEmbeddingsModel, getQdrantClient } from '../utils';
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { QdrantCollectionNames } from '../utils/enums';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

export async function upload(req: UploadRequest, res: Response) {
  if (!req.files) {
    return res.status(400).send('No file uploaded or invalid file format.');
  }

  try {
    for (const file of req.files) {
      const filePath = file.path;
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      if (docs.length === 0) {
        console.log('No documents found.');
        return;
      }
      console.log('Number of documents:', docs.length);
      const splitter = new CharacterTextSplitter({
        separator: ' ',
        chunkSize: 1000,
        chunkOverlap: 50,
      });

      const splitDocs = await splitter.splitDocuments(docs);

      // Reduce the size of the metadata for each document -- lots of useless pdf information
      const reducedDocs = splitDocs.map((doc) => {
        const reducedMetadata = {
          ...doc.metadata,
          source: file.originalname,
        };
        delete reducedMetadata.pdf; // Remove the 'pdf' field
        return new Document({
          pageContent: doc.pageContent,
          metadata: reducedMetadata,
        });
      });
      console.log('Number of documents after splitting:', reducedDocs.length);
      const embeddings = getEmbeddingsModel();

      const client = getQdrantClient();

      await QdrantVectorStore.fromDocuments(reducedDocs, embeddings, {
        client,
        collectionName: QdrantCollectionNames.knowledge_base,
      });
      console.log('Inserted file', file.originalname);
    }

    res.json({ message: 'File uploaded successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).send(error?.toString());
  }
}

let chain: ConversationalRetrievalQAChain;
export async function prompt(req: PromptRequest, res: Response) {
  try {
    const { init, text } = req.body;
    if (init) {
      chain = await getConversationalRetrievalQAChain();
    }
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Transfer-Encoding': 'chunked',
    });
    await chain?.call(
      { question: text },
      {
        callbacks: [
          {
            async handleLLMNewToken(token: string) {
              res.write(token);
            },
          },
        ],
      }
    )

    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).send(e?.toString());
  }
}