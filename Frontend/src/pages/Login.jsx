import React, { useMemo, useState } from "react";
import { FaFacebookF, FaGoogle, FaXTwitter } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, oauthContinue } = useAuth();
  const initialMode = useMemo(() => (location.pathname === "/register" ? "register" : "login"), [location.pathname]);

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(name, email, password, "Registered");
      } else {
        await login(email, password);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAuth = async (provider) => {
    setError("");
    setLoading(true);

    try {
      await oauthContinue(provider, name || "Learner");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex justify-center items-start md:items-center px-4 py-6 md:py-10 relative overflow-y-auto">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_20%,rgba(253,92,54,0.15),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(255,255,255,0.08),transparent_20%)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md my-3 md:my-8 border border-zinc-800 bg-zinc-950/85 backdrop-blur-lg rounded-2xl p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-6">
          <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Back to homepage</Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight">{mode === "register" ? "Create your account" : "Welcome back"}</h1>
          <p className="text-zinc-400 text-sm mt-2">{mode === "register" ? "Join as a registered learner in seconds." : "Sign in to continue your learning path."}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-lg mb-5">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 text-sm rounded-md transition-colors ${mode === "login" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-2 text-sm rounded-md transition-colors ${mode === "register" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
          >
            Create account
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => handleProviderAuth("google")}
            disabled={loading}
            className="w-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleProviderAuth("x")}
            disabled={loading}
            className="w-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FaXTwitter /> Continue with X
          </button>
          <button
            type="button"
            onClick={() => handleProviderAuth("facebook")}
            disabled={loading}
            className="w-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FaFacebookF /> Continue with Facebook
          </button>
        </div>

        <div className="flex items-center my-4 gap-3">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-xs text-zinc-500">or continue with email</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        <form onSubmit={submitAuth} className="space-y-3">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#fd5c36]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#fd5c36]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#fd5c36]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#fd5c36]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fd5c36] hover:bg-[#ff6f4c] rounded-lg py-2.5 text-sm font-bold tracking-wide transition-colors disabled:opacity-70"
          >
            {loading ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-5 text-center">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}