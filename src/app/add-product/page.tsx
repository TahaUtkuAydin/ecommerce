import { prisma } from "@/lib/db/prisma";
import React from "react";
import { redirect } from "next/navigation";
import FormSubmitButton from "../components/FormSubmitButton";
import Link from "next/link";

export const metadata = {
  title: "Add Product - Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect("/");
}

export default function AddProductPage() {
  return (
    <div>
      <Link href={"/"}>Home</Link>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          className="input-bordered input mb-3 w-full"
          placeholder="Name"
        />
        <textarea
          required
          name="description"
          id="description"
          placeholder="Description"
          className="textarea-bordered textarea mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          type="url"
          className="input-bordered input mb-3 w-full"
          placeholder="Image URL"
        />
        <input
          required
          type="number"
          name="price"
          className="input-bordered input mb-3 w-full"
          placeholder="Price"
        />
        <FormSubmitButton className=" btn-block ">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
