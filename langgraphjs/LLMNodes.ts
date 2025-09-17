import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import type { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";

import { AgentState } from "states";


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

const createLLMNode = (llm: ChatOpenAI) => {
    return async (data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> => {
        const { messages } = data;
        const result = await llm.invoke(messages, config);
        return {
            messages: [result],
        };
    };
};

const callNemotronNode = createLLMNode(nemotronLLM);
const callOpenaiOSSNode = createLLMNode(openaiOSSLLM);
const callQwenNode = createLLMNode(qwenLLM);

const updateOriginalResponseNode = (llm: ChatOpenAI) => {
    return async (data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> => {
        const { messages } = data;
        const prompt = `You are ${llm.model}. You are given your original response and other AI responses. Do you wish to update your answer based on the discussion?`;
        messages.push(new HumanMessage(prompt));
        const result = await llm.invoke(messages, config);
        return {
            messages: [result],
        };
    };
};

const callNemotronUpdateNode = updateOriginalResponseNode(nemotronLLM);
const callOpenaiOSSUpdateNode = updateOriginalResponseNode(openaiOSSLLM);
const callQwenUpdateNode = updateOriginalResponseNode(qwenLLM);

export { callNemotronNode, callOpenaiOSSNode, callQwenNode, callNemotronUpdateNode, callOpenaiOSSUpdateNode, callQwenUpdateNode };
