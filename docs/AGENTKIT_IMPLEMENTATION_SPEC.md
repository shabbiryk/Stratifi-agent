# 🏗️ AGENTKIT IMPLEMENTATION SPECIFICATION

**For:** @zym001 (Backend Team)  
**Status:** ❌ Missing - Not implemented  
**Priority:** 🔥 Critical Path

This document provides detailed specifications for implementing the **AgentKit** backend system as originally specified in the project requirements.

---

## 📋 ORIGINAL REQUIREMENTS RECAP

From the original project brief:

> **@zym001:** backend/service/agentkit: create a class AgentKit that has:
>
> 1. **Constructor:** takes userwalletaddress, user_chain_id, safe_chain_ids: [...], safewalletPrivateKey, safeWalletPublicKey (all required)
> 2. **ActionProvider for each chain** (basic wallet actions: getbalance, send, receive, and lending/borrowing actions)
> 3. **One extra actionProvider for user** (only one action: get_balance_in_chain_id)

---

## 🏗️ PROJECT STRUCTURE TO CREATE

Create the following directory structure:

```
backend/
└── service/
    └── agentkit/
        ├── __init__.py
        ├── AgentKit.py           # Main class
        ├── ActionProvider.py     # Chain-specific actions
        ├── UserActionProvider.py # User-specific actions
        ├── BaseActions.py        # Base wallet actions
        ├── LendingActions.py     # DeFi lending actions
        ├── BorrowingActions.py   # DeFi borrowing actions
        └── utils.py              # Utility functions
```

---

## 🔧 IMPLEMENTATION SPECIFICATIONS

### **1. AgentKit Main Class**

**File:** `backend/service/agentkit/AgentKit.py`

