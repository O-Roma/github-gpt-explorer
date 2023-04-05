import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { GithubRepoLoader } from "langchain/document_loaders";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import prompt from 'prompt-sync';
import { TokenTextSplitter } from "langchain/text_splitter";



dotenv.config();

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const loader = new GithubRepoLoader(
  "https://github.com/domeccleston/langchain-ts-starter",
  { branch: "main", recursive: false, unknown: "warn" }
);

const splitter = new TokenTextSplitter({
  encodingName: "gpt2",
  chunkSize: 10,
  chunkOverlap: 0,
});

const docs = await loader.loadAndSplit(splitter);

const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever()
);

async function askQuestion(chatHistory: string[]) {
  const question = prompt()("What is your question? "); // prompt the user for a question
  const res = await chain.call({ question, chat_history: chatHistory });
  console.log(res);

  const followUpQuestion = prompt()("Any follow up questions? (y/n) "); // prompt the user for a follow-up question
  if (followUpQuestion.toLowerCase() === 'y') {
    const newChatHistory: string[] = [];
    newChatHistory.push(...chatHistory);
    newChatHistory.push(question);
    newChatHistory.push(res.text);
    await askQuestion(newChatHistory); // recursive call with updated chat history
  }
}

(async function() {
  const chatHistory: string[] = [];
  await askQuestion(chatHistory); // initial call with empty chat history
})();
