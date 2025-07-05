from datetime import datetime
from uuid import uuid4
import re
import requests
import os

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

# Subgraph URLs for each chain
SUBGRAPH_URLS = {
    "katana": "https://gateway.thegraph.com/api/subgraphs/id/ESbNRVHte3nwhcHveux9cK4FFAZK3TTLc5mKQNtpYgmu",
    "base": "https://gateway.thegraph.com/api/subgraphs/id/71ZTy1veF9twER9CLMnPWeLQ7GZcwKsjmygejrgKirqs",
    "mainnet": "https://gateway.thegraph.com/api/subgraphs/id/8Lz789DP5VKLXumTMTgygjU2xtuzx8AhbaacgN5PYCAs",
    "arbitrum": "https://gateway.thegraph.com/api/subgraphs/id/XsJn88DNCHJ1kgTqYeTgHMQSK4LuG1LR75339QVeQ26",
}

DEFAULT_CHAINS = ["katana", "base", "mainnet", "arbitrum"]

def fetch_morpho_market_data(market_name=None, top_n=1, subgraph_url=None):
    if not subgraph_url:
        subgraph_url = SUBGRAPH_URLS["base"]
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
            "query": f"""
            {{ markets(first: {top_n}, orderBy: totalValueLockedUSD, orderDirection: desc) {{ id name totalValueLockedUSD totalSupply totalBorrow isActive }} }}
            """
        }
    try:
        r = requests.post(subgraph_url, json=query, headers=headers)
        return r
    except Exception as e:
        return e

