
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
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#e9e2d7] bg-[#faf8f4]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <a
            href="#home"
            className="text-3xl font-extrabold tracking-tight text-[#284b36]"
          >
            Eataliano<span className="text-[#c87935]">.</span>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
            <a href="#home" className="transition hover:text-[#c87935]">
              Home
            </a>
            <a href="#menu" className="transition hover:text-[#c87935]">
              Our Menu
            </a>
            <a href="#about" className="transition hover:text-[#c87935]">
              About Us
            </a>
            <a href="#contact" className="transition hover:text-[#c87935]">
              Contact
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setShfaqShporten(true)}
            className="rounded-full bg-[#284b36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d3928]"
          >
            Cart ({shporta.length})
          </button>
        </div>
      </header>

      {/* RIGHT SIDE SHOPPING CART DRAWER */}
      {shfaqShporten && (
        <div className="fixed inset-0 z-100">
          {/* BACKGROUND OVERLAY */}
          <button
            type="button"
            aria-label="Close shopping cart"
            onClick={() => setShfaqShporten(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
          />

          {/* CART DRAWER */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-430px flex-col bg-[#faf8f4] shadow-2xl"
          >
            {/* CART HEADER */}
            <div className="flex items-center justify-between border-b border-[#e9e2d7] px-6 py-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c87935]">
                  Eataliano
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#284b36]">
                  Your Cart
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShfaqShporten(false)}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9e2d7] text-xl text-[#284b36] transition hover:bg-[#e9eee6]"
              >
                ✕
              </button>
            </div>

            {/* CART CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {shporta.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9eee6] text-4xl">
                    🛒
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#284b36]">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#888176]">
                    Looks like you have not added anything to your cart yet.
                    Explore our menu and find something delicious!
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShfaqShporten(false);
                      document.getElementById("menu")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    className="mt-7 rounded-full bg-[#284b36] px-7 py-3 font-bold text-white transition hover:bg-[#1d3928]"
                  >
                    Explore Our Menu
                  </button>
                </div>
              ) : (
                <div>
                  <p className="mb-5 text-sm font-semibold text-[#888176]">
                    {shporta.length} {shporta.length === 1 ? "item" : "items"} in
                    your cart
                  </p>

                  <div className="space-y-5">
                    {shporta.map((ushqimi, index) => (
                      <div
                        key={`${ushqimi.id}-${index}`}
                        className="flex gap-4 border-b border-[#e9e2d7] pb-5"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={ushqimi.foto}
                            alt={ushqimi.emri}
                            fill
                            unoptimized
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-[#284b36]">
                              {ushqimi.emri}
                            </h3>
                            <p className="mt-1 text-sm text-[#888176]">
                              {ushqimi.kategoria}
                            </p>
                            <p className="mt-2 font-extrabold text-[#c87935]">
                              ${ushqimi.cmimi.toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => largoNgaShporta(index)}
                            className="mt-2 self-start text-sm font-semibold text-red-600 transition hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CART FOOTER */}
            {shporta.length > 0 && (
              <div className="border-t border-[#e9e2d7] bg-white px-6 py-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-base font-semibold text-[#77736b]">
                    Subtotal
                  </span>
                  <span className="text-2xl font-extrabold text-[#284b36]">
                    ${totali.toFixed(2)}
                  </span>
                </div>

                <p className="mb-5 text-xs leading-5 text-[#888176]">
                  Taxes and delivery fees are calculated at checkout.
                </p>

                <Link
                  href="/checkout"
                  onClick={() => setShfaqShporten(false)}
                  className="block w-full rounded-full bg-[#c87935] px-7 py-4 text-center font-bold text-white transition hover:bg-[#ad6428]"
                >
                  Proceed to Checkout →
                </Link>

                <button
                  type="button"
                  onClick={() => setShfaqShporten(false)}
                  className="mt-4 w-full py-2 text-sm font-semibold text-[#284b36] transition hover:text-[#c87935]"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* HERO */}
      <section
        id="home"
        className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-16"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e9eee6] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#284b36]">
              <span className="h-2 w-2 rounded-full bg-[#c87935]" />
              Authentic Italian Cuisine
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.12] tracking-tight text-[#284b36] sm:text-6xl lg:text-7xl">
              A Taste of
              <span className="block text-[#c87935]">Italy,</span>
              Made for You.
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-[#77736b]">
              Discover the flavors of Italy with freshly prepared pizzas,
              delicious pasta and authentic recipes made with love.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#menu"
                className="rounded-full bg-[#284b36] px-8 py-4 font-bold text-white shadow-lg shadow-[#284b36]/15 transition hover:-translate-y-1 hover:bg-[#1d3928]"
              >
                Explore Our Menu →
              </a>

              <a
                href="#about"
                className="rounded-full border border-[#d9d2c7] px-8 py-4 font-bold text-[#284b36] transition hover:bg-white"
              >
                Discover More
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-10 border-t border-[#e9e2d7] pt-8">
              <div>
                <p className="text-2xl font-extrabold text-[#284b36]">100%</p>
                <p className="mt-1 text-sm text-[#888176]">Fresh Ingredients</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#284b36]">Italian</p>
                <p className="mt-1 text-sm text-[#888176]">Inspired Recipes</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#284b36]">Made</p>
                <p className="mt-1 text-sm text-[#888176]">With Passion</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#e9dfc9]" />
            <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[#e9eee6]" />

            <div className="relative overflow-hidden rounded-2rem shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=1200"
                alt="Fresh Italian pizza"
                width={1200}
                height={1000}
                unoptimized
                priority
                className="h-380px w-full object-cover sm:h-500px lg:h-570px"
              />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/90 p-5 shadow-lg backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-widest text-[#c87935]">
                  Our Speciality
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#284b36]">
                      Italian Pizza
                    </h3>
                    <p className="mt-1 text-sm text-[#77736b]">
                      Fresh, delicious and made with love.
                    </p>
                  </div>
                  <a
                    href="#menu"
                    className="shrink-0 rounded-full bg-[#284b36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d3928]"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#284b36] px-6 py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:px-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e6b879]">
              Our Story
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Bringing the Taste of Italy to Your Table
            </h2>
          </div>

          <p className="text-base leading-8 text-white/75">
            At Eataliano, we believe great food brings people together.
            Our menu celebrates Italian-inspired favorites, prepared with
            care and served fresh for you to enjoy. From classic pizza to
            comforting pasta, every dish is an invitation to enjoy something
            delicious.
          </p>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24"
      >
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c87935]">
              Made Fresh for You
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-[#284b36] sm:text-5xl">
              Explore Our Menu
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#77736b]">
              Discover our selection of Italian favorites, prepared to make
              every meal special.
            </p>
          </div>

          <span className="rounded-full bg-[#e9eee6] px-5 py-3 text-sm font-bold text-[#284b36]">
            {ushqimet.length} Delicious Dishes
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ushqimet.map((ushqim) => (
            <article
              key={ushqim.id}
              className="group overflow-hidden rounded-2xl border border-[#eee8de] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={ushqim.foto}
                  alt={ushqim.emri}
                  width={900}
                  height={650}
                  unoptimized
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-[#284b36] shadow">
                  {ushqim.kategoria}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-extrabold text-[#284b36]">
                  {ushqim.emri}
                </h3>

                <p className="mt-3 min-h-52px text-sm leading-6 text-[#888176]">
                  {ushqim.pershkrimi}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#eee8de] pt-5">
                  <span className="text-2xl font-extrabold text-[#c87935]">
                    ${ushqim.cmimi.toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => shtoNeShporte(ushqim)}
                    className="rounded-full bg-[#284b36] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1d3928]"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      
{/* CONTACT */}
<section id="contact" className="bg-[#f0eee7] px-6 py-20 lg:py-24">
  <div className="mx-auto max-w-7xl">
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c87935]">
        Get in Touch
      </p>

      <h2 className="mt-4 text-4xl font-extrabold leading-tight text-[#284b36] sm:text-5xl">
        Visit Eataliano
      </h2>

      <p className="mt-6 leading-8 text-[#77736b]">
        We look forward to welcoming you. Enjoy authentic Italian food,
        freshly prepared with love.
      </p>
    </div>

    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl border border-[#e5dfd3] bg-white p-8 text-center shadow-sm">
        <div className="text-3xl">🍽️</div>
        <h3 className="mt-5 text-lg font-bold text-[#284b36]">
          Restaurant
        </h3>
        <p className="mt-3 text-[#77736b]">Eataliano</p>
      </div>

      <div className="rounded-3xl border border-[#e5dfd3] bg-white p-8 text-center shadow-sm">
        <div className="text-3xl">📍</div>
        <h3 className="mt-5 text-lg font-bold text-[#284b36]">
          Location
        </h3>
        <p className="mt-3 text-[#77736b]">United States</p>
      </div>

      <div className="rounded-3xl border border-[#e5dfd3] bg-white p-8 text-center shadow-sm">
        <div className="text-3xl">📞</div>
        <h3 className="mt-5 text-lg font-bold text-[#284b36]">
          Call Us
        </h3>
        <a
          href="tel:+12125550147"
          className="mt-3 inline-block text-[#77736b] transition hover:text-[#c87935]"
        >
          +1 (212) 555-0147
        </a>
      </div>

      <div className="rounded-3xl border border-[#e5dfd3] bg-white p-8 text-center shadow-sm">
        <div className="text-3xl">🍝</div>
        <h3 className="mt-5 text-lg font-bold text-[#284b36]">
          Cuisine
        </h3>
        <p className="mt-3 text-[#77736b]">
          Italian Food & Fresh Pasta
        </p>
      </div>
    </div>
  </div>
</section>


      {/* FOOTER */}
      <footer className="bg-[#1d3527] px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-3xl font-extrabold">
              Eataliano<span className="text-[#c87935]">.</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              Bringing authentic Italian-inspired flavors to your table.
              Fresh food, delicious moments.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#e6b879]">Quick Links</h3>
            <div className="mt-5 flex flex-col items-start gap-3 text-sm text-white/70">
              <a href="#home" className="transition hover:text-white">Home</a>
              <a href="#menu" className="transition hover:text-white">Our Menu</a>
              <a href="#about" className="transition hover:text-white">About Us</a>
              <a href="#contact" className="transition hover:text-white">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#e6b879]">Order Online</h3>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Explore our menu, choose your favorite dishes and place your
              order online.
            </p>
            <a
              href="#menu"
              className="mt-4 inline-block font-bold text-[#e6b879] transition hover:text-white"
            >
              Browse Menu →
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6 text-center text-sm text-white/50">
          © 2026 Eataliano. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
