import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STORAGE_KEY = "janmitran_chat_v2";

/* ------------------ HELPERS ------------------ */
function formatDay(ts) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function extractLinks(text) {
  return text.match(/https?:\/\/[^\s]+/g) || [];
}

/* ------------------ COMPONENT ------------------ */
export default function UserChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  /* ------------------ LOAD CHAT ------------------ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch {}
    }
    setMessages([]);
  }, []);

  /* ------------------ SAVE CHAT ------------------ */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ------------------ RESET CHAT ------------------ */
  function resetChat() {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
    setInput("");
  }

  /* ------------------ SEND MESSAGE ------------------ */
  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    if (language === "hi") {
      setMessages((p) => [
        ...p,
        {
          id: Date.now(),
          from: "bot",
          text: "🇮🇳 Hindi support is coming soon. Please use English for now.",
          ts: Date.now(),
        },
      ]);
      setInput("");
      return;
    }

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setMessages((p) => [
      ...p,
      { id: Date.now(), from: "user", text, ts: Date.now() },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          from: "bot",
          text: data?.reply || "Sorry, I could not find an answer.",
          ts: Date.now(),
        },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 2,
          from: "bot",
          text: "Server error. Please try again later.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ GROUP BY DAY ------------------ */
  const grouped = messages.reduce((acc, m) => {
    const day = formatDay(m.ts);
    acc[day] = acc[day] || [];
    acc[day].push(m);
    return acc;
  }, {});

  /* ------------------ UI ------------------ */
  return (
    <div className="h-screen bg-slate-950 text-slate-50 flex flex-col overflow-hidden">

      {/* HEADER */}
      <header className="shrink-0 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-lg flex items-center gap-2">
            JanMitran <span className="text-indigo-400">AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
              Govt Verified ✔
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            India’s digital dost for government services
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* LANGUAGE TOGGLE */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700 rounded-full px-3 py-1"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (Coming Soon)</option>
          </select>

          {/* RESET */}
          <button
            onClick={resetChat}
            className="text-xs px-3 py-1 rounded-full border border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
          >
            Reset
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="shrink-0 border-b border-slate-800 bg-slate-900/40 px-6 py-4">
        <h2 className="text-sm font-semibold text-indigo-300">
          What can JanMitran AI do?
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl mt-1">
          Get verified guidance on Aadhaar, PAN, PM-Kisan, scholarships, pensions,
          and other government services — explained simply.
        </p>
      </section>

      {/* CHAT */}
      <main className="flex-1 min-h-0 max-w-4xl w-full mx-auto px-3 py-3 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950 px-3 py-4 space-y-6">

          {/* ANIMATED WELCOME CARDS */}
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center gap-4 py-10"
              >
                <div className="text-indigo-400 text-sm font-semibold">
                  👋 Welcome to JanMitran AI
                </div>

                <p className="text-xs text-slate-400 max-w-md">
                  Select a topic below or ask your own question to get started.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full max-w-xl">
                  {[
                    "How to update Aadhaar address?",
                    "PM Kisan payment not received",
                    "How to link PAN with Aadhaar?",
                    "Which government schemes am I eligible for?",
                  ].map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => {
                        setInput(q);
                        setTimeout(handleSend, 50);
                      }}
                      className="text-left p-4 rounded-2xl border border-slate-700 bg-slate-900/40 hover:border-indigo-500 transition"
                    >
                      <div className="text-sm text-slate-100">{q}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MESSAGES */}
          {Object.entries(grouped).map(([day, msgs]) => (
            <div key={day}>
              <div className="text-center text-[11px] text-slate-400 mb-3">
                {day}
              </div>

              {msgs.map((m) => {
                const isUser = m.from === "user";
                const links = extractLinks(m.text);

                return (
                  <div
                    key={m.id}
                    className={`flex mb-2 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                        isUser
                          ? "bg-indigo-500 text-white rounded-br-sm"
                          : "bg-slate-900 border border-slate-700 rounded-bl-sm"
                      }`}
                    >
                      {!isUser && (
                        <div className="text-[10px] text-emerald-300 mb-1">
                          ✔ Govt Verified Response
                        </div>
                      )}

                      {m.text}

                      {!isUser && links.length > 0 && (
                        <div className="flex gap-3 mt-2 text-[11px]">
                          {links.map((l) => (
                            <React.Fragment key={l}>
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(l)
                                }
                                className="underline text-indigo-300"
                              >
                                Copy
                              </button>
                              <a
                                href={l}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-emerald-300"
                              >
                                Open
                              </a>
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {loading && (
            <div className="text-xs text-slate-400">
              JanMitran AI is typing<span className="animate-pulse">|</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="mt-3 flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your question…"
            className="flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-10 w-10 rounded-2xl bg-indigo-500 text-white disabled:opacity-40"
          >
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}
