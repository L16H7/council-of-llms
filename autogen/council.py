import os

from autogen import GroupChat, GroupChatManager, UserProxyAgent
from agents import nemo_agent, openai_agent, qwen_agent, moderator


def custom_speaker_selection(last_speaker, groupchat):
    """Custom speaker selection for 2 round robins + moderator finalization"""
    round_robin_agents = [nemo_agent, openai_agent, qwen_agent]
    messages = groupchat.messages
    total_agent_responses = len(messages) - 1  # Exclude initial user message

    if total_agent_responses < 6:
        # Determine which agent should speak next in the round robin
        next_agent_index = total_agent_responses % 3
        return round_robin_agents[next_agent_index]

    # Phase 3: Moderator speaks once to finalize
    elif total_agent_responses == 6:
        return moderator

    # End conversation after moderator speaks
    else:
        return None


def main():
    print("🏛️  Welcome to the Council of LLMs!")
    print("Ask a question and watch our AI agents debate it out!\n")

    try:
        user_query = input("What wisdom do you seek?\n").strip()

        group_chat = GroupChat(
            agents=[nemo_agent, openai_agent, qwen_agent, moderator],
            max_round=8,
            speaker_selection_method=custom_speaker_selection,
        )

        council = GroupChatManager(
            groupchat=group_chat,
            llm_config={
                "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
                "api_key": os.getenv("OPENROUTER_API_KEY"),
                "base_url": "https://openrouter.ai/api/v1",
            },
        )

        initializer = UserProxyAgent(
            name="User",
        )

        initializer.initiate_chat(council, message=user_query)

    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
