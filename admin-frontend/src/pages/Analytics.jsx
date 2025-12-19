import { useEffect, useState } from "react";
import api from "../services/api";
import {
  MessageSquare,
  Brain,
  Radio,
} from "lucide-react";

// Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, intentsRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/intents"),
        ]);
        setOverview(overviewRes.data);
        setIntents(intentsRes.data.results || []);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading)
    return (
      <p className="text-sm text-slate-400">
        Loading analytics data…
      </p>
    );

  if (error)
    return (
      <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-2">
        {error}
      </p>
    );

  /* ---------------- PIE ---------------- */
  const sourceLabels = overview.bySource.map((s) => s._id || "Unknown");
  const sourceCounts = overview.bySource.map((s) => s.count);

  const pieData = {
    labels: sourceLabels,
    datasets: [
      {
        data: sourceCounts,
        backgroundColor: [
          "#6366f1",
          "#38bdf8",
          "#34d399",
          "#facc15",
          "#fb7185",
          "#a78bfa",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  /* ---------------- BAR ---------------- */
  const barData = {
    labels: intents.map((i) => i._id || "Unknown"),
    datasets: [
      {
        data: intents.map((i) => i.count),
        backgroundColor: "#6366f1",
        borderRadius: 10,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <div className="relative space-y-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950" />

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">
          Analytics
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Real-time insights into chatbot behavior
        </p>

        {/* Divider */}
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Context Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="badge badge-emerald">Live Data</span>
          <span className="badge badge-indigo">Last 24h</span>
          <span className="badge border-slate-600 text-slate-300">
            Auto-refresh
          </span>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            label: "Total Chats",
            value: overview.totalChats,
            icon: MessageSquare,
            accent: "bg-indigo-500",
            desc: "All conversations processed",
          },
          {
            label: "Unique Intents",
            value: intents.length,
            icon: Brain,
            accent: "bg-sky-500",
            desc: "Detected intent types",
          },
          {
            label: "Top Source",
            value: overview.bySource[0]?._id || "Unknown",
            icon: Radio,
            accent: "bg-emerald-500",
            desc: "Highest traffic origin",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="card relative overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className={`absolute left-0 top-0 h-full w-1 ${c.accent}`} />

            <c.icon className="h-5 w-5 text-slate-400" />

            <p className="mt-4 text-3xl font-semibold text-slate-100">
              {c.value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {c.label}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              {c.desc}
            </p>
          </div>
        ))}
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        {/* PIE */}
        <div className="card">
          <h3 className="mb-1">
            Chats by Source
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Distribution
          </p>

          {sourceCounts.length < 2 ? (
            <p className="text-sm text-slate-500 text-center py-16">
              Limited data available
            </p>
          ) : (
            <div className="relative max-w-xs mx-auto">
              <Pie
                data={pieData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 16,
                        usePointStyle: true,
                      },
                    },
                    tooltip: {
                      backgroundColor: "#020617",
                      cornerRadius: 12,
                      padding: 12,
                    },
                  },
                }}
              />

              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    Total Sources
                  </p>
                  <p className="text-lg font-semibold">
                    {sourceCounts.reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BAR */}
        <div className="card">
          <h3 className="mb-1">
            Top User Intents
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Frequency
          </p>

          {intents.length < 2 ? (
            <p className="text-sm text-slate-500 text-center py-16">
              Limited data available
            </p>
          ) : (
            <Bar
              data={barData}
              options={{
                scales: {
                  x: {
                    ticks: {
                      maxRotation: 30,
                      color: "#94a3b8",
                    },
                    grid: { display: false },
                  },
                  y: {
                    grid: {
                      color: "rgba(148,163,184,0.08)",
                    },
                    ticks: { color: "#94a3b8" },
                  },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#020617",
                    cornerRadius: 12,
                    padding: 12,
                  },
                },
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