```python
from typing import List, Dict, Any
from .ActionProvider import ActionProvider
from .UserActionProvider import UserActionProvider

class AgentKit:
    def __init__(
        self,
        userwalletaddress: str,
        user_chain_id: int,
        safe_chain_ids: List[int],
        safewalletPrivateKey: str,
        safeWalletPublicKey: str
    ):
        """
        Initialize AgentKit with user and safe wallet configuration

        Args:
            userwalletaddress: User's wallet address (0x...)
            user_chain_id: Primary chain ID for user operations
            safe_chain_ids: List of supported chain IDs for agent operations
            safewalletPrivateKey: Agent's wallet private key for transactions
            safeWalletPublicKey: Agent's wallet public address
        """
        # Validate required parameters
        self._validate_inputs(userwalletaddress, user_chain_id, safe_chain_ids,
                            safewalletPrivateKey, safeWalletPublicKey)

        # Store configuration
        self.user_wallet = userwalletaddress.lower()
        self.user_chain_id = user_chain_id
        self.safe_chain_ids = safe_chain_ids
        self.safe_private_key = safewalletPrivateKey
        self.safe_public_key = safeWalletPublicKey.lower()

        # Initialize ActionProviders for each supported chain
        self.action_providers: Dict[int, ActionProvider] = {}
        for chain_id in safe_chain_ids:
            self.action_providers[chain_id] = self._create_chain_provider(chain_id)

        # Initialize user-specific ActionProvider (balance checks only)
        self.user_provider = UserActionProvider(self.user_wallet, self.user_chain_id)

        print(f"✅ AgentKit initialized for user {userwalletaddress[:6]}...{userwalletaddress[-4:]} on {len(safe_chain_ids)} chains")

    def _validate_inputs(self, userwalletaddress: str, user_chain_id: int,
                        safe_chain_ids: List[int], safewalletPrivateKey: str,
                        safeWalletPublicKey: str):
        """Validate all required parameters"""
        if not userwalletaddress or not userwalletaddress.startswith('0x'):
            raise ValueError("Invalid userwalletaddress: must be valid Ethereum address")

        if not isinstance(user_chain_id, int) or user_chain_id <= 0:
            raise ValueError("Invalid user_chain_id: must be positive integer")

        if not safe_chain_ids or not isinstance(safe_chain_ids, list):
            raise ValueError("Invalid safe_chain_ids: must be non-empty list")

        if not safewalletPrivateKey or not safewalletPrivateKey.startswith('0x'):
            raise ValueError("Invalid safewalletPrivateKey: must be valid private key")

        if not safeWalletPublicKey or not safeWalletPublicKey.startswith('0x'):
            raise ValueError("Invalid safeWalletPublicKey: must be valid Ethereum address")

    def _create_chain_provider(self, chain_id: int) -> ActionProvider:
        """Create ActionProvider for specific chain with full capabilities"""
        return ActionProvider(
            chain_id=chain_id,
            private_key=self.safe_private_key,
            public_key=self.safe_public_key
        )

    def get_available_actions(self) -> Dict[str, List[str]]:
        """Return all available actions across all chains"""
        actions = {
            "user_actions": self.user_provider.get_available_actions(),
            "chain_actions": {}
        }

        for chain_id, provider in self.action_providers.items():
            actions["chain_actions"][chain_id] = provider.get_available_actions()

        return actions

    def execute_action(self, chain_id: int, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute action on specified chain or user wallet

        Args:
            chain_id: Chain ID for execution (use user_chain_id for user actions)
            action: Action name (e.g., 'get_balance', 'send', 'lend_usdc')
            params: Action-specific parameters

        Returns:
            Dict with execution results
        """
        try:
            # User-specific actions (balance checks only)
            if chain_id == self.user_chain_id and action.startswith('get_balance'):
                return self.user_provider.execute_action(action, params)

            # Chain-specific actions (full capabilities)
            elif chain_id in self.action_providers:
                return self.action_providers[chain_id].execute_action(action, params)

            else:
                raise ValueError(f"Unsupported chain_id: {chain_id}")

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "action": action,
                "chain_id": chain_id
            }

    def get_user_balance_all_chains(self) -> Dict[int, Dict[str, Any]]:
        """Get user balance across all supported chains"""
        balances = {}

        for chain_id in self.safe_chain_ids:
            try:
                balance_result = self.user_provider.get_balance_in_chain_id(
                    self.user_wallet, chain_id
                )
                balances[chain_id] = balance_result
            except Exception as e:
                balances[chain_id] = {"error": str(e)}

        return balances

    def get_safe_wallet_info(self) -> Dict[str, Any]:
        """Get safe wallet information"""
        return {
            "address": self.safe_public_key,
            "supported_chains": self.safe_chain_ids,
            "capabilities": self.get_available_actions()
        }
```

---

### **2. ActionProvider for Chains**

**File:** `backend/service/agentkit/ActionProvider.py`

```python
from typing import Dict, Any, List
from .BaseActions import BaseActions
from .LendingActions import LendingActions
from .BorrowingActions import BorrowingActions
from .utils import get_chain_config, validate_address, validate_amount

class ActionProvider:
    def __init__(self, chain_id: int, private_key: str, public_key: str):
        """
        Initialize ActionProvider for specific chain

        Args:
            chain_id: Blockchain network ID (1=Ethereum, 8453=Base, etc.)
            private_key: Agent wallet private key for transactions
            public_key: Agent wallet public address
        """
        self.chain_id = chain_id
        self.private_key = private_key
        self.public_key = public_key
        self.chain_config = get_chain_config(chain_id)

        # Initialize action modules
        self.base_actions = BaseActions(chain_id, private_key, public_key)
        self.lending_actions = LendingActions(chain_id, private_key, public_key)
        self.borrowing_actions = BorrowingActions(chain_id, private_key, public_key)

        print(f"✅ ActionProvider initialized for chain {chain_id} ({self.chain_config['name']})")

    def get_available_actions(self) -> List[str]:
        """Return list of all available actions"""
        return [
            # Basic wallet actions
            "get_balance",
            "send_eth",
            "send_token",
            "receive",
            "get_transaction_history",
            "estimate_gas",

            # Lending actions
            "lend_usdc",
            "lend_eth",
            "lend_token",
            "withdraw_lending",
            "get_lending_positions",
            "get_lending_rates",

            # Borrowing actions
            "borrow_usdc",
            "borrow_eth",
            "borrow_token",
            "repay_loan",
            "get_borrowing_positions",
            "get_borrowing_rates",
            "get_collateral_ratio",
        ]

    def execute_action(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute specific action with parameters

        Args:
            action: Action name from get_available_actions()
            params: Action-specific parameters

        Returns:
            Dict with execution results
        """
        try:
            # Route to appropriate action module
            if action in ["get_balance", "send_eth", "send_token", "receive",
                         "get_transaction_history", "estimate_gas"]:
                return self.base_actions.execute(action, params)

            elif action.startswith("lend_") or "lending" in action:
                return self.lending_actions.execute(action, params)

            elif action.startswith("borrow_") or "borrowing" in action or "collateral" in action:
                return self.borrowing_actions.execute(action, params)

            else:
                raise ValueError(f"Unknown action: {action}")

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "action": action,
                "chain_id": self.chain_id
            }
```

