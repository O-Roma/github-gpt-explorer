import dotenv from 'dotenv';

dotenv.config();

export const MODEL_NAME = "gpt-3.5-turbo";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const REPO_URL = "https://github.com/domeccleston/langchain-ts-starter";
export const VECTOR_STORE_DIR = "temp/lanchain-ts-starter";
export const SPLITTER_CONFIG = { chunkSize: 2000, chunkOverlap: 200 };
export const PROMPT_CONFIG = { sigint: true };
export const FOLLOW_UP_QUESTION_PROMPT = "Any follow up questions? (y/n) ";
