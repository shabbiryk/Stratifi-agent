import React from "react";

export default function Contacts() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-slate-400 mb-10 text-center">
          Have questions, feedback, or need support? Fill out the form below or
          reach out to us directly.
        </p>
        <form className="bg-slate-900 rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
        <div className="mt-12 text-center text-slate-400">
          <div className="mb-2">
            <span className="font-semibold text-white">Email:</span>{" "}
            support@stratifi.xyz
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Telegram:</span>{" "}
            <a
              href="https://t.me/stratifixyz"
              className="text-blue-400 hover:underline"
            >
              @stratifixyz
            </a>
          </div>
          <div>
            <span className="font-semibold text-white">Discord:</span>{" "}
            <a
              href="https://discord.gg/mwaP3SRz2e"
              className="text-purple-400 hover:underline"
            >
              Join our server
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
