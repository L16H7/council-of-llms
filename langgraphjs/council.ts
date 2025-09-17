import { START, END, StateGraph } from "@langchain/langgraph";
import { HumanMessage, BaseMessage, AIMessage } from "@langchain/core/messages";

import { AgentState } from "states";
import { callNemotronNode, callOpenaiOSSNode, callQwenNode, callNemotronUpdateNode, callOpenaiOSSUpdateNode, callQwenUpdateNode } from "./LLMNodes";
import { acceptUserMessageNode } from "./HumanNodes";
import { aggregateResponsesNode } from "./SystemNodes";


const workflow = new StateGraph(AgentState)
    .addNode("acceptUserMessage", acceptUserMessageNode)
    .addNode("callNemotron", callNemotronNode)
    .addNode("callOpenaiOSS", callOpenaiOSSNode)
    .addNode("callQwen", callQwenNode)
    .addNode("aggregateResponses", aggregateResponsesNode)
    .addNode('callNemotronUpdate', callNemotronUpdateNode)
    .addNode('callOpenaiOSSUpdate', callOpenaiOSSUpdateNode)
    .addNode('callQwenUpdate', callQwenUpdateNode)
    .addEdge(START, "acceptUserMessage")
    .addEdge('acceptUserMessage', "callNemotron")
    .addEdge('acceptUserMessage', "callOpenaiOSS")
    .addEdge('acceptUserMessage', "callQwen")
    .addEdge('callNemotron', "aggregateResponses")
    .addEdge('callOpenaiOSS', "aggregateResponses")
    .addEdge('callQwen', "aggregateResponses")
    .addEdge('aggregateResponses', "callNemotronUpdate")
    .addEdge('aggregateResponses', "callOpenaiOSSUpdate")
    .addEdge('aggregateResponses', "callQwenUpdate")
    .addEdge('callNemotronUpdate', END)
    .addEdge('callOpenaiOSSUpdate', END)
    .addEdge('callQwenUpdate', END);

const app = workflow.compile();

const inputs = { messages: [new AIMessage("What wisdom do you seek?\n")] };

async function execute() {
    for await (const s of await app.stream(inputs)) {
        console.log(s);
    }
}

execute();