---

### **3. UserActionProvider (Limited Scope)**

**File:** `backend/service/agentkit/UserActionProvider.py`

```python
from typing import Dict, Any, List
from .utils import get_chain_config, validate_address
import asyncio
from web3 import Web3

class UserActionProvider:
    def __init__(self, user_wallet_address: str, primary_chain_id: int):
        """
        Initialize UserActionProvider with limited scope
        Only supports balance checking - no transaction capabilities

        Args:
            user_wallet_address: User's wallet address for balance checks
            primary_chain_id: User's primary chain for operations
        """
        self.user_wallet = user_wallet_address.lower()
        self.primary_chain_id = primary_chain_id

        print(f"✅ UserActionProvider initialized for {user_wallet_address[:6]}...{user_wallet_address[-4:]}")

    def get_available_actions(self) -> List[str]:
        """Return list of user-specific actions (read-only)"""
        return [
            "get_balance_in_chain_id"  # Only action as specified in requirements
        ]

    def execute_action(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute user-specific action

        Args:
            action: Must be "get_balance_in_chain_id"
            params: {"chain_id": int, "token_address": str (optional)}

        Returns:
            Balance information for user wallet
        """
        if action != "get_balance_in_chain_id":
            raise ValueError(f"UserActionProvider only supports 'get_balance_in_chain_id', got: {action}")

        chain_id = params.get("chain_id", self.primary_chain_id)
        token_address = params.get("token_address")  # Optional: None = ETH/native balance

        return self.get_balance_in_chain_id(self.user_wallet, chain_id, token_address)

    def get_balance_in_chain_id(self, wallet_address: str, chain_id: int,
                               token_address: str = None) -> Dict[str, Any]:
        """
        Get balance for wallet on specific chain

        Args:
            wallet_address: Wallet to check
            chain_id: Chain ID to check on
            token_address: Optional token contract (None = native token)

        Returns:
            Dict with balance information
        """
        try:
            validate_address(wallet_address)
            chain_config = get_chain_config(chain_id)

            # Connect to blockchain RPC
            w3 = Web3(Web3.HTTPProvider(chain_config["rpc_url"]))

            if not w3.is_connected():
                raise Exception(f"Failed to connect to {chain_config['name']} RPC")

            if token_address is None:
                # Get native token balance (ETH, MATIC, etc.)
                balance_wei = w3.eth.get_balance(wallet_address)
                balance_formatted = w3.from_wei(balance_wei, 'ether')

                return {
                    "success": True,
                    "wallet_address": wallet_address,
                    "chain_id": chain_id,
                    "chain_name": chain_config["name"],
                    "token": chain_config["native_token"],
                    "balance_raw": str(balance_wei),
                    "balance_formatted": str(balance_formatted),
                    "balance_usd": self._get_usd_value(chain_config["native_token"], balance_formatted)
                }
            else:
                # Get ERC20 token balance
                return self._get_erc20_balance(w3, wallet_address, token_address, chain_config)

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "wallet_address": wallet_address,
                "chain_id": chain_id
            }

    def _get_erc20_balance(self, w3: Web3, wallet_address: str,
                          token_address: str, chain_config: Dict) -> Dict[str, Any]:
        """Get ERC20 token balance"""
        # Standard ERC20 ABI for balanceOf and decimals
        erc20_abi = [
            {
                "constant": True,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "decimals",
                "outputs": [{"name": "", "type": "uint8"}],
                "type": "function"
            },
            {
                "constant": True,
                "inputs": [],
                "name": "symbol",
                "outputs": [{"name": "", "type": "string"}],
                "type": "function"
            }
        ]

        contract = w3.eth.contract(address=token_address, abi=erc20_abi)

        balance_raw = contract.functions.balanceOf(wallet_address).call()
        decimals = contract.functions.decimals().call()
        symbol = contract.functions.symbol().call()

        balance_formatted = balance_raw / (10 ** decimals)

        return {
            "success": True,
            "wallet_address": wallet_address,
            "chain_id": chain_config["chain_id"],
            "chain_name": chain_config["name"],
            "token": symbol,
            "token_address": token_address,
            "balance_raw": str(balance_raw),
            "balance_formatted": str(balance_formatted),
            "decimals": decimals,
            "balance_usd": self._get_usd_value(symbol, balance_formatted)
        }

    def _get_usd_value(self, token_symbol: str, amount: float) -> str:
        """Get USD value for token amount (placeholder - integrate with price API)"""
        # Placeholder - replace with real price API
        mock_prices = {
            "ETH": 2300.0,
            "USDC": 1.0,
            "USDT": 1.0,
            "MATIC": 0.85,
            "BTC": 43000.0
        }

        price = mock_prices.get(token_symbol.upper(), 0)
        usd_value = float(amount) * price
        return f"${usd_value:.2f}"
```

