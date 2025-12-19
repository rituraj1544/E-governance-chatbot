// src/components/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `block rounded-xl px-4 py-2.5 text-sm transition ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100"
    }`;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 border-r border-slate-800/70 bg-slate-950/90 backdrop-blur-xl px-4 py-6 flex flex-col">
        {/* BRAND */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 opacity-60 blur-md" />
            <div className="relative h-10 w-10 rounded-2xl bg-slate-950 flex items-center justify-center font-bold shadow-lg">
              JM
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold">
              JanMitran <span className="text-indigo-400">Admin</span>
            </h2>
            <p className="text-[11px] text-slate-400">Control Center</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-1">
          <NavLink to="/dashboard" className={navItemClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/schemes" className={navItemClass}>
            📚 Schemes
          </NavLink>

          <NavLink to="/faqs" className={navItemClass}>
            ❓ FAQs
          </NavLink>

          <NavLink to="/analytics" className={navItemClass}>
            📈 Analytics
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-6 md:px-8 md:py-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
