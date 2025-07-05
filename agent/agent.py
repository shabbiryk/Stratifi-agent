from datetime import datetime
from uuid import uuid4
import requests

from uagents import Context, Protocol, Agent
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    EndSessionContent,
    TextContent,
    chat_protocol_spec,
)

subject_matter = "Morpho protocol"
THE_GRAPH_API_KEY = "a3ef7642f7e7078d1c421b49945f2b0b"
ASI_ONE_API_KEY = "sk_722811606cd4481fa12e436af86912f51e40fbdea68145d397dd2bed142d424b"
MORPHO_SUBGRAPH_URL = "https://gateway.thegraph.com/api/subgraphs/id/71ZTy1veF9twER9CLMnPWeLQ7GZcwKsjmygejrgKirqs"

# List of known asset pairs (add more as needed)
KNOWN_PAIRS = [
    "wUSDM / cbETH",
    "wUSDM / WETH",
    "USDC / wUSDM",
    "wUSDM / unknown"
]

agent = Agent()
protocol = Protocol(spec=chat_protocol_spec)

@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
    )

    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text

    response = 'I am afraid something went wrong and I am unable to answer your question at the moment.'
    headers = {"Authorization": f"Bearer {THE_GRAPH_API_KEY}"}

    try:
        # Check if the user is asking for a specific asset pair
        found_pair = None
        for pair in KNOWN_PAIRS:
            if pair.lower() in text.lower():
                found_pair = pair
                break

        if found_pair:
            query = {
                "query": f'''
                {{
                  markets(where: {{ name: "{found_pair}" }}) {{
                    id
                    name
                    totalValueLockedUSD
                    totalSupply
                    totalBorrow
                    isActive
                  }}
                }}
                '''
            }
            r = requests.post(MORPHO_SUBGRAPH_URL, json=query, headers=headers)
            if r.ok:
                data = r.json()
                markets = data['data']['markets']
                if markets:
                    m = markets[0]
                    response = (
                        f"Market: {m['name']} (ID: {m['id']})\n"
                        f"TVL: ${float(m['totalValueLockedUSD']):,.2f}\n"
                        f"Total Supply: {m['totalSupply']}\n"
                        f"Total Borrow: {m['totalBorrow']}\n"
                        f"Active: {m['isActive']}"
                    )
                else:
                    response = f"No data found for market {found_pair}."
            else:
                response = f"Failed to fetch data for {found_pair}: {r.text}"
        elif "morpho" in text.lower():
            # Default: show top market
            query = {
                "query": """
                { markets(first: 1, orderBy: totalValueLockedUSD, orderDirection: desc) { id name totalValueLockedUSD totalSupply totalBorrow isActive } }
                """
            }
            r = requests.post(MORPHO_SUBGRAPH_URL, json=query, headers=headers)
            if r.ok:
                data = r.json()
                market = data['data']['markets'][0]
                response = (
                    f"Top Market: {market['name']} (ID: {market['id']})\n"
                    f"TVL: ${float(market['totalValueLockedUSD']):,.2f}\n"
                    f"Total Supply: {market['totalSupply']}\n"
                    f"Total Borrow: {market['totalBorrow']}\n"
                    f"Active: {market['isActive']}"
                )
            else:
                response = f"Failed to fetch Morpho data: {r.text}"
    except Exception as e:
        response = f"Error fetching Morpho data: {e}"

    await ctx.send(sender, ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[
            TextContent(type="text", text=response),
            EndSessionContent(type="end-session"),
        ]
    ))

@protocol.on_message(ChatAcknowledgement)
async def handle_ack(ctx: Context, sender: str, msg: ChatAcknowledgement):
    pass

agent.include(protocol, publish_manifest=True)

if __name__ == "__main__":
    agent.run() 