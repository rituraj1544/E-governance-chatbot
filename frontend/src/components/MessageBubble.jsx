// src/components/MessageBubble.jsx
import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.from === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="mr-2 mt-0.5 hidden sm:flex">
          <div className="h-7 w-7 rounded-2xl bg-slate-900 flex items-center justify-center text-[11px] text-indigo-300 border border-slate-700">
            AI
          </div>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`group max-w-[80%] md:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm transition transform ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-sky-500 text-white rounded-br-sm hover:-translate-y-[1px] hover:shadow-indigo-500/40'
            : 'bg-slate-900/90 border border-slate-700/70 text-slate-100 rounded-bl-sm hover:border-indigo-500/60 hover:bg-slate-900'
        }`}
      >
        {message.text}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="ml-2 mt-0.5 hidden sm:flex">
          <div className="h-7 w-7 rounded-2xl bg-sky-500/80 flex items-center justify-center text-[11px] text-slate-950 font-semibold">
            You
          </div>
        </div>
      )}
    </div>
  );
}
