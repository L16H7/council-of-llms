import { AIMessage } from "@langchain/core/messages";
import { AgentState } from "states";


const aggregateResponsesNode = async (state: typeof AgentState.State) => {
    const agentKeys = Object.keys(state.agentStates) as Array<keyof typeof state.agentStates>;

    // Find the original user query from any agent's messages
    let originalQuery = '';
    for (const agentKey of agentKeys) {
        const userMessage = state.agentStates[agentKey].messages.find(
            msg => msg.additional_kwargs?.originalQuery
        );
        if (userMessage) {
            originalQuery = userMessage.content as string;
            break;
        }
    }

    // Collect responses from all agents
    const llmResponses = agentKeys
        .map(agentKey => {
            const agentMessages = state.agentStates[agentKey].messages;
            const lastMessage = agentMessages[agentMessages.length - 1];
            if (lastMessage && lastMessage.response_metadata?.model_name) {
                return `${agentKey} (${lastMessage.response_metadata.model_name}): ${lastMessage.content}`;
            }
            return null;
        })
        .filter(response => response !== null)
        .join('\n\n--------------------------\n\n');

    // For now, just log the aggregated responses
    console.log('Aggregated Responses:');
    console.log(llmResponses);

    // Return the state unchanged for now
    return {};
}

// Simple passthrough node for synchronization and debugging
const passthroughNode = async (state: typeof AgentState.State) => {
    console.log('=== PASSTHROUGH ===');
    console.log('Current state summary:');

    const agentKeys = Object.keys(state.agentStates) as Array<keyof typeof state.agentStates>;
    agentKeys.forEach(agentKey => {
        const messageCount = state.agentStates[agentKey].messages.length;
        console.log(`${agentKey}: ${messageCount} messages`);
    });

    const lastMessages = agentKeys
        .filter(agentKey => agentKey !== 'moderator')
        .map(agentKey => {
            const messages = state.agentStates[agentKey].messages;
            return `Agent ${agentKey}: ${messages[messages.length - 1].content}`;
        })
        .join('\n--------------------------\n');

    return {
        agentStates: {
            moderator: {
                messages: [
                    ...state.agentStates.moderator.messages, new AIMessage(lastMessages)
                ]
            }
        }
    };
};

export { aggregateResponsesNode, passthroughNode };
