"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export default function Header() {
  const { L, lang, setLang, cartCount } = useStore();
  const pathname = usePathname();
  const [me, setMe] = useState<{ name: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => { if (active) setMe(d.user); })
      .catch(() => {});
    return () => { active = false; };
  }, [pathname]);

  const navItems = [
    { href: "/shop", label: "Magic: The Gathering", match: ["/shop", "/product"] },
    ...(me?.isAdmin ? [{ href: "/admin", label: L.adminTitle, match: ["/admin"] }] : []),
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "color-mix(in srgb, var(--panel) 88%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "var(--bw) solid var(--line)",
      }}
    >
      <div className="md-header-inner">
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 11, flex: "none" }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 46,
              width: 46,
              borderRadius: "var(--radius)",
              background: "#f4efe6",
              border: "var(--bw) solid var(--line)",
              overflow: "hidden",
            }}
          >
            <Image
              src="/magicdojo-logo.png"
              alt="Magic Dojo"
              width={42}
              height={42}
              style={{ objectFit: "contain" }}
            />
          </span>
          <span className="md-head" style={{ fontSize: 19, whiteSpace: "nowrap" }}>
            MAGIC DOJO
          </span>
        </Link>

        <nav className="md-header-nav" style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
          {navItems.map((n) => {
            const active = n.match.some((m) => pathname.startsWith(m));
            return (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  padding: "8px 13px",
                  borderRadius: "var(--btnr)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  letterSpacing: ".01em",
                  color: active ? "var(--accentInk)" : "var(--ink)",
                  background: active ? "var(--accent)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="md-header-spacer" style={{ flex: 1 }} />

        {/* language toggle */}
        <div
          style={{
            display: "flex",
            border: "var(--bw) solid var(--line)",
            borderRadius: 999,
            overflow: "hidden",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {(["th", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                cursor: "pointer",
                border: "none",
                padding: "7px 11px",
                background: lang === l ? "var(--accent)" : "transparent",
                color: lang === l ? "var(--accentInk)" : "var(--ink)",
                textTransform: "uppercase",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* account */}
        <Link
          href={me ? "/account" : "/login"}
          style={{
            border: "var(--bw) solid var(--line)",
            background: "var(--panel)",
            borderRadius: "var(--btnr)",
            height: 38,
            padding: "0 13px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontWeight: 600,
            fontSize: 13,
            color: "var(--ink)",
            maxWidth: 150,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {me ? me.name : L.login}
          </span>
        </Link>

        {/* cart */}
        <Link
          href="/cart"
          style={{
            position: "relative",
            border: "var(--bw) solid var(--line)",
            background: "var(--panel)",
            borderRadius: "var(--btnr)",
            height: 38,
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
            fontSize: 13,
            color: "var(--ink)",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span>{L.cart}</span>
          {cartCount > 0 && (
            <span
              className="md-num"
              style={{
                background: "var(--accent)",
                color: "var(--accentInk)",
                fontSize: 11,
                fontWeight: 600,
                minWidth: 19,
                height: 19,
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
