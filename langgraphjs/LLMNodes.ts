import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

import { AgentState } from "states";

const createLLMQueryNode = (llm: ChatOpenAI) => {
    return async (data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> => {
        const { messages } = data;
        const result = await llm.invoke(messages, config);
        return {
            messages: [result],
        };
    };
};

const createLLMConsolidateQueryNode = (llm: ChatOpenAI) => {
    return async (data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> => {
        const { messages } = data;

        console.log("Consolidating responses with messages:", messages);

        const prompt = `You are ${llm.model}. You are given your original response and other AI responses. Do you wish to update your answer based on the discussion?`;
        messages.push(new HumanMessage(prompt));
        const result = await llm.invoke(messages, config);

        const lastMessage = messages[messages.length - 1];
        messages.push(new AIMessage(`${llm.model}: ${lastMessage.content}`));

        return {
            messages,
        };
    };
};

export { createLLMQueryNode, createLLMConsolidateQueryNode };
