import { START, END, StateGraph } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";

import { AgentState } from "states";
import { nemotronLLM, openaiOSSLLM, qwenLLM, deepseekLLM } from "./LLMs";
import { createLLMQueryNode, createLLMConsolidateQueryNode, createLLMModerateQueryNode } from "./LLMNodes";
import { acceptUserMessageNode } from "./HumanNodes";
import { aggregateResponsesNode } from "./SystemNodes";


const queryNemotronNode = createLLMQueryNode(nemotronLLM);
const queryOpenaiOSSNode = createLLMQueryNode(openaiOSSLLM);
const queryQwenNode = createLLMQueryNode(qwenLLM);
const consolidateNemotronNode = createLLMConsolidateQueryNode(nemotronLLM);
const consolidateOpenaiOSSNode = createLLMConsolidateQueryNode(openaiOSSLLM);
const consolidateQwenNode = createLLMConsolidateQueryNode(qwenLLM);
const moderateDeepseekNode = createLLMModerateQueryNode(deepseekLLM);


const workflow = new StateGraph(AgentState)
    .addNode("acceptUserMessage", acceptUserMessageNode)
    .addNode("queryNemotron", queryNemotronNode)
    .addNode("queryOpenaiOSS", queryOpenaiOSSNode)
    .addNode("queryQwen", queryQwenNode)
    .addNode("aggregateResponses", aggregateResponsesNode)
    .addNode('consolidateNemotron', consolidateNemotronNode)
    .addNode('consolidateOpenaiOSS', consolidateOpenaiOSSNode)
    .addNode('moderateDeepseek', moderateDeepseekNode)
    .addNode('consolidateQwen', consolidateQwenNode)
    .addEdge(START, "acceptUserMessage")
    .addEdge('acceptUserMessage', "queryNemotron")
    .addEdge('acceptUserMessage', "queryOpenaiOSS")
    .addEdge('acceptUserMessage', "queryQwen")
    .addEdge('queryNemotron', "aggregateResponses")
    .addEdge('queryOpenaiOSS', "aggregateResponses")
    .addEdge('queryQwen', "aggregateResponses")
    .addEdge('aggregateResponses', "consolidateNemotron")
    .addEdge('aggregateResponses', "consolidateOpenaiOSS")
    .addEdge('aggregateResponses', "consolidateQwen")
    .addEdge('consolidateNemotron', "moderateDeepseek")
    .addEdge('consolidateOpenaiOSS', "moderateDeepseek")
    .addEdge('consolidateQwen', "moderateDeepseek")
    .addEdge('moderateDeepseek', END);

const app = workflow.compile();

const inputs = { messages: [new AIMessage("What wisdom do you seek?\n")] };

async function execute() {
    for await (const s of await app.stream(inputs)) {
        console.log(s);
    }
}

execute();
