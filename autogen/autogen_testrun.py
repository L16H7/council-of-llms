import os
from dotenv import load_dotenv
from autogen import ConversableAgent

load_dotenv()


def autogen_conversation():
    # OpenRouter configuration
    openrouter_config = [
        {
            "model": "nvidia/nemotron-nano-9b-v2:free",  # or any other model available on OpenRouter
            "api_key": os.getenv("OPENROUTER_API_KEY"),
            "base_url": "https://openrouter.ai/api/v1",
        }
    ]

    agent1 = ConversableAgent(
        name="Alice",
        system_message="You are Alice, a helpful assistant who likes to ask follow-up questions to better understand topics.",
        llm_config={"config_list": openrouter_config},
        human_input_mode="NEVER",
        max_consecutive_auto_reply=3,
    )

    agent2 = ConversableAgent(
        name="Bob",
        system_message="You are Bob, a knowledgeable assistant who provides detailed explanations and examples.",
        llm_config={"config_list": openrouter_config},
        human_input_mode="NEVER",
        max_consecutive_auto_reply=3,
    )

    test_message = "What are the benefits of using AI agents in software development?"

    result = agent1.initiate_chat(recipient=agent2, message=test_message, max_turns=6)

    return result


def main():
    try:
        autogen_conversation()
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
