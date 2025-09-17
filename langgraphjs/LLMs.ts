import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";


const nemotronLLM = new ChatOpenAI(
    {
        model: 'nvidia/nemotron-nano-9b-v2:free',
        temperature: 0.8,
        streaming: true,
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
        },
    },
);

const openaiOSSLLM = new ChatOpenAI(
    {
        model: 'openai/gpt-oss-20b:free',
        temperature: 0.8,
        streaming: true,
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
        },
    },
);

const qwenLLM = new ChatOpenAI(
    {
        model: 'qwen/qwen3-30b-a3b:free',
        temperature: 0.8,
        streaming: true,
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
        },
    },
);

const deepseekLLM = new ChatOpenAI(
    {
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        temperature: 0.8,
        streaming: true,
        apiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
        },
    },
);

export { nemotronLLM, openaiOSSLLM, qwenLLM, deepseekLLM };
