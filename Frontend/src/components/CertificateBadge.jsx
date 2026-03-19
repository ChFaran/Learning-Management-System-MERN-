import React from "react";
import { motion } from "framer-motion";

export default function CertificateBadge({ rotate, scale, size = 176, autoRotate = false }) {
  const scaledInner = Math.max(12, Math.round(size * 0.09));
  const square = Math.max(24, Math.round(size * 0.36));

  return (
    <motion.div
      style={{ width: `${size}px`, height: `${size}px`, rotate, scale }}
      animate={autoRotate ? { rotate: 360 } : undefined}
      transition={autoRotate ? { duration: 18, repeat: Infinity, ease: "linear" } : undefined}
      className="relative rounded-full border border-[#ff5a2f] flex items-center justify-center"
      aria-label="certificate badge"
      role="img"
      title="Earn a certificate"
    >
      <div className="absolute inset-4 rounded-full border border-zinc-600/70" />

      <svg viewBox="0 0 180 180" className="absolute inset-0 w-full h-full">
        <defs>
          <path id="cert-ring" d="M 90,90 m -64,0 a 64,64 0 1,1 128,0 a 64,64 0 1,1 -128,0" />
        </defs>
        <text fill="#c5c5c5" fontSize="12" letterSpacing="4" fontFamily="JetBrains Mono, monospace">
          <textPath href="#cert-ring" startOffset="0%">EARN A CERTIFICATE • EARN A CERTIFICATE •</textPath>
        </text>
      </svg>

      <div
        className="relative border border-[#ff5a2f] rotate-12 grid place-items-center"
        style={{ width: `${square}px`, height: `${square}px` }}
      >
        <div
          className="border border-zinc-500 rounded-sm relative"
          style={{ width: `${Math.round(square * 0.56)}px`, height: `${Math.round(square * 0.38)}px` }}
        >
          <div className="absolute top-1 left-1 right-1 h-[1px] bg-[#ff5a2f]" />
          <div className="absolute top-3 left-1 right-1 h-[1px] bg-zinc-500" />
          <div className="absolute bottom-1 right-1 rounded-full bg-[#ff5a2f]" style={{ width: `${scaledInner}px`, height: `${scaledInner}px` }} />
        </div>
      </div>
    </motion.div>
  );
}
