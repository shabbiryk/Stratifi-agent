from uagents import Agent, Protocol, Context, Model
import asyncio
import requests

# Define the same ChatMessage model as in agent.py
class ChatMessage(Model):
    text: str

# Morpho agent definition
subject_matter = "Morpho protocol"
THE_GRAPH_API_KEY = "a3ef7642f7e7078d1c421b49945f2b0b"
MORPHO_SUBGRAPH_URL = "https://gateway.thegraph.com/api/subgraphs/id/71ZTy1veF9twER9CLMnPWeLQ7GZcwKsjmygejrgKirqs"

morpho_agent = Agent(name="MorphoAgent")
morpho_protocol = Protocol(name="morpho-chat", version="0.1.0")

@morpho_protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    text = msg.text
    response = "I can only answer questions about Morpho protocol."
    if "morpho" in text.lower():
        query = {
            "query": """
            { markets(first: 1) { id name totalSupply } }
            """
        }
        headers = {"Authorization": f"Bearer {THE_GRAPH_API_KEY}"}
        try:
            r = requests.post(MORPHO_SUBGRAPH_URL, json=query, headers=headers)
            if r.ok:
                data = r.json()
                market = data['data']['markets'][0]
                response = f"Market: {market['name']}, Total Supply: {market['totalSupply']}"
            else:
                response = f"Failed to fetch Morpho data: {r.text}"
        except Exception as e:
            response = f"Error fetching Morpho data: {e}"
    await ctx.send(sender, ChatMessage(text=response))

morpho_agent.include(morpho_protocol, publish_manifest=False)

test_agent = Agent(name="TestAgent")

response_event = asyncio.Event()
received_response = None

@test_agent.on_message(ChatMessage)
async def receive_response(ctx: Context, sender: str, msg: ChatMessage):
    global received_response
    received_response = msg.text
    print("Response from Morpho agent:", msg.text)
    response_event.set()

async def main():
    # Start both agents as asyncio tasks
    morpho_task = asyncio.create_task(morpho_agent.run())
    test_task = asyncio.create_task(test_agent.run())
    await asyncio.sleep(1)  # Give agents time to start
    # Send a test message from test_agent to morpho_agent
    await test_agent.send(morpho_agent.address, ChatMessage(text="What is the total supply on Morpho?"))
    # Wait for the response
    await response_event.wait()
    # Cancel agent tasks after test
    morpho_task.cancel()
    test_task.cancel()
    try:
        await morpho_task
    except asyncio.CancelledError:
        pass
    try:
        await test_task
    except asyncio.CancelledError:
        pass

if __name__ == "__main__":
    asyncio.run(main()) 