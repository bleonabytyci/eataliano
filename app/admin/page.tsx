
"use client";

import { useEffect, useState, type FormEvent } from "react";

type OrderItem = {
  food_name: string;
  quantity: number;
  unit_price: string | number;
};

type Order = {
  id: number | string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  order_notes: string | null;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadOrders() {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok || !data.success) {
        setIsLoggedIn(false);
        return false;
      }

      setOrders(data.orders);
      setIsLoggedIn(true);
      return true;
    } catch {
      setError("Could not connect to the server.");
      return false;
    }
  }

  useEffect(() => {
    async function checkLogin() {
      await loadOrders();
      setIsLoading(false);
    }

    checkLogin();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Incorrect password.");
      }

      setPassword("");
      await loadOrders();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setOrders([]);
    setPassword("");
    setError("");
    setSuccess("");
  }

  async function handleStatusChange(orderId: number | string, status: string) {
    setError("");
    setSuccess("");
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch("/api/admin/order-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status: data.order.status }
            : order
        )
      );

      setSuccess(`Order #${orderId} status updated successfully.`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] text-white">
        Loading Admin Dashboard...
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101820] px-6 text-white">
        <section className="w-full max-w-md rounded-xl border border-gray-700 bg-[#192631] p-8">
          <h1 className="text-center text-3xl font-bold text-[#e9a23b]">
            Eataliano Admin
          </h1>

          <p className="mb-8 mt-3 text-center text-gray-400">
            Sign in to manage restaurant orders.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b]"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#c94c35] px-6 py-3 font-bold hover:bg-red-700 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101820] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#e9a23b]">
              Eataliano Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-400">
              Manage and review customer orders.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-[#c94c35] px-5 py-3 font-semibold hover:bg-red-700"
          >
            Log Out
          </button>
        </header>

        <section className="mb-8 rounded-xl border border-gray-700 bg-[#192631] p-6">
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="mt-2 text-4xl font-bold text-[#e9a23b]">
            {orders.length}
          </p>
        </section>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Customer Orders</h2>
          <button
            onClick={loadOrders}
            className="rounded-lg border border-gray-600 px-4 py-2 hover:border-[#e9a23b]"
          >
            Refresh
          </button>
        </div>

        {success && (
          <p className="mb-5 rounded-lg border border-green-600 bg-green-950/40 p-3 text-green-300">
            {success}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-lg border border-red-500 bg-red-950/40 p-3 text-red-300">
            {error}
          </p>
        )}

        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-700 bg-[#192631] p-8 text-center text-gray-400">
            No orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <section
                key={order.id}
                className="rounded-xl border border-gray-700 bg-[#192631] p-6"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#e9a23b]">
                      Order #{order.id}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleString("en-US")}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-900/50 px-4 py-2 text-sm font-semibold text-yellow-300">
                    {order.status}
                  </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-bold">Customer Information</h4>
                    <p className="mb-2 text-gray-300">
                      Name: {order.customer_name}
                    </p>
                    <p className="mb-2 break-all text-gray-300">
                      Email: {order.customer_email}
                    </p>
                    <p className="mb-2 text-gray-300">
                      Phone: {order.customer_phone}
                    </p>
                    <p className="text-gray-300">
                      Address: {order.delivery_address}
                    </p>

                    {order.order_notes && (
                      <p className="mt-3 text-gray-400">
                        Notes: {order.order_notes}
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold">Order Items</h4>

                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="flex justify-between gap-3 border-b border-gray-700 py-2"
                      >
                        <span className="text-gray-300">
                          {item.food_name} × {item.quantity}
                        </span>
                        <span className="text-[#e9a23b]">
                          ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    <div className="mt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-[#e9a23b]">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-700 pt-5">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="mb-2 block font-semibold"
                  >
                    Update Order Status
                  </label>

                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    disabled={updatingOrderId !== null}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value)
                    }
                    className="w-full max-w-xs rounded-lg border border-gray-600 bg-[#101820] p-3 text-white outline-none focus:border-[#e9a23b] disabled:opacity-60"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {updatingOrderId === order.id && (
                    <p className="mt-2 text-sm text-gray-400">
                      Updating status...
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
