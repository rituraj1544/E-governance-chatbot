// src/components/ChatWindow.jsx
import React from 'react';

export default function ChatWindow({
  messages,
  loading,
  input,
  onInputChange,
  onKeyDown,
  onSend,
  messagesEndRef,
}) {
  return (
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
                  onChange={onInputChange}
                  onKeyDown={onKeyDown}
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
                onClick={onSend}
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
  );
}
