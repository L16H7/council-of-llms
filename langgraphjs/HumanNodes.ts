import { HumanMessage } from "@langchain/core/messages";
import * as readline from "readline";

import { AgentState } from "states";  // Assuming "states" is a local file; adjust if needed


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const acceptUserMessageNode = async (state: typeof AgentState.State): Promise<Partial<typeof AgentState.State>> => {
    return new Promise((resolve) => {
        rl.question("What wisdom do you seek?\n", (input) => {
            const newMessage = new HumanMessage(input);
            resolve({
                messages: [...state.messages, newMessage],
            });
        });
    });
};

export { acceptUserMessageNode };
