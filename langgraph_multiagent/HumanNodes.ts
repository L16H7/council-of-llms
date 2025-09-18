import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";

import { AgentState } from "states";  // Assuming "states" is a local file; adjust if needed


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const acceptUserMessageNode = async (state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> => {
    const firstAgentKey = Object.keys(state.agentStates)[0] as keyof typeof state.agentStates;
    const lastMessage = state.agentStates[firstAgentKey].messages[state.agentStates[firstAgentKey].messages.length - 1];

    return new Promise((resolve) => {
        rl.question(lastMessage.content as string, (input) => {
            const newMessage = new HumanMessage(input, { originalQuery: true });
            const agentKeys = Object.keys(state.agentStates) as Array<keyof typeof state.agentStates>;

            const agentUpdates: typeof state.agentStates = { ...state.agentStates };
            agentKeys.forEach(agentKey => {
                agentUpdates[agentKey] = {
                    messages: [...state.agentStates[agentKey].messages, newMessage],
                };
            });

            resolve({
                agentStates: agentUpdates
            });
        });
    });
};

export { acceptUserMessageNode };
