import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16 flex items-center justify-center">
      <div className="w-full max-w-3xl px-4">
        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-800">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 text-center">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-center mb-8 text-lg">
            Last Updated: June 16, 2025
          </p>
          <p className="text-center text-slate-400 mb-10 max-w-2xl mx-auto">
            This Privacy Policy describes how Stratifi ("we," "our," or "us")
            collects, uses, and protects data in connection with our services,
            including our website{" "}
            <a
              href="https://stratifi.xyz"
              className="text-blue-400 hover:underline"
            >
              https://stratifi.xyz
            </a>
            , AI Agent, and non-custodial vaults. Stratifi is not a registered
            entity and operates as a decentralized autonomous financial protocol
            on Starknet.
          </p>

          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                1. Scope and Nature of Our Services
              </h2>
              <p className="text-slate-300">
                Stratifi is a non-custodial, AI-powered liquidity management and
                yield optimization protocol. Users interact with our smart
                contracts and frontend interfaces to deposit assets into
                yield-generating vaults or use our AI Agent to optimize lending
                and borrowing strategies across DeFi protocols. We do not hold
                custody of user assets or store personal identity data unless
                explicitly provided.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">2. Data We Collect</h2>
              <h3 className="text-lg font-semibold mt-4 mb-1">
                a. Automatically Collected Data:
              </h3>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Public wallet addresses</li>
                <li>Smart contract interaction logs</li>
                <li>
                  On-chain activity relevant to deposits, withdrawals, and vault
                  usage
                </li>
                <li>
                  Device metadata (IP address, browser type) for analytics
                </li>
              </ul>
              <h3 className="text-lg font-semibold mt-4 mb-1">
                b. Voluntarily Provided Data:
              </h3>
              <ul className="list-disc list-inside text-slate-300">
                <li>
                  Email addresses submitted via feedback or early access forms
                </li>
                <li>Responses to surveys or support requests</li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">3. Use of Data</h2>
              <p className="mb-2">We use collected data to:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Provide and improve our services</li>
                <li>Power the AI Agent's personalized suggestions</li>
                <li>Analyze vault performance and user activity</li>
                <li>
                  Communicate updates (only if email is voluntarily submitted)
                </li>
              </ul>
              <p className="mb-2 font-semibold">
                We <span className="text-red-400">do not</span>:
              </p>
              <ul className="list-disc list-inside text-slate-300">
                <li>Sell or rent personal data</li>
                <li>Collect private keys or access user funds</li>
                <li>
                  Track users across platforms or store cookies unnecessarily
                </li>
              </ul>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">4. Use of Cookies</h2>
              <p className="mb-2">We use minimal cookies solely to:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Maintain session integrity</li>
                <li>Analyze usage patterns for UI improvements</li>
              </ul>
              <p>
                You may disable cookies via your browser settings, though this
                may limit functionality.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                5. AI Agent Data Processing
              </h2>
              <p className="mb-2">Stratifi's AI Agent operates on:</p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>
                  Wallet-based on-chain data (TVL, APY, collateral ratios, risk
                  settings)
                </li>
                <li>
                  Natural language instructions for yield or borrow strategies
                </li>
              </ul>
              <p>
                User inputs are processed transiently and are not stored
                persistently. In fully autonomous mode, your strategy is
                executed via smart contracts after one-time wallet approval.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">6. Data Security</h2>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Audited smart contracts</li>
                <li>Non-custodial architecture</li>
                <li>Encrypted connections (HTTPS)</li>
              </ul>
              <p>
                However, blockchain interactions carry inherent risks. Users
                must safeguard their private keys and use Stratifi at their own
                discretion.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">
                7. Third-Party Integrations
              </h2>
              <p>
                We integrate with services like AVNU, Fibrous, LayerAkira, and
                form tools (e.g., Typeform). These services may collect
                anonymized data under their own privacy policies.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">8. Your Rights</h2>
              <p>
                If you've submitted your email or other personal information,
                you can request:
              </p>
              <ul className="list-disc list-inside text-slate-300 mb-4">
                <li>Deletion of your data</li>
                <li>Correction of incorrect entries</li>
                <li>Clarification on data use</li>
              </ul>
              <p>
                Contact us at:{" "}
                <a
                  href="mailto:info@stratifi.xyz"
                  className="text-blue-400 hover:underline"
                >
                  info@stratifi.xyz
                </a>
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">9. Children's Privacy</h2>
              <p>
                Stratifi is not intended for users under 18. We do not knowingly
                collect data from minors.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold mb-2">10. Policy Updates</h2>
              <p>
                This policy may be revised over time. Updates will be posted
                with a new effective date.
              </p>
            </section>
            <div className="border-t border-slate-800" />

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold mb-2">Contact</h2>
              <p>
                If you have any questions or concerns:
                <br />
                📧 Email us at{" "}
                <a
                  href="mailto:info@stratifi.xyz"
                  className="text-blue-400 hover:underline"
                >
                  info@stratifi.xyz
                </a>
                <br />
                🌐 Website:{" "}
                <a
                  href="https://stratifi.xyz"
                  className="text-blue-400 hover:underline"
                >
                  https://stratifi.xyz
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
