import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";


export const AgentState = Annotation.Root({
    agentStates: Annotation<{
        nemotron: { messages: BaseMessage[] };
        openaiOSS: { messages: BaseMessage[] };
        qwen: { messages: BaseMessage[] };
        moderator: { messages: BaseMessage[] };
    }>({
        default: () => ({
            nemotron: { messages: [] },
            openaiOSS: { messages: [] },
            qwen: { messages: [] },
            moderator: { messages: [] },
        }),
        reducer: (current, update) => ({
            ...current,
            ...update,
        }),
    }),
});
