import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";

import { AgentState } from "./states";
import { HumanMessage } from "@langchain/core/messages";


class LLMAgent {
    llm: ChatOpenAI;
    agentKey: keyof typeof AgentState.State['agentStates'];

    constructor(llm: ChatOpenAI, agentKey: keyof typeof AgentState.State['agentStates']) {
        this.llm = llm;
        this.agentKey = agentKey;
    }

    async queryNode(data: typeof AgentState.State, config?: RunnableConfig): Promise<typeof AgentState.State> {
        const { agentStates } = data;
        const result = await this.llm.invoke(agentStates[this.agentKey].messages, config);

        console.log(`Agent ${this.agentKey} response:`, result.content);

        return {
            agentStates: {
                [this.agentKey]: {
                    ...agentStates[this.agentKey],
                    messages: [...agentStates[this.agentKey].messages, result],
                },
            },
        } as typeof AgentState.State;
    }

    getQueryNode() {
        return this.queryNode.bind(this);
    }

    async consolidateNode(data: typeof AgentState.State, config?: RunnableConfig) {
        const { agentStates } = data;

        const otherAgents = Object.keys(agentStates)
            .filter(key => key !== this.agentKey && key !== 'deepseek');

        const otherAgentsMessages = otherAgents.map(agentKey =>
            `Agent ${agentKey}'s response: ${agentStates[agentKey as keyof typeof agentStates].messages.slice(-1)[0].content}`
        ).join('\n --------------------------\n ');

        const prompt = new HumanMessage(`You are given other AI responses. ${otherAgentsMessages} Do you wish to update your answer based on the discussion?`);

        const result = await this.llm.invoke([...agentStates[this.agentKey].messages, prompt], config);

        return {
            agentStates: {
                [this.agentKey]: {
                    ...agentStates[this.agentKey],
                    messages: [...agentStates[this.agentKey].messages, result],
                },
            },
        };
    }

    getConsolidateNode() {
        return this.consolidateNode.bind(this);
    }
}

export { LLMAgent };
