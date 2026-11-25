
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
    foto: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700",
  },
  {
    id: 2,
    emri: "Pepperoni Pizza",
    pershkrimi: "Classic pizza with mozzarella and pepperoni.",
    cmimi: 17,
    kategoria: "Pizza",
    foto: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700",
  },
  {
    id: 3,
    emri: "Spaghetti Carbonara",
    pershkrimi: "Creamy pasta with parmesan and crispy bacon.",
    cmimi: 19,
    kategoria: "Pasta",
    foto: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=700",
  },
  {
    id: 4,
    emri: "Penne Alfredo",
    pershkrimi: "Penne pasta with creamy Alfredo sauce.",
    cmimi: 18,
    kategoria: "Pasta",
    foto: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=700",
  },
];

export default function Home() {
  const [shporta, setShporta] = useState<(typeof ushqimet)[number][]>([]);
  const [shfaqShporten, setShfaqShporten] = useState(false);
  const [shportaUNgarkua, setShportaUNgarkua] = useState(false);

  useEffect(() => {
    const shportaERuajtur = localStorage.getItem("eataliano-shporta");

    if (shportaERuajtur) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShporta(JSON.parse(shportaERuajtur));
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
    setShporta([...shporta, ushqimi]);
  }

  function largoNgaShporta(index: number) {
    const listaRe = [...shporta];
    listaRe.splice(index, 1);
    setShporta(listaRe);
  }

  const totali = shporta.reduce(
    (shuma, ushqimi) => shuma + ushqimi.cmimi,
    0
  );

  return (
    <main className="min-h-screen bg-[#101820] text-white">
      <header className="border-b border-gray-700">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-3xl font-bold text-[#e9a23b]">
            Eataliano
          </h1>

          <nav className="flex items-center gap-6">
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#contact">Contact</a>

            <button
              onClick={() => setShfaqShporten(!shfaqShporten)}
              className="rounded-lg bg-[#c94c35] px-4 py-2 font-semibold"
            >
              Cart ({shporta.length})
            </button>
          </nav>
        </div>
      </header>

      {shfaqShporten && (
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-xl border border-gray-700 bg-[#192631] p-6">
            <h2 className="mb-5 text-2xl font-bold">Your Cart</h2>

            {shporta.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <>
                {shporta.map((ushqimi, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-700 py-4"
                  >
                    <div>
                      <h3 className="font-semibold">{ushqimi.emri}</h3>
                      <p className="text-[#e9a23b]">${ushqimi.cmimi}</p>
                    </div>

                    <button
                      onClick={() => largoNgaShporta(index)}
                      className="rounded-lg bg-[#c94c35] px-3 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="mt-5 text-right">
                  <p className="text-xl font-bold">
                    Total: ${totali}
                  </p>

                  <Link
                    href="/checkout"
                    className="mt-4 inline-block rounded-lg bg-[#e9a23b] px-6 py-3 font-bold text-[#101820] hover:bg-yellow-500"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section id="home" className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-xl border border-gray-700 bg-[#192631] px-8 py-16 text-center">
          <h2 className="text-4xl font-bold text-[#e9a23b]">
            Welcome to Eataliano
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
            Enjoy delicious Italian food made with fresh ingredients.
            Order your favorite dishes today!
          </p>

          <a
            href="#menu"
            className="mt-8 inline-block rounded-lg bg-[#c94c35] px-6 py-3 font-semibold hover:bg-red-700"
          >
            Explore Our Menu
          </a>
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-8 text-3xl font-bold text-[#e9a23b]">
          Our Menu
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ushqimet.map((ushqim) => (
            <div
              key={ushqim.id}
              className="overflow-hidden rounded-xl border border-gray-700 bg-[#192631]"
            >
              <Image
                src={ushqim.foto}
                alt={ushqim.emri}
                width={700}
                height={450}
                unoptimized
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <p className="mb-2 text-sm text-[#e9a23b]">
                  {ushqim.kategoria}
                </p>

                <h3 className="text-xl font-bold">{ushqim.emri}</h3>

                <p className="mt-2 min-h-12 text-sm text-gray-300">
                  {ushqim.pershkrimi}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#e9a23b]">
                    ${ushqim.cmimi}
                  </span>

                  <button
                    onClick={() => shtoNeShporte(ushqim)}
                    className="rounded-lg bg-[#c94c35] px-3 py-2 text-sm font-semibold hover:bg-red-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer
        id="contact"
        className="mt-16 border-t border-gray-700 bg-[#192631] px-6 py-8 text-center"
      >
        <h2 className="text-2xl font-bold text-[#e9a23b]">
          Eataliano
        </h2>

        <p className="mt-3 text-gray-300">Authentic Italian Food</p>

        <p className="mt-2 text-sm text-gray-400">
          © 2026 Eataliano. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
