import { GetCart } from "@/lib/db/cart";
import { FormatPrice } from "@/lib/format";
import React from "react";
import setProductQuantity from "./actions";
import CartEntry from "./CartEntry";

export const metadata = {
  title: "Your Cart - Flowmazon",
};

export default async function CartPage() {
  const cart = await GetCart();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-center md:items-end">
        <p className="mb-3 font-bold">
          Total:{FormatPrice(cart?.subtotal || 0)}{" "}
        </p>
        <button className="btn-primary btn w-[200px] ">Checkout</button>
      </div>
    </div>
  );
}
