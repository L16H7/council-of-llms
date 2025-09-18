import { START, END, StateGraph } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

import { AgentState } from "states";
import { nemotronLLM, openaiOSSLLM, qwenLLM, deepseekLLM } from "./LLMs";
import { LLMAgent } from "LLMAgent";
import { acceptUserMessageNode } from "./HumanNodes";
import { passthroughNode } from "./SystemNodes";


const nemotronAgent = new LLMAgent(nemotronLLM, 'nemotron');
const openaiOSSAgent = new LLMAgent(openaiOSSLLM, 'openaiOSS');
const qwenAgent = new LLMAgent(qwenLLM, 'qwen');
const deepseekAgent = new LLMAgent(deepseekLLM, 'moderator');

const workflow = new StateGraph(AgentState)
    .addNode("acceptUserMessage", acceptUserMessageNode)
    .addNode("queryNemotron", nemotronAgent.getQueryNode())
    .addNode("queryOpenaiOSS", openaiOSSAgent.getQueryNode())
    .addNode("queryQwen", qwenAgent.getQueryNode())
    .addNode("passthrough", passthroughNode)
    .addNode("passthrough2", passthroughNode)
    .addNode("consolidateNemotron", nemotronAgent.getConsolidateNode())
    .addNode("consolidateOpenaiOSS", openaiOSSAgent.getConsolidateNode())
    .addNode("consolidateQwen", qwenAgent.getConsolidateNode())
    .addNode("moderator", deepseekAgent.getQueryNode())
    .addEdge(START, "acceptUserMessage")
    .addEdge('acceptUserMessage', "queryNemotron")
    .addEdge('acceptUserMessage', "queryOpenaiOSS")
    .addEdge('acceptUserMessage', "queryQwen")
    .addEdge('queryNemotron', "passthrough")
    .addEdge('queryOpenaiOSS', "passthrough")
    .addEdge('queryQwen', "passthrough")
    .addEdge('passthrough', "consolidateNemotron")
    .addEdge('passthrough', "consolidateOpenaiOSS")
    .addEdge('passthrough', "consolidateQwen")
    .addEdge('consolidateNemotron', 'passthrough2')
    .addEdge('consolidateOpenaiOSS', 'passthrough2')
    .addEdge('consolidateQwen', 'passthrough2')
    .addEdge('passthrough2', 'moderator')
    .addEdge('moderator', END);

const app = workflow.compile();

const inputs: typeof AgentState.State = {
    agentStates: {
        nemotron: { messages: [new AIMessage("What wisdom do you seek?\n")] },
        openaiOSS: { messages: [new AIMessage("What wisdom do you seek?\n")] },
        qwen: { messages: [new AIMessage("What wisdom do you seek?\n")] },
        moderator: {
            messages: [
                new HumanMessage("You are the moderator. Review the other AI responses and provide a final consolidated answer."),
                new AIMessage("What wisdom do you seek?\n")
            ]
        },
    }
};

async function execute() {
    for await (const s of await app.stream(inputs)) {
        console.log(s);
    }
}

execute();
