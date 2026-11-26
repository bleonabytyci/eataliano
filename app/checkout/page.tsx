
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type Ushqimi = {
  id: number;
  emri: string;
  cmimi: number;
};

type ProduktiPorosise = {
  foodName: string;
  quantity: number;
  unitPrice: number;
};

type PorosiaOffline = {
  clientOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  orderNotes: string;
  items: ProduktiPorosise[];
};

const QUEUE_KEY = "eataliano-pending-orders";

function lexoPorosite(): PorosiaOffline[] {
  try {
    const data = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function ruajPorosite(porosite: PorosiaOffline[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(porosite));
}

async function dergoNeServer(porosia: PorosiaOffline) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(porosia),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = new Error(
      data.message || "The order could not be saved."
    );

    if (response.status >= 500) {
      error.name = "ServerError";
    } else {
      error.name = "ValidationError";
    }

    throw error;
  }

  return data;
}

export default function Checkout() {
  const [shporta, setShporta] = useState<Ushqimi[]>([]);
  const [uNgarkua, setUNgarkua] = useState(false);
  const [porosiaUPlotesua, setPorosiaUPlotesua] = useState(false);
  const [porosiaNePritje, setPorosiaNePritje] = useState(false);
  const [poDergohet, setPoDergohet] = useState(false);
  const [gabimi, setGabimi] = useState("");

  const [emri, setEmri] = useState("");
  const [email, setEmail] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [adresa, setAdresa] = useState("");
  const [shenime, setShenime] = useState("");

  const [orderId, setOrderId] = useState<number | string | null>(null);
  const [clientOrderId, setClientOrderId] = useState("");

  const poSinkronizohet = useRef(false);

  const totali = shporta.reduce(
    (shuma, ushqimi) => shuma + ushqimi.cmimi,
    0
  );

  async function sinkronizoPorosite() {
    if (!navigator.onLine || poSinkronizohet.current) {
      return;
    }

    poSinkronizohet.current = true;

    try {
      const porosite = lexoPorosite();

      for (const porosia of porosite) {
        try {
          const data = await dergoNeServer(porosia);

          const teMbeturat = lexoPorosite().filter(
            (item) => item.clientOrderId !== porosia.clientOrderId
          );

          ruajPorosite(teMbeturat);

          setOrderId(data.orderId);
          setClientOrderId(porosia.clientOrderId);
          setPorosiaNePritje(false);
          setPorosiaUPlotesua(true);
          setGabimi("");
        } catch (error) {
          console.error("Order synchronization error:", error);

          setGabimi(
            error instanceof Error
              ? error.message
              : "The order is still waiting to be sent."
          );

          break;
        }
      }

      if (lexoPorosite().length === 0) {
        setPorosiaNePritje(false);
      }
    } finally {
      poSinkronizohet.current = false;
    }
  }

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

    const porosite = lexoPorosite();

    if (porosite.length > 0) {
      setPorosiaNePritje(true);
      setClientOrderId(porosite[0].clientOrderId);
    }

    setUNgarkua(true);

    function kurRikthehetInterneti() {
      void sinkronizoPorosite();
    }

    window.addEventListener("online", kurRikthehetInterneti);

    if (navigator.onLine && porosite.length > 0) {
      void sinkronizoPorosite();
    }

    return () => {
      window.removeEventListener("online", kurRikthehetInterneti);
    };
  }, []);

  async function dergoPorosine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setGabimi("");
    setPoDergohet(true);

    try {
      const produktet = Array.from(
        shporta.reduce((map, ushqimi) => {
          const key = `${ushqimi.id}-${ushqimi.emri}`;

          const ekzistues = map.get(key);

          if (ekzistues) {
            ekzistues.quantity += 1;
          } else {
            map.set(key, {
              foodName: ushqimi.emri,
              quantity: 1,
              unitPrice: ushqimi.cmimi,
            });
          }

          return map;
        }, new Map<string, ProduktiPorosise>())
      ).map(([, produkti]) => produkti);

      const porosia: PorosiaOffline = {
        clientOrderId: crypto.randomUUID(),
        customerName: emri.trim(),
        customerEmail: email.trim(),
        customerPhone: telefoni.trim(),
        deliveryAddress: adresa.trim(),
        orderNotes: shenime.trim(),
        items: produktet,
      };

      if (!navigator.onLine) {
        ruajPorosite([...lexoPorosite(), porosia]);

        localStorage.removeItem("eataliano-shporta");
        setShporta([]);
        setClientOrderId(porosia.clientOrderId);
        setPorosiaNePritje(true);

        return;
      }

      try {
        const data = await dergoNeServer(porosia);

        localStorage.removeItem("eataliano-shporta");
        setShporta([]);
        setOrderId(data.orderId);
        setPorosiaUPlotesua(true);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "ValidationError"
        ) {
          throw error;
        }

        // Ruajmë të njëjtin identifikues për tentimin e ardhshëm.
        ruajPorosite([...lexoPorosite(), porosia]);

        localStorage.removeItem("eataliano-shporta");
        setShporta([]);
        setClientOrderId(porosia.clientOrderId);
        setPorosiaNePritje(true);
      }
    } catch (error) {
      console.error("Checkout error:", error);

      setGabimi(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setPoDergohet(false);
    }
  }

  if (!uNgarkua) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] text-white">
        Loading...
      </main>
    );
  }

  if (porosiaNePritje) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] px-6 text-white">
        <div className="w-full max-w-lg rounded-xl border border-yellow-700 bg-[#192631] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#e9a23b]">
            Order Waiting
          </h1>

          <p className="mt-4 text-lg">
            Your order is safely saved on this device.
          </p>

          <p className="mt-3 text-sm text-yellow-300">
            Waiting for internet connection. Your order will be sent automatically when you are online.
          </p>

          {clientOrderId && (
            <p className="mt-4 break-all text-xs text-gray-400">
              Reference: {clientOrderId}
            </p>
          )}

          {gabimi && (
            <p className="mt-4 text-sm text-red-300">{gabimi}</p>
          )}

          <p className="mt-4 text-sm text-gray-300">
            Your order is not confirmed yet.
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

  if (porosiaUPlotesua) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] px-6 text-white">
        <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-[#192631] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#e9a23b]">
            Thank You!
          </h1>

          <p className="mt-4 text-lg">
            Your order has been placed successfully!
          </p>

          {orderId !== null && (
            <p className="mt-3 text-sm text-gray-300">
              Order Number: #{orderId}
            </p>
          )}

          <p className="mt-3 text-sm text-gray-400">
            Your order has been saved to our database.
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

                {gabimi && (
                  <p className="rounded-lg border border-red-500 bg-red-950/40 p-3 text-sm text-red-300">
                    {gabimi}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={poDergohet}
                  className="w-full rounded-lg bg-[#c94c35] px-6 py-3 font-bold hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {poDergohet
                    ? "Placing Order..."
                    : `Place Order – $${totali}`}
                </button>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
