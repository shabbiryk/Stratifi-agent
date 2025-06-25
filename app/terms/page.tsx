import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-800">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 text-center">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-center mb-8 text-lg">
            Last Updated: June 16, 2025
          </p>
          <p className="text-center text-slate-400 mb-10 max-w-2xl mx-auto">
            Please read these Terms of Service ("Terms") and our Privacy Policy
            carefully. They govern your access to and use of the Stratifi
            platform, including our website (
            <a
              href="https://stratifi.xyz"
              className="text-blue-400 hover:underline"
            >
              https://stratifi.xyz
            </a>
            ), smart contracts, AI Agent, and related features (collectively,
            the "Service").
            <br />
            <br />
            Stratifi is a decentralized, non-custodial yield optimization and
            liquidity management protocol operating on Starknet. Stratifi is not
            a registered legal entity.
          </p>

          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-300">
                By accessing or using the Service, you agree to be bound by
                these Terms. If you do not agree, you may not access or use the
                Service.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                2. Eligibility and Wallet Access
              </h2>
              <p className="text-slate-300">
                You must be at least 18 years old to use the Service. You are
                responsible for safeguarding your Starknet wallet, private keys,
                and access credentials. Stratifi does not have custody of any
                assets and cannot retrieve lost keys or access wallets.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                3. Nature of the Service
              </h2>
              <p className="text-slate-300 mb-2">Stratifi allows users to:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>
                  Deposit tokens into smart vaults (e.g., EverYield) to earn
                  passive yield
                </li>
                <li>
                  Use an AI Agent to discover optimal lending/borrowing
                  strategies
                </li>
                <li>
                  Interact with protocols such as Nostra, Vesu, Aave, Compound
                </li>
                <li>
                  Maintain non-custodial control of their tokens at all times
                </li>
              </ul>
              <p className="text-slate-300">
                We do not provide financial, investment, legal, or tax advice.
                All strategy decisions are your responsibility, whether assisted
                by AI or made independently.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">4. Fees</h2>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>No deposit or withdrawal fees</li>
                <li>
                  Performance fees apply only on yield earned, typically 5%
                </li>
                <li>
                  Certain reward harvests (e.g., DeFi Spring) incur a 5% harvest
                  fee
                </li>
              </ul>
              <p className="text-slate-300">
                All fees are transparently disclosed in each vault's interface.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">5. Use of AI Agent</h2>
              <p className="text-slate-300 mb-2">
                You may use the AI Agent in three modes:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>
                  Fully Autonomous: Agent executes vault or strategy operations
                  after one-time approval
                </li>
                <li>Partially Autonomous: You approve each suggested action</li>
                <li>
                  Research Mode: You receive suggestions only; execution is
                  manual
                </li>
              </ul>
              <p className="text-slate-300">
                Stratifi does not retain or store your wallet contents or
                trading history.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">6. User Conduct</h2>
              <p className="text-slate-300 mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Interfere with the protocol's operation</li>
                <li>
                  Use bots or automation to exploit yield strategies unfairly
                </li>
                <li>Deploy harmful code or malware to our frontend/backend</li>
                <li>
                  Use Stratifi to conduct illegal activity or money laundering
                </li>
              </ul>
              <p className="text-slate-300">
                Violation may result in restricted access to the Service.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                7. Intellectual Property
              </h2>
              <p className="text-slate-300">
                All original code, design elements, and AI architecture are
                owned by Stratifi's creators and contributors. You may not
                duplicate, resell, or exploit these assets without written
                permission.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                8. Third-Party Services
              </h2>
              <p className="text-slate-300">
                Stratifi integrates with protocols and services outside our
                control (e.g., AVNU, Fibrous, LayerAkira, Messari). We are not
                responsible for their uptime, accuracy, or compliance.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">9. Risk Disclosure</h2>
              <p className="text-slate-300 mb-2">
                Using Stratifi involves DeFi risk, including:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Smart contract vulnerabilities</li>
                <li>Fluctuating APYs and impermanent loss</li>
                <li>Strategy underperformance or failure</li>
              </ul>
              <p className="text-slate-300">
                Use at your own risk. We recommend conducting your own due
                diligence.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">10. Termination</h2>
              <p className="text-slate-300">
                We may suspend or terminate your access to the Service if you
                breach these Terms or abuse the system. As a decentralized
                protocol, user participation is subject to smart contract logic
                and frontend access.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">11. Changes to Terms</h2>
              <p className="text-slate-300">
                We may update these Terms at any time. Changes will be posted to{" "}
                <a
                  href="https://stratifi.xyz"
                  className="text-blue-400 hover:underline"
                >
                  https://stratifi.xyz
                </a>
                . Continued use of the Service constitutes acceptance of the
                updated Terms.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">12. Governing Law</h2>
              <p className="text-slate-300">
                These Terms are governed by no specific jurisdiction. Users must
                comply with local laws applicable to their use of decentralized
                finance services.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">13. Contact</h2>
              <p className="text-slate-300">
                For questions, email us at{" "}
                <a
                  href="mailto:info@stratifi.xyz"
                  className="text-blue-400 hover:underline"
                >
                  info@stratifi.xyz
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
