import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { AgentState } from "states";
import { DOWNSTREAM_CONTEXT } from "./constants";


const aggregateResponsesNode = async (state: typeof AgentState.State) => {
    const messages = state.messages || [];

    const originalQuery = messages.find(msg => msg.additional_kwargs?.originalQuery)?.content || '';

    const llmResponses = messages
        .filter(msg => msg.response_metadata?.model_name)
        .map(msg => `${msg.response_metadata.model_name}: ${msg.content}`)
        .join('\n\n--------------------------\n\n');

    return {
        messages: [
            new HumanMessage(originalQuery as string, { downstream_context: DOWNSTREAM_CONTEXT.MODERATOR }),
            new AIMessage(llmResponses, { downstream_context: DOWNSTREAM_CONTEXT.MODERATOR })
        ]
    };
}

export { aggregateResponsesNode };
