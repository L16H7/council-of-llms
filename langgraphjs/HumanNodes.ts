import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";

import { AgentState } from "states";  // Assuming "states" is a local file; adjust if needed


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const acceptUserMessageNode = async (state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> => {
    const lastMessage = state.messages[state.messages.length - 1];
    return new Promise((resolve) => {
        rl.question(lastMessage.content as string, (input) => {
            const newMessage = new HumanMessage(input, { originalQuery: true });
            resolve({
                messages: [...state.messages, newMessage],
            });
        });
    });
};

export { acceptUserMessageNode };
