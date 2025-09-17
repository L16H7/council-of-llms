import { HumanMessage } from "@langchain/core/messages";

import { AgentState } from "states";



const aggregateResponsesNode = async (state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> => {
    const messages = state.messages || [];
    const nemotronResponse = messages.find(msg => msg.additional_kwargs?.source === 'nemotron')?.content || '';
    const openaiOSSResponse = messages.find(msg => msg.additional_kwargs?.source === 'openaiOSS')?.content || '';
    const qwenResponse = messages.find(msg => msg.additional_kwargs?.source === 'qwen')?.content || '';

    const aggregatedContent = `Aggregated Responses:\n- Nemotron: ${nemotronResponse}\n- OpenAI OSS: ${openaiOSSResponse}\n- Qwen: ${qwenResponse}`;

    // Append the aggregated message to the state
    return {
        messages: [...messages, new HumanMessage(aggregatedContent)]
    };
}

export { aggregateResponsesNode };
