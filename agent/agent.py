from datetime import datetime
from uuid import uuid4
import re
import requests
import os
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

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

# Agent configuration
AGENT_PORT = int(os.getenv("AGENT_PORT", "8000"))

# Create FastAPI app
app = FastAPI(title="StratiFi DeFi Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST API Models for frontend integration
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    agent_name: str
    version: str
    timestamp: str

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

# REST API endpoints for frontend integration
@app.post("/chat", response_model=ChatResponse)
async def handle_chat_request(req: ChatRequest):
    """Handle chat requests from frontend"""
    try:
        response = await process_message(req.message)
        
        return ChatResponse(
            response=response,
            session_id=req.session_id or str(uuid4()),
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        return ChatResponse(
            response="",
            session_id=req.session_id or str(uuid4()),
            timestamp=datetime.now().isoformat(),
            error=str(e)
        )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for frontend monitoring"""
    return HealthResponse(
        status="healthy",
        agent_name="StratiFi DeFi Agent",
        version="1.0.0",
        timestamp=datetime.now().isoformat()
    )

async def process_message(message: str) -> str:
    """Process message using existing logic"""
    response = 'I am afraid something went wrong and I am unable to answer your question at the moment.'

    try:
        lower_text = message.lower()
        # Detect chain
        chain = None
        for c in SUBGRAPH_URLS:
            if c in lower_text:
                chain = c
                break
        if chain:
            print(f"User requested chain: {chain}")
        # Check for 'top N' request
        top_n = 1
        match = re.search(r"top\s*(\d+)", lower_text)
        if match:
            top_n = int(match.group(1))
            print(f"User requested top {top_n} markets.")

        # Only support top N and general morpho/pool/market logic
        if any(word in lower_text for word in ["morpho", "moprho", "morhpo", "morfo"]) or (
            "top" in lower_text and ("pool" in lower_text or "market" in lower_text)
        ):
            if chain:
                print(f"Querying Morpho subgraph for top {top_n} markets on {chain}")
                r = fetch_morpho_market_data(top_n=top_n, subgraph_url=SUBGRAPH_URLS[chain])
                if isinstance(r, Exception):
                    print(f"Exception during fetch: {r}")
                    response = f"Error fetching Morpho data: {r}"
                else:
                    print(f"Subgraph response status: {r.status_code}")
                    if r.ok:
                        data = r.json()
                        print(f"Subgraph response data: {data}")
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
                        print(f"Failed to fetch Morpho data: {r.text}")
                        response = f"Failed to fetch Morpho data: {r.text}"
            else:
                # Aggregate from all chains
                all_markets = []
                for c in DEFAULT_CHAINS:
                    print(f"Querying Morpho subgraph for top {top_n} markets on {c}")
                    r = fetch_morpho_market_data(top_n=top_n, subgraph_url=SUBGRAPH_URLS[c])
                    if isinstance(r, Exception) or not r.ok:
                        print(f"Failed to fetch Morpho data for {c}: {getattr(r, 'text', r)}")
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
                            f"{i}. {m['name']} ({m['chain'].capitalize()}) | TVL: ${float(m['totalValueLockedUSD']):,.2f} | Supply: {m['totalSupply']} | Borrow: {m['totalBorrow']} | Active: {m['isActive']}\n{pros_cons}"
                        )
                    response = f"Top {len(lines)} Morpho Markets by TVL across all chains:\n" + "\n".join(lines)
                else:
                    response = "No market data found across all chains."
        else:
            # For general DeFi questions, provide helpful responses
            if any(word in lower_text for word in ["defi", "lending", "borrowing", "yield", "apy"]):
                response = "I can help you with DeFi lending and borrowing on Morpho protocol. Try asking about 'top markets', 'best lending pools', or specific chains like 'Base' or 'Arbitrum'."
            else:
                response = "Hello! I'm your DeFi agent specializing in Morpho protocol. I can help you find the best lending and borrowing opportunities. Try asking about 'top markets' or 'best pools on Base'."
    except Exception as e:
        print(f"Error processing message: {e}")
        response = f"An error occurred while processing your request: {str(e)}"
    
    return response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=AGENT_PORT) 