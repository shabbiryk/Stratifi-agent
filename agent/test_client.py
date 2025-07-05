import requests

# The Morpho agent's endpoint and address
MORPHO_AGENT_ENDPOINT = "http://127.0.0.1:8000"  # Update if your agent runs on a different port
MORPHO_AGENT_ADDRESS = "agent1q253a8lc6j"        # Update to match your running agent

# The message to send
payload = {
    "type": "ChatMessage",
    "text": "What is the total supply on Morpho?"
}

try:
    response = requests.post(f"{MORPHO_AGENT_ENDPOINT}/submit/{MORPHO_AGENT_ADDRESS}", json=payload)
    print("Status:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error communicating with Morpho agent:", e) 