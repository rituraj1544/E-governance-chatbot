// src/pages/Schemes.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form
  const [schemeName, setSchemeName] = useState("");
  const [category, setCategory] = useState("");
  const [stateName, setStateName] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editSchemeName, setEditSchemeName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editState, setEditState] = useState("");

  const fetchSchemes = async () => {
    try {
      const res = await api.get("/schemes");
      setSchemes(res.data.results || []);
    } catch {
      setError("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      await api.post("/schemes", {
        schemeName,
        category,
        state: stateName,
      });

      setSchemeName("");
      setCategory("");
      setStateName("");
      fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.error || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  // EDIT
  const startEdit = (s) => {
    setEditingId(s._id);
    setEditSchemeName(s.schemeName);
    setEditCategory(s.category || "");
    setEditState(s.state || "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    try {
      await api.put(`/schemes/${id}`, {
        schemeName: editSchemeName,
        category: editCategory,
        state: editState,
      });
      setEditingId(null);
      fetchSchemes();
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  // DELETE
  const deleteScheme = async (id) => {
    if (!window.confirm("Delete this scheme?")) return;

    try {
      await api.delete(`/schemes/${id}`);
      fetchSchemes();
    } catch {
      setError("Delete failed");
    }
  };

  if (loading)
    return <p className="text-sm text-slate-400">Loading schemes…</p>;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-100">
          Government Schemes
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage schemes used by JanMitran AI to answer citizens
        </p>
      </div>

      {/* CREATE SCHEME */}
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-slate-800/80 bg-slate-950/85 p-5 md:p-6 shadow-xl shadow-slate-950/70 space-y-4"
      >
        <h3 className="text-base font-semibold text-slate-100">
          Add New Scheme
        </h3>

        <input
          placeholder="Scheme Name *"
          value={schemeName}
          onChange={(e) => setSchemeName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            placeholder="State / Central"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 disabled:opacity-50"
        >
          {creating ? "Creating…" : "Create Scheme"}
        </button>

        {error && (
          <p className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-2">
            {error}
          </p>
        )}
      </form>

      {/* SCHEME LIST */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/85 shadow-xl shadow-slate-950/70 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs text-slate-400">
                Scheme Name
              </th>
              <th className="px-4 py-3 text-left text-xs text-slate-400">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs text-slate-400">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((s) => (
              <tr
                key={s._id}
                className="border-t border-slate-800 hover:bg-slate-900/60"
              >
                <td className="px-4 py-3">
                  {editingId === s._id ? (
                    <input
                      value={editSchemeName}
                      onChange={(e) => setEditSchemeName(e.target.value)}
                    />
                  ) : (
                    s.schemeName
                  )}
                </td>

                <td className="px-4 py-3">
                  {editingId === s._id ? (
                    <input
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    />
                  ) : (
                    s.category || "-"
                  )}
                </td>

                <td className="px-4 py-3">
                  {editingId === s._id ? (
                    <input
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                    />
                  ) : (
                    s.state || "Central"
                  )}
                </td>

                <td className="px-4 py-3 space-x-2">
                  {editingId === s._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(s._id)}
                        className="text-xs text-emerald-300 hover:text-emerald-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(s)}
                        className="text-xs text-indigo-300 hover:text-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteScheme(s._id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
