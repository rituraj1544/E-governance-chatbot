import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const lampRef = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lampOn, setLampOn] = useState(false);
  const [lampGlow, setLampGlow] = useState("hsl(320,40%,45%)");
  const [lampGlowDark, setLampGlowDark] = useState("hsl(320,40%,35%)");

  /* 🔥 LISTEN FROM LAMP */
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "LAMP_ON") {
        setLampOn(true);
        setLampGlow(event.data.glowColor);
        setLampGlowDark(event.data.glowColorDark);
      }
      if (event.data?.type === "LAMP_OFF") {
        setLampOn(false);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  /* 👀 MOUSE → LAMP EYES */
  useEffect(() => {
    const move = (e) => {
      lampRef.current?.contentWindow?.postMessage(
        {
          type: "LAMP_EYES",
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        "*"
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      // ✅ KEEP YOUR ORIGINAL BACKEND LOGIC
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));

      // ✅ SUCCESS → GREEN + FADE
      lampRef.current?.contentWindow?.postMessage(
        { type: "LAMP_SUCCESS" },
        "*"
      );

      // ⏳ Let animation finish, then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Check credentials."
      );

      // ❌ ERROR → SHAKE + RED
      lampRef.current?.contentWindow?.postMessage(
        { type: "LAMP_ERROR" },
        "*"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121921] flex items-center justify-center gap-20 px-6">
      {/* 🔥 LAMP */}
      <iframe
        ref={lampRef}
        src="/lamp.html"
        title="Cute Lamp"
        scrolling="no"
        className="w-[380px] h-[550px] border-none overflow-hidden"
      />

      {/* 🔐 LOGIN */}
      <div
        className={`transition-all duration-500
          ${lampOn ? "opacity-100 scale-100" : "opacity-0 scale-90"}
          bg-[#121921]/90 border border-white/10 rounded-2xl p-10 w-[360px]
        `}
        style={{ boxShadow: `0 0 35px ${lampGlow}` }}
      >
        <h2 className="text-2xl text-center text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white
                       transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${lampGlow}, ${lampGlowDark})`,
              boxShadow: `0 0 18px ${lampGlow}`,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
