import { Prisma } from "@prisma/client";
import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;
// böyle yaptık çünkü sadece cartItem içerisindeyiz

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export async function GetCart(): Promise<ShoppingCart | null> {
  const localCartId = cookies().get("localCartId")?.value;
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ),
  };
}

export async function CreateCart(): Promise<ShoppingCart> {
  

  const newCart = await prisma.cart.create({
    data: {},
  });
  // this one needs encryption + secure settings in real production app
  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

// burada user log oldugunda cartları dursun anony girdiğinde de cookie olarak cartları dursun getCart ile de id leri alalım ve product gözükmesi lazım sonuçta ama birbirlerine referans oldukları için iç içe çağırıyoruz

// yani kısaca cart varsa cookieden id alsın ve içerisinde product ürünüm olsun
