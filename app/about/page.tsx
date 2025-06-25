import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
          About Us
        </h1>
        <div className="prose prose-invert max-w-none text-slate-300">
          <p>Welcome to Stratifi — your intelligent DeFi copilot.</p>
          <p>
            Stratifi is a smart liquidity manager and autonomous financial agent
            designed to make DeFi yield generation accessible, efficient, and
            intelligent. Built on Starknet, our platform delivers non-custodial,
            AI-enhanced yield strategies for everyone — from passive retail
            users to high-risk, high-reward DeFi veterans.
          </p>

          <h2>Our Mission</h2>
          <p>
            We believe decentralized finance should be simple, secure, and
            tailored to your needs. Stratifi's mission is to empower users with
            automated financial intelligence, helping them unlock the best
            yields across DeFi protocols without sacrificing transparency,
            safety, or control.
          </p>

          <h2>What We Offer</h2>
          <h3>EverYield Vaults</h3>
          <p>
            Our flagship product, EverYield, is a set of auto-compounding vaults
            that rotate capital between protocols like Vesu and Nostra based on
            real-time APY. Funds are always deployed to the best-performing
            money market — no user action required.
          </p>
          <h3>AI Agent</h3>
          <p>
            The Stratifi AI Agent helps users make smarter lending and borrowing
            decisions. It operates at your comfort level:
          </p>
          <ul>
            <li>Fully Autonomous: Approve once and let it execute</li>
            <li>Partially Manual: Confirm each move</li>
            <li>Research Mode: Get strategy suggestions only</li>
          </ul>
          <p>
            Powered by our Scout Engine, Think Tank ML models, and on-chain Data
            Aggregator, the AI Agent delivers personalized, explainable DeFi
            strategies.
          </p>
          <h3>Proactive Liquidity Management</h3>
          <p>
            Using keeper bots and rebalancing logic, Stratifi ensures optimal
            asset allocation 24/7. Withdrawals are always non-custodial and
            fee-free, and users earn with zero-slippage swaps and automated
            reallocation.
          </p>

          <h2>Why Stratifi?</h2>
          <ul>
            <li>Non-custodial and transparent</li>
            <li>Audited and security-reviewed contracts</li>
            <li>Built natively for Starknet scalability</li>
            <li>AI-augmented with human-readable insights</li>
            <li>Seamless UX for DeFi beginners and pros alike</li>
          </ul>

          <h2>Our Team</h2>
          <p>
            Stratifi is led by experienced builders from the Starknet,
            Chainlink, and Arbitrum ecosystems — with prior work at JP Morgan,
            Nethermind, and EF. We're security-first, AI-native, and driven by a
            shared belief in autonomous, intelligent finance.
          </p>

          <h2>Backed by Starknet Foundation</h2>
          <p>
            We've received support and grants from the Starknet Foundation and
            built our product at the Starknet Hacker House in Denver.
          </p>

          <h2>Join the Future of Finance</h2>
          <p>
            Whether you want your stablecoins to work smarter or you're seeking
            alpha in complex markets — Stratifi is your intelligent,
            plug-and-play DeFi vault.
          </p>
          <p>
            🌐 Visit us at{" "}
            <a
              href="https://stratifi.xyz"
              className="text-blue-400 hover:underline"
            >
              https://stratifi.xyz
            </a>
            <br />
            📩 Contact:{" "}
            <a
              href="mailto:info@stratifi.xyz"
              className="text-blue-400 hover:underline"
            >
              info@stratifi.xyz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