---

### **4. Base Actions Implementation**

**File:** `backend/service/agentkit/BaseActions.py`

```python
from typing import Dict, Any
from .utils import get_chain_config, validate_address, validate_amount
from web3 import Web3
import json

class BaseActions:
    def __init__(self, chain_id: int, private_key: str, public_key: str):
        self.chain_id = chain_id
        self.private_key = private_key
        self.public_key = public_key
        self.chain_config = get_chain_config(chain_id)
        self.w3 = Web3(Web3.HTTPProvider(self.chain_config["rpc_url"]))

    def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute basic wallet action"""
        action_map = {
            "get_balance": self.get_balance,
            "send_eth": self.send_eth,
            "send_token": self.send_token,
            "receive": self.receive,
            "get_transaction_history": self.get_transaction_history,
            "estimate_gas": self.estimate_gas,
        }

        if action not in action_map:
            raise ValueError(f"Unknown base action: {action}")

        return action_map[action](params)

    def get_balance(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get agent wallet balance"""
        try:
            balance_wei = self.w3.eth.get_balance(self.public_key)
            balance_eth = self.w3.from_wei(balance_wei, 'ether')

            return {
                "success": True,
                "action": "get_balance",
                "wallet_address": self.public_key,
                "chain_id": self.chain_id,
                "balance_wei": str(balance_wei),
                "balance_eth": str(balance_eth),
                "balance_usd": f"${float(balance_eth) * 2300:.2f}"  # Mock price
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_eth(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Send ETH from agent wallet"""
        try:
            to_address = params["to_address"]
            amount_eth = params["amount_eth"]

            validate_address(to_address)
            validate_amount(amount_eth)

            # Build transaction
            nonce = self.w3.eth.get_transaction_count(self.public_key)
            gas_price = self.w3.eth.gas_price

            transaction = {
                'to': to_address,
                'value': self.w3.to_wei(amount_eth, 'ether'),
                'gas': 21000,
                'gasPrice': gas_price,
                'nonce': nonce,
            }

            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)

            return {
                "success": True,
                "action": "send_eth",
                "transaction_hash": tx_hash.hex(),
                "to_address": to_address,
                "amount_eth": amount_eth,
                "chain_id": self.chain_id
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_token(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Send ERC20 token from agent wallet"""
        # Implement ERC20 transfer logic
        pass

    def receive(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle receiving funds (monitoring)"""
        # Implement receive monitoring logic
        pass

    def get_transaction_history(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get recent transactions"""
        # Implement transaction history logic
        pass

    def estimate_gas(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Estimate gas for transaction"""
        # Implement gas estimation logic
        pass
```

