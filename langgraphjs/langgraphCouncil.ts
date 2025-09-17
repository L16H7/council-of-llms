import { START, END, StateGraph } from "@langchain/langgraph";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";

import { AgentState } from "states";
import { callNemotronNode, callOpenaiOSSNode, callQwenNode } from "./LLMNodes";
import { acceptUserMessageNode } from "./HumanNodes";
import { aggregateResponsesNode } from "./SystemNodes";


const workflow = new StateGraph(AgentState)
    .addNode("acceptUserMessage", acceptUserMessageNode)
    .addNode("callNemotron", callNemotronNode)
    .addNode("callOpenaiOSS", callOpenaiOSSNode)
    .addNode("callQwen", callQwenNode)
    .addNode("aggregateResponses", aggregateResponsesNode)
    .addEdge(START, "acceptUserMessage")
    .addEdge('acceptUserMessage', "callNemotron")
    .addEdge('acceptUserMessage', "callOpenaiOSS")
    .addEdge('acceptUserMessage', "callQwen")
    .addEdge('callNemotron', "aggregateResponses")
    .addEdge('callOpenaiOSS', "aggregateResponses")
    .addEdge('callQwen', "aggregateResponses")
    .addEdge("aggregateResponses", END);

const app = workflow.compile();

const inputs = { messages: [new HumanMessage("How are you doing?")] };

async function execute() {
    for await (const s of await app.stream(inputs)) {
        console.log(s);
    }
}

execute();
