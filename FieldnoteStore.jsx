"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Search, Check, ChevronRight, Feather } from "lucide-react";

// ---- Simulated "API" layer ----
// In a real Next.js app this would be a fetch("/api/products") call.
// Kept here as a promise-based function so the fetching/loading pattern
// is identical to how it'd look against a live endpoint.
const CATALOG = [
  { id: "fn-01", name: "Field Ruled Notebook", category: "Notebooks", price: 18, stock: 24, tone: "#3B4A3F", blurb: "192 pages, stitch-bound, weatherproof cover." },
  { id: "fn-02", name: "Dot Grid Journal", category: "Notebooks", price: 22, stock: 12, tone: "#5B4636", blurb: "Cream 100gsm paper, ribbon marker." },
  { id: "fn-03", name: "Brass Refillable Pencil", category: "Writing", price: 34, stock: 8, tone: "#8A7245", blurb: "Machined brass, takes standard leads." },
  { id: "fn-04", name: "Fountain Pen, Slate", category: "Writing", price: 46, stock: 15, tone: "#39434C", blurb: "Fine nib, converter included." },
  { id: "fn-05", name: "Waxed Canvas Folio", category: "Carry", price: 58, stock: 6, tone: "#4A3B2C", blurb: "Holds an A5 notebook and loose pages." },
  { id: "fn-06", name: "Ink, Bottled Umber", category: "Writing", price: 16, stock: 30, tone: "#6B3F2A", blurb: "50ml, quick-drying, fountain-pen safe." },
  { id: "fn-07", name: "Pocket Memo Set", category: "Notebooks", price: 12, stock: 40, tone: "#4A5A4E", blurb: "Three 64-page memo books, blank." },
  { id: "fn-08", name: "Graphite Set, No. 2", category: "Writing", price: 14, stock: 22, tone: "#2E2A26", blurb: "Twelve hex pencils, pre-sharpened." },
];

function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(CATALOG), 550);
  });
}

