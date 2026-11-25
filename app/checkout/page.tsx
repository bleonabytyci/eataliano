
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Ushqimi = {
  id: number;
  emri: string;
  cmimi: number;
};

export default function Checkout() {
  const [shporta, setShporta] = useState<Ushqimi[]>([]);
  const [uNgarkua, setUNgarkua] = useState(false);
  const [porosiaUPlotesua, setPorosiaUPlotesua] = useState(false);

  const [emri, setEmri] = useState("");
  const [email, setEmail] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [adresa, setAdresa] = useState("");
  const [shenime, setShenime] = useState("");

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

    setUNgarkua(true);
  }, []);

  const totali = shporta.reduce(
    (shuma, ushqimi) => shuma + ushqimi.cmimi,
    0
  );

  function dergoPorosine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPorosiaUPlotesua(true);
    localStorage.removeItem("eataliano-shporta");
    setShporta([]);
  }

  if (porosiaUPlotesua) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] px-6 text-white">
        <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-[#192631] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#e9a23b]">
            Thank You!
          </h1>

          <p className="mt-4 text-lg">
            Your order details have been completed.
          </p>

          <p className="mt-3 text-sm text-gray-400">
            This is a demo confirmation. The order has not yet been saved
            to the restaurant database.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#c94c35] px-6 py-3 font-semibold"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  if (!uNgarkua) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101820] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-[#e9a23b] hover:underline">
          ← Back to Menu
        </Link>

        <h1 className="mb-8 mt-5 text-4xl font-bold text-[#e9a23b]">
          Checkout
        </h1>

        {shporta.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-[#192631] p-8">
            <h2 className="text-2xl font-bold">Your Cart is Empty</h2>

            <p className="mt-3 text-gray-300">
              Add some food to your cart before checkout.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#c94c35] px-6 py-3 font-semibold"
            >
              Go to Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <section className="rounded-xl border border-gray-700 bg-[#192631] p-6">
              <h2 className="mb-5 text-2xl font-bold">Order Summary</h2>

              {shporta.map((ushqimi, index) => (
                <div
                  key={`${ushqimi.id}-${index}`}
                  className="flex justify-between border-b border-gray-700 py-4"
                >
                  <span>{ushqimi.emri}</span>

                  <span className="font-semibold text-[#e9a23b]">
                    ${ushqimi.cmimi}
                  </span>
                </div>
              ))}

              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-[#e9a23b]">${totali}</span>
              </div>
            </section>

            <section className="rounded-xl border border-gray-700 bg-[#192631] p-6">
              <h2 className="mb-5 text-2xl font-bold">
                Delivery Information
              </h2>

              <form onSubmit={dergoPorosine} className="space-y-4">
                <div>
                  <label className="mb-2 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={emri}
                    onChange={(event) => setEmri(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={telefoni}
                    onChange={(event) => setTelefoni(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block">Delivery Address</label>
                  <input
                    type="text"
                    required
                    value={adresa}
                    onChange={(event) => setAdresa(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
                    placeholder="Enter your delivery address"
                  />
                </div>

                <div>
                  <label className="mb-2 block">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={shenime}
                    onChange={(event) => setShenime(event.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
                    placeholder="Any special instructions?"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#c94c35] px-6 py-3 font-bold hover:bg-red-700"
                >
                  Place Order – ${totali}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
