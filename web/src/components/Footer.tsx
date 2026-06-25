"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";

export default function Footer() {
  const { L } = useStore();
  return (
    <footer
      style={{
        borderTop: "var(--bw) solid var(--line)",
        background: "var(--panel)",
        marginTop: 32,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "30px 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 40,
              borderRadius: "var(--radius)",
              background: "#f4efe6",
              border: "var(--bw) solid var(--line)",
              overflow: "hidden",
            }}
          >
            <Image
              src="/magicdojo-logo.png"
              alt="Magic Dojo"
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
            />
          </span>
          <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--ink)" }}>Magic Dojo</strong>
            <br />
            {L.footAddr}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>
          {L.footHours}
          <br />
          {L.footHours2}
          <br />
          {L.footPay}
        </div>
      </div>
    </footer>
  );
}
