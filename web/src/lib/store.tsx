"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { TR, type Lang, type Dict } from "@/lib/i18n";

export type Finish = "nonfoil" | "foil";

export type CartLine = {
  productId: number;
  finish: Finish;
  name: string;
  setCode: string;
  setName: string;
  colors: string[];
  unitPriceThb: number;
  imageUrl?: string | null;
  maxStock: number;
  qty: number;
};

type Theme = "dojo" | "arena";

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  L: Dict;
  theme: Theme;
  setTheme: (t: Theme) => void;
  cart: CartLine[];
  cartCount: number;
  addToCart: (line: Omit<CartLine, "qty">, qty?: number) => void;
  changeQty: (productId: number, finish: Finish, delta: number) => void;
  removeLine: (productId: number, finish: Finish) => void;
  clearCart: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
};

const StoreContext = createContext<Store | null>(null);

const CART_KEY = "md_cart";
const LANG_KEY = "md_lang";
const THEME_KEY = "md_theme";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");
  const [theme, setThemeState] = useState<Theme>("dojo");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // load persisted state once
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      const l = localStorage.getItem(LANG_KEY) as Lang | null;
      if (l === "th" || l === "en") setLangState(l);
      const t = localStorage.getItem(THEME_KEY) as Theme | null;
      if (t === "dojo" || t === "arena") setThemeState(t);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist + reflect theme on <html>
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (hydrated) localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LANG_KEY, lang);
  }, [lang, hydrated]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      1900,
    );
  }, []);

  const addToCart = useCallback<Store["addToCart"]>(
    (line, qty = 1) => {
      setCart((prev) => {
        const i = prev.findIndex(
          (l) => l.productId === line.productId && l.finish === line.finish,
        );
        if (i >= 0) {
          const next = [...prev];
          const want = next[i].qty + qty;
          next[i] = { ...next[i], qty: Math.min(want, line.maxStock) };
          return next;
        }
        return [...prev, { ...line, qty: Math.min(qty, line.maxStock) }];
      });
      setToast(TR[lang].addedToast);
      window.clearTimeout((showToast as unknown as { _t?: number })._t);
      (showToast as unknown as { _t?: number })._t = window.setTimeout(
        () => setToast(null),
        1900,
      );
    },
    [lang, showToast],
  );

  const changeQty = useCallback<Store["changeQty"]>(
    (productId, finish, delta) => {
      setCart((prev) =>
        prev
          .map((l) =>
            l.productId === productId && l.finish === finish
              ? { ...l, qty: Math.min(Math.max(1, l.qty + delta), l.maxStock) }
              : l,
          )
          .filter((l) => l.qty > 0),
      );
    },
    [],
  );

  const removeLine = useCallback<Store["removeLine"]>((productId, finish) => {
    setCart((prev) =>
      prev.filter((l) => !(l.productId === productId && l.finish === finish)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((a, l) => a + l.qty, 0);

  const value: Store = {
    lang,
    setLang: setLangState,
    L: TR[lang],
    theme,
    setTheme: setThemeState,
    cart,
    cartCount,
    addToCart,
    changeQty,
    removeLine,
    clearCart,
    toast,
    showToast,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
