import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

import { AgentState } from "states";
import { DOWNSTREAM_CONTEXT } from "./constants";

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

        const contextToConsolidate = messages.filter(msg => msg.additional_kwargs?.downstream_context === DOWNSTREAM_CONTEXT.MODERATOR)
        const prompt = `You are ${llm.model}. You are given your original response and other AI responses. Do you wish to update your answer based on the discussion?`;
        contextToConsolidate.push(new HumanMessage(prompt, { downstream_context: DOWNSTREAM_CONTEXT.MODERATOR }));

        const result = await llm.invoke(contextToConsolidate, config);

        return {
            messages: [new AIMessage(`${llm.model}: ${result.content}`, { downstream_context: DOWNSTREAM_CONTEXT.MODERATOR })],
        };
    };
};

const createLLMModerateQueryNode = (llm: ChatOpenAI) => {
    return async (data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> => {
        const { messages } = data;

        const contextToModerate = messages.filter(msg => msg.additional_kwargs?.downstream_context === DOWNSTREAM_CONTEXT.MODERATOR)
        const prompt = "You are a moderator. Review the conversation, summarize the answers and provide final recommendation to the user.";
        contextToModerate.push(new HumanMessage(prompt, { downstream_context: DOWNSTREAM_CONTEXT.MODERATOR }));

        console.log("Moderation context:", contextToModerate);

        const result = await llm.invoke(contextToModerate, config);

        return {
            messages: [result]
        };
    };
};


export { createLLMQueryNode, createLLMConsolidateQueryNode, createLLMModerateQueryNode };