---

### **5. Lending Actions Implementation**

**File:** `backend/service/agentkit/LendingActions.py`

```python
from typing import Dict, Any
from .BaseActions import BaseActions

class LendingActions(BaseActions):
    def __init__(self, chain_id: int, private_key: str, public_key: str):
        super().__init__(chain_id, private_key, public_key)
        self.lending_contracts = self._get_lending_contracts()

    def _get_lending_contracts(self) -> Dict[str, str]:
        """Get lending protocol contract addresses for this chain"""
        # Return protocol-specific contract addresses
        contracts = {
            1: {  # Ethereum Mainnet
                "aave_pool": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
                "compound_comptroller": "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
                "morpho_aave": "0x777777c9898D384F785Ee44Acfe945efDFf5f3E0"
            },
            8453: {  # Base
                "aave_pool": "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
                "compound_comet": "0x46e6b214b524310239732D51387075E0e70970bf",
                "morpho_blue": "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb"
            }
        }
        return contracts.get(self.chain_id, {})

    def execute(self, action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute lending action"""
        action_map = {
            "lend_usdc": self.lend_usdc,
            "lend_eth": self.lend_eth,
            "lend_token": self.lend_token,
            "withdraw_lending": self.withdraw_lending,
            "get_lending_positions": self.get_lending_positions,
            "get_lending_rates": self.get_lending_rates,
        }

        if action not in action_map:
            raise ValueError(f"Unknown lending action: {action}")

        return action_map[action](params)

    def lend_usdc(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Lend USDC to DeFi protocol"""
        try:
            amount = params["amount"]
            protocol = params.get("protocol", "aave")  # Default to Aave

            if protocol == "aave":
                return self._lend_to_aave("USDC", amount)
            elif protocol == "morpho":
                return self._lend_to_morpho("USDC", amount)
            else:
                raise ValueError(f"Unsupported lending protocol: {protocol}")

        except Exception as e:
            return {"success": False, "error": str(e)}

    def lend_eth(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Lend ETH to DeFi protocol"""
        # Implement ETH lending logic
        pass

    def _lend_to_aave(self, asset: str, amount: float) -> Dict[str, Any]:
        """Lend asset to Aave protocol"""
        try:
            pool_address = self.lending_contracts.get("aave_pool")
            if not pool_address:
                raise ValueError("Aave pool contract not found for this chain")

            # Implement Aave lending transaction
            # 1. Approve token spending
            # 2. Call supply() on Aave pool
            # 3. Return transaction details

            return {
                "success": True,
                "action": "lend_to_aave",
                "protocol": "aave",
                "asset": asset,
                "amount": amount,
                "transaction_hash": "0x...",  # Actual tx hash
                "estimated_apy": "4.5%",  # Get from Aave API
                "chain_id": self.chain_id
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def get_lending_rates(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get current lending rates across protocols"""
        try:
            asset = params.get("asset", "USDC")

            rates = {
                "aave": self._get_aave_rate(asset),
                "compound": self._get_compound_rate(asset),
                "morpho": self._get_morpho_rate(asset)
            }

            return {
                "success": True,
                "action": "get_lending_rates",
                "asset": asset,
                "chain_id": self.chain_id,
                "rates": rates
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

    def _get_aave_rate(self, asset: str) -> str:
        """Get Aave lending APY for asset"""
        # Implement Aave rate fetching
        return "4.2%"  # Placeholder
```

