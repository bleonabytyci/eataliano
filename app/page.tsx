
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const ushqimet = [
  {
    id: 1,
    emri: "Margherita Pizza",
    pershkrimi: "Fresh mozzarella, tomato sauce and basil.",
    cmimi: 14,
    kategoria: "Pizza",
    foto: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900",
  },
  {
    id: 2,
    emri: "Pepperoni Pizza",
    pershkrimi: "Classic pizza with mozzarella and pepperoni.",
    cmimi: 17,
    kategoria: "Pizza",
    foto: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900",
  },
  {
    id: 3,
    emri: "Spaghetti Carbonara",
    pershkrimi: "Creamy pasta with parmesan and crispy bacon.",
    cmimi: 19,
    kategoria: "Pasta",
    foto: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900",
  },
  {
    id: 4,
    emri: "Penne Alfredo",
    pershkrimi: "Penne pasta with creamy Alfredo sauce.",
    cmimi: 18,
    kategoria: "Pasta",
    foto: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
  },
];

export default function Home() {
  const [shporta, setShporta] = useState<(typeof ushqimet)[number][]>([]);
  const [shfaqShporten, setShfaqShporten] = useState(false);
  const [shportaUNgarkua, setShportaUNgarkua] = useState(false);
  const [njoftimi, setNjoftimi] = useState("");

  useEffect(() => {
    const shportaERuajtur = localStorage.getItem("eataliano-shporta");

    if (shportaERuajtur) {
      try {
        const artikujt = JSON.parse(shportaERuajtur);

        if (Array.isArray(artikujt)) {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setShporta(artikujt);
}
      } catch {
        localStorage.removeItem("eataliano-shporta");
      }
    }

    setShportaUNgarkua(true);
  }, []);

  useEffect(() => {
    if (shportaUNgarkua) {
      localStorage.setItem("eataliano-shporta", JSON.stringify(shporta));
    }
  }, [shporta, shportaUNgarkua]);

  function shtoNeShporte(ushqimi: (typeof ushqimet)[number]) {
    setShporta((shportaAktuale) => [...shportaAktuale, ushqimi]);
    setNjoftimi(`${ushqimi.emri} added to cart!`);

    window.setTimeout(() => {
      setNjoftimi("");
    }, 2500);
  }

  function largoNgaShporta(index: number) {
    setShporta((shportaAktuale) =>
      shportaAktuale.filter((_, i) => i !== index)
    );
  }

  const totali = shporta.reduce(
    (shuma, ushqimi) => shuma + ushqimi.cmimi,
    0
  );

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#25251f]">
      {njoftimi !== "" && (
        <div role="status" aria-live="polite" className="fixed right-5 top-24 z-[200] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl bg-[#284b36] px-5 py-4 text-sm font-semibold text-white shadow-2xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            ✓
          </span>
          <span>{njoftimi}</span>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-[#e8e3d9] bg-[#faf8f4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold tracking-wide text-[#284b36]">
            Eataliano
          </Link>

          <button
            onClick={() => setShfaqShporten(true)}
            className="rounded-full bg-[#284b36] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3828]"
          >
            Cart ({shporta.length})
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-[#a46c35]">
            Authentic Italian Food
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-[#284b36] md:text-7xl">
            A Taste of Italy, Made Fresh.
          </h1>
          <p className="mb-8 max-w-lg text-lg leading-8 text-[#68665e]">
            Discover delicious Italian pizza, fresh pasta and your favorite
            classic dishes. Made with love and served fresh.
          </p>
          <a
            href="#menu"
            className="inline-block rounded-full bg-[#284b36] px-8 py-4 font-semibold text-white transition hover:bg-[#1d3828]"
          >
            Explore Our Menu
          </a>
        </div>

        <div className="relative h-[350px] overflow-hidden rounded-3xl md:h-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=900"
            alt="Fresh Italian pizza"
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-[#a46c35]">
            Our Selection
          </p>
          <h2 className="text-4xl font-bold text-[#284b36]">Our Menu</h2>
          <p className="mt-3 text-[#68665e]">
            Fresh ingredients. Authentic Italian flavors.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ushqimet.map((ushqimi) => (
            <article
              key={ushqimi.id}
              className="overflow-hidden rounded-2xl border border-[#e8e3d9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-56">
                <Image
                  src={ushqimi.foto}
                  alt={ushqimi.emri}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#a46c35]">
                  {ushqimi.kategoria}
                </p>
                <h3 className="mb-2 text-xl font-bold text-[#284b36]">
                  {ushqimi.emri}
                </h3>
                <p className="mb-5 min-h-12 text-sm leading-6 text-[#68665e]">
                  {ushqimi.pershkrimi}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#284b36]">
                    ${ushqimi.cmimi}
                  </span>
                  <button
                    onClick={() => shtoNeShporte(ushqimi)}
                    className="rounded-full bg-[#284b36] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d3828]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="bg-[#284b36] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-[#e4bd86]">
            Our Story
          </p>
          <h2 className="mb-6 text-4xl font-bold">Welcome to Eataliano</h2>
          <p className="text-lg leading-8 text-white/80">
            We bring the warmth and flavor of Italian cuisine to your table.
            From classic pizza to creamy pasta, every dish is prepared with
            care and fresh ingredients.
          </p>
        </div>
      </section>

      <section id="contact" className="px-6 py-16 text-center">
        <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-[#a46c35]">
          Visit Us
        </p>
        <h2 className="mb-8 text-4xl font-bold text-[#284b36]">
          Contact Eataliano
        </h2>
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e8e3d9] bg-white p-8 shadow-sm">
          <h3 className="mb-4 text-2xl font-bold text-[#284b36]">Eataliano</h3>
          <p className="mb-2 text-[#68665e]">United States</p>
          <p className="mb-2 text-[#68665e]">+1 (212) 555-0147</p>
          <p className="text-[#68665e]">Italian Food & Fresh Pasta</p>
        </div>
      </section>

      <footer className="bg-[#1d3828] px-6 py-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} Eataliano. All rights reserved.
      </footer>

      {shfaqShporten && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/50">
          <button
            aria-label="Close cart"
            onClick={() => setShfaqShporten(false)}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#faf8f4] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e8e3d9] p-6">
              <h2 className="text-2xl font-bold text-[#284b36]">
                Your Cart ({shporta.length})
              </h2>
              <button
                onClick={() => setShfaqShporten(false)}
                aria-label="Close cart"
                className="text-2xl text-[#68665e] hover:text-[#284b36]"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {shporta.length === 0 ? (
                <p className="py-10 text-center text-[#68665e]">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  {shporta.map((ushqimi, index) => (
                    <div
                      key={`${ushqimi.id}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-[#e8e3d9] bg-white p-4"
                    >
                      <div>
                        <h3 className="font-semibold text-[#284b36]">
                          {ushqimi.emri}
                        </h3>
                        <p className="text-sm text-[#68665e]">
                          ${ushqimi.cmimi}
                        </p>
                      </div>
                      <button
                        onClick={() => largoNgaShporta(index)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#e8e3d9] p-6">
              <div className="mb-5 flex items-center justify-between text-lg font-bold text-[#284b36]">
                <span>Subtotal</span>
                <span>${totali.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setShfaqShporten(false)}
                className={`block rounded-full px-6 py-4 text-center font-semibold text-white transition ${
                  shporta.length === 0
                    ? "pointer-events-none bg-gray-400"
                    : "bg-[#284b36] hover:bg-[#1d3828]"
                }`}
              >
                Proceed to Checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
