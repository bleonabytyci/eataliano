
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

type PorosiaOffline = {
  clientOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  orderNotes: string;
  items: {
    foodName: string;
    quantity: number;
    unitPrice: number;
  }[];
};

const QUEUE_KEY = "eataliano-pending-orders";

function regjistroLidhjen(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function lexoLidhjen() {
  return navigator.onLine;
}

function gjendjaNeServer() {
  return true;
}

export default function ServiceWorkerRegister() {
  const online = useSyncExternalStore(
    regjistroLidhjen,
    lexoLidhjen,
    gjendjaNeServer
  );

  const [njoftimi, setNjoftimi] = useState("");
  const poSinkronizohet = useRef(false);

  useEffect(() => {
    let timeoutId: number | undefined;

    function njofto(mesazhi: string) {
      setNjoftimi(mesazhi);

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setNjoftimi("");
      }, 5000);
    }

    async function sinkronizoPorosite() {
      if (!navigator.onLine || poSinkronizohet.current) {
        return;
      }

      poSinkronizohet.current = true;

      try {
        const porosite: PorosiaOffline[] = JSON.parse(
          localStorage.getItem(QUEUE_KEY) || "[]"
        );

        if (!Array.isArray(porosite) || porosite.length === 0) {
          return;
        }

        for (const porosia of porosite) {
          try {
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(porosia),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
              console.error(
                "Order synchronization failed:",
                data.message
              );
              break;
            }

            const teMbeturat: PorosiaOffline[] = JSON.parse(
              localStorage.getItem(QUEUE_KEY) || "[]"
            );

            localStorage.setItem(
              QUEUE_KEY,
              JSON.stringify(
                teMbeturat.filter(
                  (item) =>
                    item.clientOrderId !== porosia.clientOrderId
                )
              )
            );

            njofto(
              `Porosia #${data.orderId} u dërgua me sukses!`
            );
          } catch (error) {
            console.error("Order synchronization error:", error);
            break;
          }
        }
      } catch (error) {
        console.error("Could not read offline orders:", error);
      } finally {
        poSinkronizohet.current = false;
      }
    }

    function kontrolloLidhjen() {
      if (navigator.onLine) {
        njofto("Lidhja me internetin u rikthye.");
        void sinkronizoPorosite();
      } else {
        setNjoftimi("");
      }
    }

    function kontrolloKurHapetFaqja() {
      if (document.visibilityState === "visible") {
        void sinkronizoPorosite();
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log(
            "Eataliano Service Worker registered successfully."
          );
        })
        .catch((error) => {
          console.error(
            "Service Worker registration failed:",
            error
          );
        });
    }

    window.addEventListener("online", kontrolloLidhjen);
    window.addEventListener("offline", kontrolloLidhjen);
    window.addEventListener("focus", kontrolloKurHapetFaqja);

    document.addEventListener(
      "visibilitychange",
      kontrolloKurHapetFaqja
    );

    void sinkronizoPorosite();

    return () => {
      window.removeEventListener("online", kontrolloLidhjen);
      window.removeEventListener("offline", kontrolloLidhjen);
      window.removeEventListener("focus", kontrolloKurHapetFaqja);

      document.removeEventListener(
        "visibilitychange",
        kontrolloKurHapetFaqja
      );

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      {!online && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
          }}
          className="bg-yellow-500 px-4 py-3 text-center text-sm font-semibold text-black shadow-lg"
        >
          Je pa internet – po përdor kopjen e fundit të faqes.
        </div>
      )}

      {online && njoftimi && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
          }}
          className="bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
        >
          {njoftimi}
        </div>
      )}
    </>
  );
}
