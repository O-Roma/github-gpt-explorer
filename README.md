# Langchain Conversational QA

This is a small project that demonstrates how to use the Langchain library to create a conversational question-answering system. The system is based on the OpenAI GPT-3.5 model and a vector store generated from documents in a GitHub repository.

## Getting Started

To get started with this project, you will need to have an OpenAI API key and a GitHub repository with documents that you want to use for generating a vector store. You can then clone this repository and run the code to start asking questions.

### Prerequisites

- Node.js version 18 or later
- An OpenAI API key
- A GitHub repository with documents

### Installing

1. Clone this repository
2. Install dependencies by running `npm install`
3. Set your OpenAI API key as an environment variable by creating a `.env` file with the following content:

OPENAI_API_KEY=<your_api_key_here>

4. Replace the value of `REPO_URL` in `src/config.ts` with the URL of your GitHub repository
5. Run the code by running `npm start`

## Usage

Once the code is running, you can start asking questions by typing them in the console. The system will use the OpenAI model and vector store to find the most relevant answer from the documents in your repository.

You can also ask follow-up questions by typing `y` when prompted.