---

### **6. Integration with Agent Backend**

**File:** `agent/agent.py` (Update existing file)

Add AgentKit integration to the existing agent service:

```python
# Add at top of file
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'service'))

from agentkit.AgentKit import AgentKit
import re

def parse_contextual_message(message: str) -> Dict[str, Any]:
    """
    Parse the contextual message sent from API layer

    Expected format:
    User Wallet: 0x1234...
    Chain: base (8453)
    Agent Wallet: 0x5678...
    Risk Profile: moderate
    Previous Context: ...
    Message History: ...
    Current Message: ...
    """
    context = {}

    # Extract user wallet
    user_wallet_match = re.search(r'User Wallet: (0x[a-fA-F0-9]{40})', message)
    if user_wallet_match:
        context['user_wallet'] = user_wallet_match.group(1)

    # Extract chain info
    chain_match = re.search(r'Chain: \w+ \((\d+)\)', message)
    if chain_match:
        context['chain_id'] = int(chain_match.group(1))

    # Extract agent wallet
    agent_wallet_match = re.search(r'Agent Wallet: (0x[a-fA-F0-9]{40})', message)
    if agent_wallet_match:
        context['agent_public_key'] = agent_wallet_match.group(1)

    # Extract risk profile
    risk_match = re.search(r'Risk Profile: (\w+)', message)
    if risk_match:
        context['risk_profile'] = risk_match.group(1)

    # Extract current message
    current_msg_match = re.search(r'Current Message: (.+)$', message, re.MULTILINE | re.DOTALL)
    if current_msg_match:
        context['current_message'] = current_msg_match.group(1).strip()

    return context

async def process_message(message: str) -> str:
    """Process message using AgentKit + AI"""
    try:
        # Parse contextual information
        context = parse_contextual_message(message)

        if not context.get('user_wallet') or not context.get('agent_public_key'):
            # Fallback to existing Morpho-only logic
            return await process_morpho_message(message)

        # Get agent private key from database/config
        agent_private_key = get_agent_private_key(context['agent_public_key'])

        # Create AgentKit instance
        agent_kit = AgentKit(
            userwalletaddress=context['user_wallet'],
            user_chain_id=context.get('chain_id', 8453),
            safe_chain_ids=[1, 8453, 42161, 137, 10],  # Multi-chain support
            safewalletPrivateKey=agent_private_key,
            safeWalletPublicKey=context['agent_public_key']
        )

        # Process message with AgentKit capabilities
        user_message = context.get('current_message', message)

        # Generate intelligent response using AI + AgentKit
        ai_response = await generate_agentkit_response(user_message, agent_kit, context)

        return ai_response

    except Exception as e:
        logger.error(f"Error in AgentKit processing: {e}")
        return f"I encountered an issue processing your request: {str(e)}"

def get_agent_private_key(agent_public_key: str) -> str:
    """Get agent private key from secure storage"""
    # This should fetch from secure database or environment
    # For demo, use hardcoded key (NEVER in production)
    return "0x..." # Replace with actual secure key retrieval

async def generate_agentkit_response(message: str, agent_kit: AgentKit, context: Dict[str, Any]) -> str:
    """Generate AI response with AgentKit integration"""
    try:
        # Analyze user message for required actions
        if "balance" in message.lower():
            # Get user balance using AgentKit
            balance_result = agent_kit.user_provider.get_balance_in_chain_id(
                context['user_wallet'],
                context.get('chain_id', 8453)
            )

            if balance_result['success']:
                return f"💰 **Your Balance**\n\n**{balance_result['token']}:** {balance_result['balance_formatted']}\n**USD Value:** {balance_result['balance_usd']}\n**Chain:** {balance_result['chain_name']}"
            else:
                return f"❌ Unable to fetch balance: {balance_result['error']}"

        elif any(word in message.lower() for word in ['lend', 'supply', 'deposit']):
            # Get lending rates using AgentKit
            rates_result = agent_kit.action_providers[context.get('chain_id', 8453)].execute_action(
                'get_lending_rates',
                {'asset': 'USDC'}
            )

            if rates_result['success']:
                rates = rates_result['rates']
                return f"📊 **Current Lending Rates**\n\n**Aave:** {rates['aave']}\n**Compound:** {rates['compound']}\n**Morpho:** {rates['morpho']}\n\nWould you like me to execute a lending transaction?"
            else:
                return "❌ Unable to fetch current lending rates. Please try again."

        else:
            # Default AI response for other queries
            return await generate_fallback_response(message, context)

    except Exception as e:
        return f"Error generating response: {str(e)}"

# Keep existing Morpho logic as fallback
async def process_morpho_message(message: str) -> str:
    """Fallback to existing Morpho-only logic"""
    # Existing Morpho protocol logic here
    return "I can help with Morpho protocol. Ask about 'top markets' or 'best pools'."
```