def get_market_reasoning(market, rank=1):
    """
    Use ASI:One LLM to generate a human explanation for why this market is ranked at the top.
    """
    url = "https://api.asi1.ai/v1/chat/completions"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.getenv("ASI1_API_KEY") or ASI_ONE_API_KEY}'
    }

    prompt = f"""
    You are a DeFi expert. Explain in 1-2 sentences, in plain English, why the following Morpho market is ranked #{rank} among all markets. Be clear and concise, and use the data provided.\n\nMarket: {market['name']}\nTVL: ${float(market['totalValueLockedUSD']):,.2f}\nTotal Supply: {market['totalSupply']}\nTotal Borrow: {market['totalBorrow']}\nActive: {market['isActive']}\n\nWhy is this the top market?
    """

    payload = {
        "model": "asi1-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 100
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"(Could not fetch reasoning: {e})"

def get_market_pros_cons(market):
    url = "https://api.asi1.ai/v1/chat/completions"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.getenv("ASI1_API_KEY") or ASI_ONE_API_KEY}'
    }
    prompt = f"""
    You are a DeFi analyst. Given the following Morpho market data, list 1-2 main 'Goods' (pros) and 1-2 main 'Bads' (cons) for a user considering this pool. Be concise and use the data provided.\n\nMarket: {market['name']}\nTVL: ${float(market['totalValueLockedUSD']):,.2f}\nTotal Supply: {market['totalSupply']}\nTotal Borrow: {market['totalBorrow']}\nActive: {market['isActive']}\n\nList the goods and bads as bullet points under 'Goods:' and 'Bads:'.\n\nGoods:
    """
    payload = {
        "model": "asi1-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 120
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        return f"(Could not fetch pros/cons: {e})"

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
        lower_text = text.lower()
        # Detect chain
        chain = None
        for c in SUBGRAPH_URLS:
            if c in lower_text:
                chain = c
                break
        if chain:
            ctx.logger.info(f"User requested chain: {chain}")
        # Check for 'top N' request
        top_n = 1
        match = re.search(r"top\s*(\d+)", lower_text)
        if match:
            top_n = int(match.group(1))
            ctx.logger.info(f"User requested top {top_n} markets.")

        # Only support top N and general morpho/pool/market logic
        if any(word in lower_text for word in ["morpho", "moprho", "morhpo", "morfo"]) or (
            "top" in lower_text and ("pool" in lower_text or "market" in lower_text)
        ):
            if chain:
                ctx.logger.info(f"Querying Morpho subgraph for top {top_n} markets on {chain}")
                r = fetch_morpho_market_data(top_n=top_n, subgraph_url=SUBGRAPH_URLS[chain])
                if isinstance(r, Exception):
                    ctx.logger.error(f"Exception during fetch: {r}")
                    response = f"Error fetching Morpho data: {r}"
                else:
                    ctx.logger.info(f"Subgraph response status: {r.status_code}")
                    if r.ok:
                        data = r.json()
                        ctx.logger.info(f"Subgraph response data: {data}")
                        markets = data['data']['markets']
                        if markets:
                            lines = []
                            for i, m in enumerate(markets, 1):
                                pros_cons = get_market_pros_cons(m)
                                lines.append(
                                    f"{i}. {m['name']} (ID: {m['id']}) | TVL: ${float(m['totalValueLockedUSD']):,.2f} | Supply: {m['totalSupply']} | Borrow: {m['totalBorrow']} | Active: {m['isActive']}\n{pros_cons}"
                                )
                            response = f"Top {len(markets)} Morpho Markets by TVL on {chain.capitalize()}:\n" + "\n".join(lines)
                            # If user also asked for 'best one', highlight the first and add reasoning
                            if "best" in lower_text or "top 1" in lower_text:
                                m = markets[0]
                                reasoning = get_market_reasoning(m, rank=1)
                                response += (
                                    f"\n\nBest Market:\n{m['name']} (ID: {m['id']})\nTVL: ${float(m['totalValueLockedUSD']):,.2f}\nTotal Supply: {m['totalSupply']}\nTotal Borrow: {m['totalBorrow']}\nActive: {m['isActive']}\nReason: {reasoning}"
                                )
                        else:
                            response = f"No market data found for {chain}."
                    else:
                        ctx.logger.error(f"Failed to fetch Morpho data: {r.text}")
                        response = f"Failed to fetch Morpho data: {r.text}"
            else:
                # Aggregate from all chains
                all_markets = []
                for c in DEFAULT_CHAINS:
                    ctx.logger.info(f"Querying Morpho subgraph for top {top_n} markets on {c}")
                    r = fetch_morpho_market_data(top_n=top_n, subgraph_url=SUBGRAPH_URLS[c])
                    if isinstance(r, Exception) or not r.ok:
                        ctx.logger.error(f"Failed to fetch Morpho data for {c}: {getattr(r, 'text', r)}")
                        continue
                    data = r.json()
                    markets = data['data']['markets']
                    for m in markets:
                        m['chain'] = c
                        all_markets.append(m)
                # Sort all markets by TVL
                all_markets.sort(key=lambda x: float(x['totalValueLockedUSD']), reverse=True)
                if all_markets:
                    lines = []
                    for i, m in enumerate(all_markets[:top_n], 1):
                        pros_cons = get_market_pros_cons(m)
                        lines.append(
                            f"{i}. {m['name']} (ID: {m['id']}) | Chain: {m['chain'].capitalize()} | TVL: ${float(m['totalValueLockedUSD']):,.2f} | Supply: {m['totalSupply']} | Borrow: {m['totalBorrow']} | Active: {m['isActive']}\n{pros_cons}"
                        )
                    response = f"Top {len(lines)} Morpho Markets by TVL (All Chains):\n" + "\n".join(lines)
                    # If user also asked for 'best one', highlight the first and add reasoning
                    if "best" in lower_text or "top 1" in lower_text:
                        m = all_markets[0]
                        reasoning = get_market_reasoning(m, rank=1)
                        response += (
                            f"\n\nBest Market:\n{m['name']} (ID: {m['id']}) | Chain: {m['chain'].capitalize()}\nTVL: ${float(m['totalValueLockedUSD']):,.2f}\nTotal Supply: {m['totalSupply']}\nTotal Borrow: {m['totalBorrow']}\nActive: {m['isActive']}\nReason: {reasoning}"
                        )
                else:
                    response = "No market data found across all chains."
        else:
            ctx.logger.info("No matching branch found for user prompt.")
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