import os
from autogen import ConversableAgent
from dotenv import load_dotenv


load_dotenv()

qwen_agent = ConversableAgent(
    name="QwenAgent",
    system_message="""Please respond in two sentences or less. The other agents will also respond to the original question. You are to consider their responses and improve or change your answer.""",
    llm_config={
        "config_list": [
            {
                "model": "qwen/qwen3-4b:free",
                "api_key": os.getenv("OPENROUTER_API_KEY"),
                "base_url": "https://openrouter.ai/api/v1",
            }
        ]
    },
    human_input_mode="NEVER",
)

nemo_agent = ConversableAgent(
    name="NemoAgent",
    system_message="""Please respond in two sentences or less. The other agents will also respond to the original question. You are to consider their responses and improve or change your answer.""",
    llm_config={
        "config_list": [
            {
                "model": "nvidia/nemotron-nano-9b-v2:free",
                "api_key": os.getenv("OPENROUTER_API_KEY"),
                "base_url": "https://openrouter.ai/api/v1",
            }
        ]
    },
    human_input_mode="NEVER",
)

openai_agent = ConversableAgent(
    name="OpenAIAgent",
    system_message="""Please respond in two sentences or less. The other agents will also respond to the original question. You are to consider their responses and improve or change your answer.""",
    llm_config={
        "config_list": [
            {
                "model": "openai/gpt-oss-20b:free",
                "api_key": os.getenv("OPENROUTER_API_KEY"),
                "base_url": "https://openrouter.ai/api/v1",
            }
        ]
    },
    human_input_mode="NEVER",
)

moderator = ConversableAgent(
    name="Moderator",
    system_message="""You are the moderator of the Council of LLMs. Your role is to:
    1. Facilitate the discussion between agents
    2. Collect and synthesize all agent responses
    3. Provide a balanced final verdict that considers all perspectives
    4. Ensure the discussion stays on topic and productive

    When providing the final verdict, acknowledge the different viewpoints presented and
    explain your reasoning for the conclusion.""",
    llm_config={
        "config_list": [
            {
                "model": "x-ai/grok-4-fast:free",
                "api_key": os.getenv("OPENROUTER_API_KEY"),
                "base_url": "https://openrouter.ai/api/v1",
            }
        ]
    },
    human_input_mode="NEVER",
)