---

## 🧪 TESTING SPECIFICATIONS

Create test files to validate AgentKit functionality:

### **File:** `backend/service/agentkit/test_agentkit.py`

```python
import pytest
from AgentKit import AgentKit

class TestAgentKit:
    def setup_method(self):
        self.test_user_wallet = "0x742d35Cc6Dd4e47c8Aa91fc4f11A6c9e2e1B6542"
        self.test_agent_private_key = "0x..." # Test private key
        self.test_agent_public_key = "0x..." # Test public key
        self.test_chain_ids = [1, 8453, 42161]

        self.agent_kit = AgentKit(
            userwalletaddress=self.test_user_wallet,
            user_chain_id=8453,
            safe_chain_ids=self.test_chain_ids,
            safewalletPrivateKey=self.test_agent_private_key,
            safeWalletPublicKey=self.test_agent_public_key
        )

    def test_initialization(self):
        """Test AgentKit initializes correctly"""
        assert self.agent_kit.user_wallet == self.test_user_wallet.lower()
        assert self.agent_kit.user_chain_id == 8453
        assert len(self.agent_kit.action_providers) == 3
        assert self.agent_kit.user_provider is not None

    def test_get_available_actions(self):
        """Test getting available actions"""
        actions = self.agent_kit.get_available_actions()
        assert "user_actions" in actions
        assert "chain_actions" in actions
        assert "get_balance_in_chain_id" in actions["user_actions"]

    def test_user_balance_check(self):
        """Test user balance checking"""
        result = self.agent_kit.execute_action(
            chain_id=8453,
            action="get_balance_in_chain_id",
            params={"chain_id": 8453}
        )
        # Should return balance info or error
        assert "success" in result

    def test_invalid_action(self):
        """Test handling of invalid actions"""
        result = self.agent_kit.execute_action(
            chain_id=8453,
            action="invalid_action",
            params={}
        )
        assert result["success"] == False
        assert "error" in result

if __name__ == "__main__":
    pytest.main([__file__])
```

---

## 🚀 DEPLOYMENT CHECKLIST

### **Step 1: Environment Setup**

```bash
# Create directory structure
mkdir -p backend/service/agentkit
cd backend/service/agentkit

# Create Python files
touch __init__.py AgentKit.py ActionProvider.py UserActionProvider.py
touch BaseActions.py LendingActions.py BorrowingActions.py utils.py

# Install dependencies
pip install web3 pytest python-dotenv
```

### **Step 2: Configuration**

Create `backend/service/agentkit/utils.py`:

