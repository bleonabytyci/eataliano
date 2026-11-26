
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

const menuPrices: Record<string, number> = {
  "Margherita Pizza": 14,
  "Pepperoni Pizza": 17,
  "Spaghetti Carbonara": 19,
  "Penne Alfredo": 18,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      clientOrderId,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      orderNotes,
      items,
    } = body;

    // Kontrollimi i identifikuesit unik
    if (
      typeof clientOrderId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        clientOrderId
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid order identifier." },
        { status: 400 }
      );
    }

    // Kontrollimi i te dhenave te klientit
    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof customerEmail !== "string" ||
      !customerEmail.trim() ||
      typeof customerPhone !== "string" ||
      !customerPhone.trim() ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Kontrollimi i produkteve
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your order is empty." },
        { status: 400 }
      );
    }

    const validItems = items.map((item) => {
      const foodName =
        typeof item.foodName === "string" ? item.foodName.trim() : "";

      return {
        food_name: foodName,
        quantity: Number(item.quantity),
        unit_price: menuPrices[foodName],
      };
    });

    const invalidItems = validItems.some(
      (item) =>
        !item.food_name ||
        !Object.prototype.hasOwnProperty.call(menuPrices, item.food_name) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 50
    );

    if (invalidItems) {
      return NextResponse.json(
        { success: false, message: "Invalid order items." },
        { status: 400 }
      );
    }

    const totalAmount = validItems.reduce(
      (total, item) => total + item.quantity * item.unit_price,
      0
    );

    // Kontrollojme nese kjo porosi eshte regjistruar me pare
    const existingOrder = await sql`
      SELECT id
      FROM orders
      WHERE client_order_id = ${clientOrderId}::uuid
      LIMIT 1
    `;

    if (existingOrder.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Order was already saved.",
          orderId: existingOrder[0].id,
          alreadySaved: true,
        },
        { status: 200 }
      );
    }

    // Ruajtja e porosise dhe produkteve
    const result = await sql`
      WITH new_order AS (
        INSERT INTO orders (
          client_order_id,
          customer_name,
          customer_email,
          customer_phone,
          delivery_address,
          order_notes,
          total_amount,
          status
        )
        VALUES (
          ${clientOrderId}::uuid,
          ${customerName.trim()},
          ${customerEmail.trim()},
          ${customerPhone.trim()},
          ${deliveryAddress.trim()},
          ${typeof orderNotes === "string" ? orderNotes.trim() || null : null},
          ${totalAmount},
          'pending'
        )
        ON CONFLICT (client_order_id)
        WHERE client_order_id IS NOT NULL
        DO NOTHING
        RETURNING id
      ),
      new_items AS (
        INSERT INTO order_items (
          order_id,
          food_name,
          quantity,
          unit_price
        )
        SELECT
          new_order.id,
          item.food_name,
          item.quantity,
          item.unit_price
        FROM new_order
        CROSS JOIN jsonb_to_recordset(
          ${JSON.stringify(validItems)}::jsonb
        ) AS item(
          food_name text,
          quantity integer,
          unit_price numeric
        )
        RETURNING id
      )
      SELECT id FROM new_order

      UNION ALL

      SELECT id
      FROM orders
      WHERE client_order_id = ${clientOrderId}::uuid
      LIMIT 1
    `;

    if (result.length === 0) {
      throw new Error("Order could not be confirmed.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order saved successfully!",
        orderId: result[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving your order.",
      },
      { status: 500 }
    );
  }
}

