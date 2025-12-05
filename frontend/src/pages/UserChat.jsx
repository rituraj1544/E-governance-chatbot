// src/pages/UserChat.jsx
import React, { useState, useRef, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function UserChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: 'Namaste 🙏, I am JanMitran AI. Ask me about government schemes, Aadhaar, PAN, PM Kisan, scholarships and more.',
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      from: 'user',
      text,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language }),
      });

      const data = await res.json();
      const botText = data.reply || 'Sorry, I could not find an answer.';

      const botMsg = {
        id: `b-${Date.now()}`,
        from: 'bot',
        text: botText,
        ts: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);

      setMessages((prev) => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          from: 'bot',
          text: 'Server error. Please try again later.',
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleQuickAsk(text) {
    setInput(text);
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#1f2937,_#020617)] text-slate-50">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 opacity-60 blur-md" />
              <div className="relative h-9 w-9 rounded-2xl bg-slate-950 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/40">
                JM
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight">
                JanMitran <span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[11px] md:text-xs text-slate-400">
                India’s digital dost for all government services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online · Avg response &lt; 2 sec</span>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[11px] md:text-xs border border-slate-700/80 rounded-full px-3 py-1 bg-slate-900/80 shadow-sm shadow-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (coming soon)</option>
            </select>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6 md:space-y-8">
        {/* HERO STRIP (full width) */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-2xl shadow-slate-950/70">
          <div className="absolute -top-20 -right-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-stretch items-center justify-between gap-6 md:gap-10 px-5 md:px-8 py-6 md:py-8 lg:py-10">
            <div className="flex-1 space-y-3 md:space-y-4 lg:space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] md:text-xs text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Trusted AI helpdesk for citizens</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-[2.1rem] font-semibold leading-snug md:leading-tight">
                Get <span className="text-indigo-400">instant answers</span> for
                Aadhaar, PAN, PM Kisan, scholarships & more.
              </h2>

              <p className="text-xs md:text-sm lg:text-[0.94rem] text-slate-300 max-w-xl">
                Type your problem in simple English or Hinglish. JanMitran AI will give
                you step-by-step help, documents needed, and official links — 24×7.
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                  ✔ Government schemes
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                  ✔ Document & form help
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-200">
                  ✔ No login needed
                </span>
              </div>
            </div>

            <div className="flex-1 flex md:justify-end w-full md:w-auto">
              <div className="relative w-full max-w-xs lg:max-w-sm">
                <div className="absolute -inset-3 bg-gradient-to-br from-indigo-500/40 via-sky-500/30 to-emerald-400/30 blur-3xl opacity-70" />
                <div className="relative rounded-3xl border border-slate-700/80 bg-slate-950/90 p-4 lg:p-5 flex flex-col gap-3 lg:gap-4 shadow-xl shadow-slate-950/80">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-sm font-semibold">
                      AI
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">Sample query</p>
                      <p className="text-[11px] lg:text-xs text-slate-100">
                        “PM Kisan ka paisa abhi tak nahi aaya, kya karein?”
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 p-3 text-[11px] lg:text-xs text-slate-200 space-y-1">
                    <p className="font-medium text-slate-50">
                      JanMitran AI will answer:
                    </p>
                    <p>
                      ✅ Eligibility check instructions<br />
                      ✅ Official portal link<br />
                      ✅ Documents required<br />
                      ✅ Common reasons for delay
                    </p>
                  </div>
                  <p className="text-[10px] lg:text-[11px] text-slate-500">
                    Try typing your own question below in the chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID: CHAT + SIDEBAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
          {/* CHAT PANEL (center/left) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="h-full lg:h-[640px] rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-950/95 to-slate-950/99 shadow-[0_24px_80px_rgba(15,23,42,0.9)] flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 md:px-6 py-4 md:py-4.5 border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-2xl bg-indigo-500/40 blur-lg opacity-70" />
                    <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 flex items-center justify-center font-semibold text-sm shadow-lg">
                      AI
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-slate-50">
                      JanMitran AI Chat
                    </h3>
                    <p className="text-[11px] md:text-xs text-slate-400">
                      Ask any question about schemes, documents & applications
                    </p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Instant, private & secure</span>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 flex flex-col px-3 md:px-5 pb-3 pt-3 md:pt-4">
                {/* Helper chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    'Explain steps in simple words',
                    'Give official website links only',
                    'Tell the documents required',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700/70 px-3 py-1 text-[10px] md:text-[11px] text-slate-300 hover:border-indigo-500/70 hover:text-indigo-200 hover:bg-slate-900 transition"
                    >
                      <span className="text-[9px]">✨</span>
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-950/90 border border-slate-800 px-3 md:px-4 py-4 space-y-3 custom-scrollbar">
                  {messages.map((m) => {
                    const isUser = m.from === 'user';
                    return (
                      <div
                        key={m.id}
                        className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="mr-2 mt-0.5 hidden sm:flex">
                            <div className="h-7 w-7 rounded-2xl bg-slate-900 flex items-center justify-center text-[11px] text-indigo-300 border border-slate-700">
                              AI
                            </div>
                          </div>
                        )}

                        <div
                          className={`group max-w-[80%] md:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm transition transform ${
                            isUser
                              ? 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-br-sm hover:-translate-y-[1px] hover:shadow-indigo-500/40'
                              : 'bg-slate-900/90 border border-slate-700/70 text-slate-100 rounded-bl-sm hover:border-indigo-500/60 hover:bg-slate-900'
                          }`}
                        >
                          {m.text}
                        </div>

                        {isUser && (
                          <div className="ml-2 mt-0.5 hidden sm:flex">
                            <div className="h-7 w-7 rounded-2xl bg-sky-500/80 flex items-center justify-center text-[11px] text-slate-950 font-semibold">
                              You
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-400 mt-2">
                      <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:120ms]" />
                      <div className="h-2 w-2 rounded-full bg-slate-500 animate-bounce [animation-delay:240ms]" />
                      <span className="ml-1">JanMitran AI is typing…</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="mt-3 border-t border-slate-800 pt-3">
                  <div className="flex items-end gap-2 md:gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Describe your problem… e.g. "PM Kisan money not credited in my account, what to do?"'
                        className="w-full max-h-28 min-h-[46px] text-xs md:text-sm leading-relaxed border border-slate-700/80 rounded-2xl bg-slate-950/80 px-3.5 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 placeholder:text-slate-500 resize-none"
                      />
                      <div className="absolute right-3 bottom-2.5 flex items-center gap-1 text-[10px] text-slate-500">
                        <span className="hidden md:inline">Press</span>
                        <span className="px-1 rounded border border-slate-600 bg-slate-900/80 text-[9px]">
                          Enter
                        </span>
                        <span className="hidden md:inline">to send</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="shrink-0 h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 text-slate-950 flex items-center justify-center text-lg md:text-xl shadow-lg shadow-indigo-500/50 disabled:opacity-40 disabled:shadow-none hover:-translate-y-[1px] hover:shadow-xl hover:shadow-emerald-400/40 transition-transform transition-shadow"
                    >
                      ➤
                    </button>
                  </div>

                  <p className="mt-2 text-[10px] md:text-[11px] text-slate-500">
                    ⚠ JanMitran AI is for information support only. Always verify on official
                    government portals before submitting documents or payments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR: stats + how it works + quick actions */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 md:space-y-6">
            {/* Stats / trust card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-4 md:p-5 lg:p-6 shadow-xl shadow-slate-950/70 hover:border-indigo-500/70 hover:-translate-y-[2px] hover:shadow-indigo-500/30 transition">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-slate-50">
                    Why citizens use JanMitran
                  </h3>
                  <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                    Save time, avoid long YouTube videos & fake information.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-200">
                  ⭐<span>Community trusted</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700/70 px-2 py-3 hover:border-indigo-500/60 transition">
                  <p className="text-sm md:text-base font-semibold text-slate-50">
                    10K+
                  </p>
                  <p className="text-[10px] md:text-[11px] text-slate-400">
                    Citizens helped
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700/70 px-2 py-3 hover:border-indigo-500/60 transition">
                  <p className="text-sm md:text-base font-semibold text-slate-50">
                    100+
                  </p>
                  <p className="text-[10px] md:text-[11px] text-slate-400">
                    Schemes covered
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900/80 border border-slate-700/70 px-2 py-3 hover:border-indigo-500/60 transition">
                  <p className="text-sm md:text-base font-semibold text-slate-50">
                    12
                  </p>
                  <p className="text-[10px] md:text-[11px] text-slate-400">
                    Languages (soon)
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-4 md:p-5 lg:p-6 shadow-xl shadow-slate-950/70 hover:border-emerald-500/60 hover:-translate-y-[2px] hover:shadow-emerald-500/20 transition">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm md:text-base font-semibold text-slate-100">
                  How JanMitran AI helps you
                </h3>
                <span className="text-[10px] md:text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                  Free · No login needed
                </span>
              </div>

              <ol className="space-y-3 text-xs md:text-sm text-slate-300">
                <li className="flex gap-3 items-start">
                  <span className="h-5 w-5 mt-0.5 rounded-full bg-slate-800 flex items-center justify-center text-[11px] text-slate-200">
                    1
                  </span>
                  <span>Type your doubt in simple English or Hinglish.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="h-5 w-5 mt-0.5 rounded-full bg-slate-800 flex items-center justify-center text-[11px] text-slate-200">
                    2
                  </span>
                  <span>Get clear, step-by-step guidance with links & forms.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="h-5 w-5 mt-0.5 rounded-full bg-slate-800 flex items-center justify-center text-[11px] text-slate-200">
                    3
                  </span>
                  <span>Ask follow-up questions till your work is done ✅</span>
                </li>
              </ol>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-4 md:p-5 lg:p-6 shadow-xl shadow-slate-950/70">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm md:text-base font-semibold text-slate-100">
                  Popular questions
                </h3>
                <span className="text-[10px] md:text-[11px] text-slate-400">
                  Tap to auto-fill in chat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {[
                  ['Aadhaar Help', 'How to update Aadhaar address?', '🆔'],
                  ['PAN & Aadhaar', 'How to link PAN with Aadhaar?', '🧾'],
                  ['PM Kisan Yojana', 'What is PM Kisan scheme and how to apply?', '🌾'],
                  ['Student Scholarships', 'What scholarships are available?', '🎓'],
                  ['Ration Card Services', 'How to get ration card or update details?', '🛒'],
                ].map(([title, question, icon]) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => handleQuickAsk(question)}
                    className="group relative overflow-hidden text-left rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-indigo-500/70 transition flex items-start gap-3 px-3.5 py-3 md:py-3.5"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-emerald-500/10" />
                    <div className="relative h-8 w-8 rounded-2xl bg-slate-800/80 flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <div className="relative flex-1">
                      <p className="text-xs md:text-sm font-medium text-slate-50 group-hover:text-indigo-100">
                        {title}
                      </p>
                      <p className="text-[10px] md:text-[11px] text-slate-400 group-hover:text-slate-200 mt-0.5">
                        {question}
                      </p>
                    </div>
                    <span className="relative text-[11px] text-slate-500 group-hover:text-indigo-300 mt-0.5">
                      Ask →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