```python
from typing import Dict, Any
import os
from web3 import Web3

def get_chain_config(chain_id: int) -> Dict[str, Any]:
    """Get blockchain configuration for chain ID"""
    configs = {
        1: {
            "name": "Ethereum Mainnet",
            "rpc_url": os.getenv("ETHEREUM_RPC_URL", "https://eth-mainnet.g.alchemy.com/v2/..."),
            "native_token": "ETH",
            "chain_id": 1
        },
        8453: {
            "name": "Base",
            "rpc_url": os.getenv("BASE_RPC_URL", "https://base-mainnet.g.alchemy.com/v2/..."),
            "native_token": "ETH",
            "chain_id": 8453
        },
        42161: {
            "name": "Arbitrum One",
            "rpc_url": os.getenv("ARBITRUM_RPC_URL", "https://arb-mainnet.g.alchemy.com/v2/..."),
            "native_token": "ETH",
            "chain_id": 42161
        }
    }

    if chain_id not in configs:
        raise ValueError(f"Unsupported chain_id: {chain_id}")

    return configs[chain_id]

def validate_address(address: str) -> bool:
    """Validate Ethereum address format"""
    if not address or not isinstance(address, str):
        raise ValueError("Invalid address: must be string")

    if not address.startswith('0x') or len(address) != 42:
        raise ValueError("Invalid address: must be 42-character hex string starting with 0x")

    if not Web3.is_address(address):
        raise ValueError("Invalid address: not a valid Ethereum address")

    return True

def validate_amount(amount) -> bool:
    """Validate transaction amount"""
    try:
        float_amount = float(amount)
        if float_amount <= 0:
            raise ValueError("Amount must be positive")
        return True
    except (ValueError, TypeError):
        raise ValueError("Amount must be a valid number")
```

### **Step 3: Integration Test**

```bash
# Test AgentKit integration
cd agent
python -c "
import sys
sys.path.append('../backend/service')
from agentkit.AgentKit import AgentKit

# Test initialization
kit = AgentKit(
    userwalletaddress='0x742d35Cc6Dd4e47c8Aa91fc4f11A6c9e2e1B6542',
    user_chain_id=8453,
    safe_chain_ids=[8453],
    safewalletPrivateKey='0x...',
    safeWalletPublicKey='0x...'
)

print('✅ AgentKit initialized successfully')
print('Available actions:', kit.get_available_actions())
"
```

### **Step 4: Frontend Integration**

Once AgentKit is implemented, the existing frontend will automatically use it through the updated `agent/agent.py` service.

---

## 📝 DELIVERABLES CHECKLIST

- [ ] **AgentKit.py** - Main class with constructor and action routing
- [ ] **ActionProvider.py** - Chain-specific action provider
- [ ] **UserActionProvider.py** - User balance checking only
- [ ] **BaseActions.py** - Basic wallet operations (get_balance, send, receive)
- [ ] **LendingActions.py** - DeFi lending operations
- [ ] **BorrowingActions.py** - DeFi borrowing operations
- [ ] **utils.py** - Helper functions and chain configurations
- [ ] **test_agentkit.py** - Comprehensive test suite
- [ ] **Integration with agent.py** - Updated to use AgentKit
- [ ] **Documentation** - API documentation for all methods

---

## 🔗 INTEGRATION WITH EXISTING SYSTEM

The AgentKit will integrate seamlessly with the existing system:

1. **Frontend calls** → `app/api/chat_with_agent/route.ts` (✅ Ready)
2. **API prepares context** → Contextual message with wallet data (✅ Ready)
3. **Backend receives** → `agent/agent.py` `/chat` endpoint (✅ Ready)
4. **AgentKit processes** → Your AgentKit implementation (❌ Missing)
5. **Response returns** → Through existing API to frontend (✅ Ready)

The entire infrastructure is ready - just need your AgentKit implementation! 🚀

---

**Priority:** 🔥 **CRITICAL PATH** - Frontend and AI teams are blocked until AgentKit is implemented.

**Timeline:** This implementation will unlock both @bash (AI) and frontend integration testing.

**Support:** All database tables, API endpoints, and frontend integration is complete and ready for your AgentKit! 💪
