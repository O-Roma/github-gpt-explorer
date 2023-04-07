import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { GithubRepoLoader } from "langchain/document_loaders";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import prompt from 'prompt-sync';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  MODEL_NAME,
  REPO_URL,
  VECTOR_STORE_DIR,
  SPLITTER_CONFIG,
  PROMPT_CONFIG,
  FOLLOW_UP_QUESTION_PROMPT,
} from './config';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;



// Create an instance of the OpenAI model
const model = new OpenAI({
  modelName: MODEL_NAME,
  openAIApiKey: OPENAI_API_KEY,
});

// Create a document loader for the GitHub repository
const loader = new GithubRepoLoader(REPO_URL, {
  branch: "main",
  recursive: false,
  unknown: "warn",
});

// Create a text splitter for breaking up documents into chunks
const splitter = new RecursiveCharacterTextSplitter(SPLITTER_CONFIG);

// Load or generate a vector store from the documents in the repository
let vectorStore;
try {
  vectorStore = await HNSWLib.load(VECTOR_STORE_DIR, new OpenAIEmbeddings());
} catch (e) {
  console.log("Vector store not found in directory. Generating vector store from documents...");
  const docs = await loader.loadAndSplit(splitter);
  vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  await vectorStore.save(VECTOR_STORE_DIR);
}

// Create a conversational retrieval question-answering chain from the OpenAI model and vector store
const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

// Ask a question and prompt for follow-up questions
async function askQuestion(chatHistory: string[]) {
  const question = prompt(PROMPT_CONFIG)("What is your question? ");
  const res = await chain.call({ question, chat_history: chatHistory });
  console.log(res);

  const followUpQuestion = prompt(PROMPT_CONFIG)(FOLLOW_UP_QUESTION_PROMPT);
  if (followUpQuestion.toLowerCase() === 'y') {
    const newChatHistory = [...chatHistory, question, res.text];
    await askQuestion(newChatHistory);
  }
}

// Start the conversation with an empty chat history
(async function () {
  await askQuestion([]);
})();
