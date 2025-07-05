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

def fetch_morpho_market_data(market_name=None):
    headers = {"Authorization": f"Bearer {THE_GRAPH_API_KEY}"}
    if market_name:
        query = {
            "query": f'''
            {{
              markets(where: {{ name: "{market_name}" }}) {{
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
    else:
        query = {
            "query": """
            { markets(first: 1, orderBy: totalValueLockedUSD, orderDirection: desc) { id name totalValueLockedUSD totalSupply totalBorrow isActive } }
            """
        }
    try:
        r = requests.post(MORPHO_SUBGRAPH_URL, json=query, headers=headers)
        return r
    except Exception as e:
        return e

agent = Agent()
protocol = Protocol(spec=chat_protocol_spec)

@protocol.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    ctx.logger.info(f"Received message from {sender}: {msg}")
    await ctx.send(
        sender,
        ChatAcknowledgement(timestamp=datetime.now(), acknowledged_msg_id=msg.msg_id),
    )

    text = ''
    for item in msg.content:
        if isinstance(item, TextContent):
            text += item.text
    ctx.logger.info(f"User prompt: {text}")

    response = 'I am afraid something went wrong and I am unable to answer your question at the moment.'

    try:
        found_pair = None
        for pair in KNOWN_PAIRS:
            if pair.lower() in text.lower():
                found_pair = pair
                break
        if found_pair:
            ctx.logger.info(f"Querying Morpho subgraph for market: {found_pair}")
            r = fetch_morpho_market_data(found_pair)
            if isinstance(r, Exception):
                ctx.logger.error(f"Exception during fetch: {r}")
                response = f"Error fetching data for {found_pair}: {r}"
            else:
                ctx.logger.info(f"Subgraph response status: {r.status_code}")
                if r.ok:
                    data = r.json()
                    ctx.logger.info(f"Subgraph response data: {data}")
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
                    ctx.logger.error(f"Failed to fetch data for {found_pair}: {r.text}")
                    response = f"Failed to fetch data for {found_pair}: {r.text}"
        elif "morpho" in text.lower():
            ctx.logger.info("Querying Morpho subgraph for top market")
            r = fetch_morpho_market_data()
            if isinstance(r, Exception):
                ctx.logger.error(f"Exception during fetch: {r}")
                response = f"Error fetching Morpho data: {r}"
            else:
                ctx.logger.info(f"Subgraph response status: {r.status_code}")
                if r.ok:
                    data = r.json()
                    ctx.logger.info(f"Subgraph response data: {data}")
                    market = data['data']['markets'][0]
                    response = (
                        f"Top Market: {market['name']} (ID: {market['id']})\n"
                        f"TVL: ${float(market['totalValueLockedUSD']):,.2f}\n"
                        f"Total Supply: {market['totalSupply']}\n"
                        f"Total Borrow: {market['totalBorrow']}\n"
                        f"Active: {market['isActive']}"
                    )
                else:
                    ctx.logger.error(f"Failed to fetch Morpho data: {r.text}")
                    response = f"Failed to fetch Morpho data: {r.text}"
    except Exception as e:
        ctx.logger.exception(f"Error fetching Morpho data: {e}")
        response = f"Error fetching Morpho data: {e}"

    ctx.logger.info(f"Responding with: {response}")
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

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Hello, I'm a Morpho agent and my address is {ctx.agent.address}.")

agent.include(protocol, publish_manifest=True)

if __name__ == "__main__":
    agent.run() 