// ---- UI ----
export default function FieldnoteStore() {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); // { id: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const categories = useMemo(() => {
    if (!products) return ["All"];
    return ["All", ...new Set(products.map((p) => p.category))];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  const cartItems = useMemo(() => {
    if (!products) return [];
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ ...products.find((p) => p.id === id), qty }));
  }, [cart, products]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const next = Math.max(0, (c[id] || 0) + delta);
      return { ...c, [id]: next };
    });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.address.trim()) e.address = "Enter a shipping address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCheckout(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setCheckedOut(true);
    setCart({});
  }

  return (
    <div style={{ background: "#EDEAE2", minHeight: "100vh", color: "#221F1A", fontFamily: "'Georgia', serif" }}>
      <style>{`
        .fn-sans { font-family: -apple-system, Inter, Helvetica, Arial, sans-serif; }
        .fn-btn { transition: transform 0.15s ease, background 0.15s ease; }
        .fn-btn:active { transform: scale(0.97); }
        .fn-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fn-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(34,31,26,0.12); }
        .fn-focus:focus-visible { outline: 2px solid #2A4B7C; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .fn-btn, .fn-card { transition: none; }
        }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #D8D2C4", position: "sticky", top: 0, background: "#EDEAE2", zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Feather size={22} color="#2A4B7C" />
            <span style={{ fontSize: 22, letterSpacing: 1 }}>Fieldnote</span>
          </div>

          <div className="fn-sans" style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #D8D2C4", borderRadius: 8, padding: "8px 12px", flex: "1 1 220px", maxWidth: 360 }}>
            <Search size={16} color="#8A8474" />
            <input
              className="fn-focus"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 14 }}
              aria-label="Search products"
            />
          </div>

          <button
            className="fn-btn fn-sans fn-focus"
            onClick={() => setCartOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#221F1A", color: "#EDEAE2", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontSize: 14 }}
          >
            <ShoppingBag size={16} />
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px 24px" }}>
        <p className="fn-sans" style={{ color: "#D9A441", letterSpacing: 2, fontSize: 12, textTransform: "uppercase", marginBottom: 10 }}>
          Paper, ink, and things worth keeping
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.15, maxWidth: 620, margin: 0 }}>
          Tools for people who still write things down.
        </h1>
      </section>

      {/* Category filter */}
      <div className="fn-sans" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 20px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {categories.map((c) => (
          <button
            key={c}
            className="fn-btn fn-focus"
            onClick={() => setCategory(c)}
            style={{
              border: "1px solid " + (category === c ? "#221F1A" : "#D8D2C4"),
              background: category === c ? "#221F1A" : "transparent",
              color: category === c ? "#EDEAE2" : "#221F1A",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 20px 60px" }}>
        {!products && (
          <div className="fn-sans" style={{ padding: "60px 0", textAlign: "center", color: "#8A8474" }}>
            Loading products…
          </div>
        )}

        {products && filtered.length === 0 && (
          <div className="fn-sans" style={{ padding: "60px 0", textAlign: "center", color: "#8A8474" }}>
            No products match "{query}".
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
          {filtered.map((p) => (
            <div key={p.id} className="fn-card" style={{ background: "#fff", border: "1px solid #E3DECF", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 130, background: p.tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Feather size={28} color="rgba(255,255,255,0.7)" />
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <span className="fn-sans" style={{ fontSize: 11, color: "#8A8474", textTransform: "uppercase", letterSpacing: 1 }}>{p.category}</span>
                <h3 style={{ fontSize: 17, margin: 0 }}>{p.name}</h3>
                <p className="fn-sans" style={{ fontSize: 13, color: "#5C574B", margin: 0, flex: 1 }}>{p.blurb}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <span className="fn-sans" style={{ fontSize: 16, fontWeight: 600 }}>${p.price}</span>
                  <button
                    className="fn-btn fn-sans fn-focus"
                    onClick={() => addToCart(p.id)}
                    style={{ background: "#2A4B7C", color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 13, cursor: "pointer" }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 20 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(34,31,26,0.4)" }} />
          <div className="fn-sans" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(400px, 100%)", background: "#EDEAE2", padding: 20, overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, margin: 0 }}>Your cart</h2>
              <button className="fn-focus" onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {checkedOut ? (
              <div style={{ textAlign: "center", padding: "40px 10px" }}>
                <Check size={32} color="#2A4B7C" />
                <p style={{ marginTop: 12 }}>Order placed. Thanks, {form.name.split(" ")[0]}!</p>
                <button
                  className="fn-btn fn-focus"
                  onClick={() => { setCheckedOut(false); setCartOpen(false); setForm({ name: "", email: "", address: "" }); }}
                  style={{ marginTop: 10, background: "#221F1A", color: "#EDEAE2", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer" }}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.length === 0 && <p style={{ color: "#8A8474" }}>Your cart is empty.</p>}

                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #D8D2C4" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, background: item.tone, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#8A8474" }}>${item.price} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button className="fn-focus" onClick={() => changeQty(item.id, -1)} style={{ border: "1px solid #D8D2C4", background: "#fff", borderRadius: 4, cursor: "pointer" }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 13, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                      <button className="fn-focus" onClick={() => changeQty(item.id, 1)} style={{ border: "1px solid #D8D2C4", background: "#fff", borderRadius: 4, cursor: "pointer" }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {cartItems.length > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", fontSize: 15 }}>
                      <span>Subtotal</span>
                      <strong>${subtotal.toFixed(2)}</strong>
                    </div>

                    <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
                      <h3 style={{ fontFamily: "Georgia, serif", fontSize: 16, margin: "4px 0" }}>Shipping details</h3>

                      <div>
                        <input
                          className="fn-focus"
                          placeholder="Full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid " + (errors.name ? "#B0442E" : "#D8D2C4"), fontSize: 13, boxSizing: "border-box" }}
                        />
                        {errors.name && <span style={{ color: "#B0442E", fontSize: 12 }}>{errors.name}</span>}
                      </div>

                      <div>
                        <input
                          className="fn-focus"
                          placeholder="Email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid " + (errors.email ? "#B0442E" : "#D8D2C4"), fontSize: 13, boxSizing: "border-box" }}
                        />
                        {errors.email && <span style={{ color: "#B0442E", fontSize: 12 }}>{errors.email}</span>}
                      </div>

                      <div>
                        <input
                          className="fn-focus"
                          placeholder="Shipping address"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid " + (errors.address ? "#B0442E" : "#D8D2C4"), fontSize: 13, boxSizing: "border-box" }}
                        />
                        {errors.address && <span style={{ color: "#B0442E", fontSize: 12 }}>{errors.address}</span>}
                      </div>

                      <button
                        type="submit"
                        className="fn-btn fn-focus"
                        style={{ marginTop: 6, background: "#2A4B7C", color: "#fff", border: "none", borderRadius: 6, padding: "11px 14px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                      >
                        Place order <ChevronRight size={15} />
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
