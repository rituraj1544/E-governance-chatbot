import { useEffect, useState } from "react";
import api from "../services/api";

/* ---------------- COUNT-UP HOOK ---------------- */
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof target !== "number") return;

    let start = 0;
    const end = target;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

/* ---------------- DASHBOARD ---------------- */
export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    totalChats: null,
    faqs: null,
    schemes: null,
    avgResponse: null,
  });

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => {
      setStatsData(res.data);
    });
  }, []);

  /* Animated values */
  const animatedTotalChats = useCountUp(statsData.totalChats);
  const animatedFaqs = useCountUp(statsData.faqs);
  const animatedSchemes = useCountUp(statsData.schemes);

  const stats = [
    {
      label: "Total Chats",
      value:
        statsData.totalChats == null ? "—" : animatedTotalChats,
      note: "All time conversations",
      accent: "from-indigo-500 to-sky-500",
      icon: "💬",
    },
    {
      label: "FAQs",
      value:
        statsData.faqs == null ? "—" : animatedFaqs,
      note: "Active answers",
      accent: "from-emerald-500 to-teal-500",
      icon: "📘",
    },
    {
      label: "Schemes",
      value:
        statsData.schemes == null ? "—" : animatedSchemes,
      note: "Government schemes",
      accent: "from-amber-500 to-orange-500",
      icon: "🏛️",
    },
    {
      label: "Avg Response",
      value: statsData.avgResponse ?? "—",
      note: "System latency",
      accent: "from-pink-500 to-rose-500",
      icon: "⚡",
    },
  ];

  return (
    <div className="relative space-y-10 max-w-7xl mx-auto">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950" />

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">
            Admin Dashboard
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative overview
          </p>

          <div className="mt-3 h-px w-48 bg-gradient-to-r from-indigo-500/60 to-transparent" />
        </div>

        {/* System Status */}
        <span className="hidden md:inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 backdrop-blur px-4 py-1.5 text-xs text-emerald-300 shadow-lg">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          </span>
          System Online
        </span>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((card, i) => (
          <div
            key={card.label}
            style={{ animationDelay: `${i * 80}ms` }}
            className="relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/85 p-5 shadow-xl shadow-slate-950/70 transition
                       hover:-translate-y-1 hover:shadow-indigo-500/40 animate-[fadeInUp_0.5s_ease-out_both]"
          >
            {/* Glow */}
            <div
              className={`absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${card.accent} opacity-25 blur-3xl`}
            />

            <div className="flex items-center gap-3">
              <span className="text-lg opacity-80">
                {card.icon}
              </span>
              <p className="text-xs text-slate-400">
                {card.label}
              </p>
            </div>

            {/* Value */}
            {card.value === "—" ? (
              <div className="mt-3 h-7 w-20 rounded-md bg-slate-800 animate-pulse" />
            ) : (
              <p className="mt-2 text-3xl font-semibold text-slate-100">
                {card.value}
              </p>
            )}

            <p className="mt-1 text-[11px] text-slate-500">
              {card.note}
            </p>
          </div>
        ))}
      </section>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* PANELS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-6 shadow-xl shadow-slate-950/70">
          <h3 className="relative pl-3 text-base font-semibold text-slate-100 mb-4">
            <span className="absolute left-0 top-1 h-4 w-1 rounded bg-indigo-500" />
            What you can manage here
          </h3>

          <ul className="space-y-4 text-sm text-slate-300">
            {[
              "Add and update government schemes",
              "Manage FAQs used by the chatbot",
              "Analyze citizen questions and intents",
              "Improve response quality over time",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="badge badge-emerald text-[11px]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl shadow-slate-950/70">
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-indigo-500/10" />

          <h3 className="text-base font-semibold text-slate-100 mb-3">
            Admin Tips
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            Keep FAQs{" "}
            <span className="text-indigo-300">
              concise and keyword-rich
            </span>{" "}
            to improve intent matching. Regularly review{" "}
            <span className="text-indigo-300">
              analytics
            </span>{" "}
            to identify emerging citizen needs.
          </p>

          <div className="absolute bottom-4 right-4 text-xs rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-indigo-300">
            💡 Smart admin → Better experience
          </div>
        </div>
      </section>
    </div>
  );
}
