import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Command, Send } from "@langchain/langgraph";

import { AgentState } from "states";



const aggregateResponsesNode = async (state: typeof AgentState.State) => {
    const messages = state.messages || [];

    const originalQuery = messages.find(msg => msg.additional_kwargs?.originalQuery)?.content || '';

    const llmResponses = messages
        .filter(msg => msg.response_metadata?.model_name)
        .map(msg => `${msg.response_metadata.model_name}: ${msg.content}`)
        .join('\n\n--------------------------\n\n');

    return {
        messages: [new HumanMessage(originalQuery as string), new AIMessage(llmResponses)]
    };
}

export { aggregateResponsesNode };
