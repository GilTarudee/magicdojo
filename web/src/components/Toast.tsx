"use client";

import { useStore } from "@/lib/store";

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 26,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 80,
        background: "var(--ink)",
        color: "var(--bg)",
        padding: "12px 20px",
        borderRadius: 999,
        fontSize: 13.5,
        fontWeight: 500,
        boxShadow: "0 8px 30px rgba(0,0,0,.3)",
        animation: "mdToast .3s ease both",
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}
    >
      <span
        style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }}
      />
      {toast}
    </div>
  );
}
