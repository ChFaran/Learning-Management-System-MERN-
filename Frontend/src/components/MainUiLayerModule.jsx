import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import { api } from "../context/api";

const fallback = {
  title: "Build and Deploy Your Own LLM-powered App",
  subtitle:
    "Sign up for the program and get starter credits to use AI inference in Nebius Token Factory.",
  bulletOne: "Solve guided tasks",
  bulletTwo: "Build with AI tools",
  bulletThree: "Ship portfolio project",
  ctaText: "Enroll for free",
  ctaRoute: "/course",
};

export default function MainUiLayerModule() {
  const navigate = useNavigate();
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      try {
        const res = await api.get("/modules/main-layer");
        if (res.data?.isActive !== false) {
          setData({ ...fallback, ...res.data });
        }
      } catch {
        setData(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, []);

  return (
    <section className="relative mb-10 border border-zinc-800/90 rounded-sm overflow-hidden min-h-[620px] shadow-[0_0_40px_rgba(253,92,54,0.18)]">
      <div className="absolute inset-0">
        <AnimatedBackground sceneOpacity={0.98} overlayOpacity={0.38} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_50%,rgba(253,92,54,0.09),transparent_38%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/28 to-black/40" />

      <div className="relative z-10 min-h-[620px] p-8 md:p-12 lg:p-16">
        <div className="max-w-[900px]">
          <p className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tight text-zinc-700">JOIN</p>
          <p className="text-5xl md:text-6xl font-black leading-[0.9] tracking-tight text-zinc-500">JOIN THE FUTURE</p>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tight text-zinc-100">JOIN THE FUTURE</h2>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tight text-white">THE FUTURE TODAY</h2>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.88] tracking-tight text-zinc-100 md:ml-[320px] lg:ml-[420px]">TODAY</h2>
        </div>

        <div className="mt-10 max-w-[360px]">
          <p className="text-zinc-100 text-[46px] md:text-[50px] font-black leading-[0.92]">THE FUTURE TODAY</p>
          <p className="mt-4 text-zinc-100 text-[20px] md:text-[22px] font-black leading-[1.02]">
            Sign up for the program and get free credits to use on AI inference in Nebius Token Factory.
          </p>
          <div className="mt-6 bg-zinc-900/84 border border-zinc-700 text-zinc-300 text-sm font-mono px-4 py-3 rounded">
            You will receive free credits (in the form of tokens) to use on Nebius Token Factory
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:absolute md:right-14 md:top-[58%] lg:right-20">
          <button
            onClick={() => navigate(data.ctaRoute || "/course")}
            className="bg-[#fd5c36] hover:bg-[#ff6f4c] text-white px-12 md:px-16 py-3 rounded text-base md:text-xl font-bold shadow-[0_0_30px_rgba(253,92,54,0.45)] transition-all"
            disabled={loading}
          >
            {loading ? "Loading..." : data.ctaText || "Enroll for free"}
          </button>
        </div>
      </div>
    </section>
  );
}
