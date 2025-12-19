import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
} from "lucide-react";

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tags, setTags] = useState("");
  const [department, setDepartment] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editDepartment, setEditDepartment] = useState("");

  const answerRef = useRef(null);

  const fetchFaqs = async () => {
    try {
      const res = await api.get("/faqs");
      setFaqs(res.data.results || []);
    } catch {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Auto expand textarea
  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.style.height = "auto";
      answerRef.current.style.height =
        answerRef.current.scrollHeight + "px";
    }
  }, [answer]);

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      await api.post("/faqs", {
        question,
        answer,
        keywords: keywords.split(",").map((k) => k.trim()),
        tags: tags.split(",").map((t) => t.trim()),
        department,
      });

      setQuestion("");
      setAnswer("");
      setKeywords("");
      setTags("");
      setDepartment("");
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.error || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (f) => {
    setEditingId(f._id);
    setEditQuestion(f.question);
    setEditDepartment(f.department || "");
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    try {
      await api.put(`/faqs/${id}`, {
        question: editQuestion,
        department: editDepartment,
      });
      setEditingId(null);
      fetchFaqs();
    } catch {
      setError("Update failed");
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await api.delete(`/faqs/${id}`);
    fetchFaqs();
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-950/70 backdrop-blur px-6 py-5">
        <h2 className="text-2xl font-semibold text-slate-100">
          FAQs Management
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Control how E-Governance Chatbot answers citizen questions
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      {/* CREATE FAQ */}
      <form
        onSubmit={handleCreate}
        className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300">
            CREATE
          </span>
          <h3 className="text-slate-100 font-semibold">
            Add New FAQ
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <label className="text-xs text-slate-400">
            Content <span className="text-red-400">*</span>
          </label>

          <input
            className="input"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <textarea
            ref={answerRef}
            className="input resize-none overflow-hidden"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        {/* AI Signals */}
        <div className="space-y-3">
          <label className="text-xs text-slate-400">
            AI Signals
          </label>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input"
              placeholder="Keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <input
              className="input"
              placeholder="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400">
            Category
          </label>
          <input
            className="input"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        {/* Sticky Action */}
        <div className="sticky bottom-0 bg-slate-950 pt-4">
          <button
            disabled={creating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition active:scale-[0.98] py-2.5 text-sm font-medium text-white shadow-lg"
          >
            <Plus size={16} />
            {creating ? "Creating…" : "Create FAQ"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-300 px-4 py-2 text-sm">
            {error}
          </div>
        )}
      </form>

      {/* FAQ LIST */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
          <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300">
            MANAGE
          </span>
          <h3 className="text-slate-100 font-semibold">
            FAQ List
          </h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <p>No FAQs yet</p>
            <p className="text-xs mt-1">
              Create your first FAQ above
            </p>
          </div>
        ) : (
          <table className="w-full">
            <tbody>
              {faqs.map((f) => {
                const isEditing = editingId === f._id;
                return (
                  <tr
                    key={f._id}
                    className={`border-t border-slate-800 transition
                      ${isEditing
                        ? "bg-indigo-500/5 ring-1 ring-indigo-500/40"
                        : editingId
                        ? "opacity-40"
                        : "hover:bg-slate-900"}
                    `}
                  >
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          className="input"
                          value={editQuestion}
                          onChange={(e) =>
                            setEditQuestion(e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-slate-200">
                          {f.question}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(f._id)}
                            className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(f)}
                            className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => deleteFaq(f._id)}
                            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
