import { NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { productDb } from "@/lib/db";
import type { Product, ProductSort } from "@/lib/types";

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "newest":
      return list.sort((a, b) => parseInt(b.id.slice(1), 10) - parseInt(a.id.slice(1), 10));
    default:
      return list.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = (searchParams.get("sort") ?? "name") as ProductSort;
  const inStockOnly = searchParams.get("inStock") !== "false";

  let products = inStockOnly ? productDb.listInStock() : productDb.list();

  if (category !== "all") {
    products = products.filter((p) => p.category === category);
  }
  if (q) {
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  products = sortProducts(products, sort);
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    const user = requireRole(await getCurrentUser(), ["admin", "seller"]);
    const body = await request.json();
    const { name, price, category, stock, rating, reviews, description, image } = body;

    if (!name || !price || !category || stock == null || !description || !image) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const product: Product = {
      id: productDb.nextId(),
      name: String(name).trim(),
      sellerId: user.role === "seller" ? user.id : null,
      price: Number(price),
      category: String(category),
      stock: Number(stock),
      rating: Number(rating) || 4.5,
      reviews: Number(reviews) || 0,
      description: String(description).trim(),
      image: String(image).trim(),
    };

    productDb.create(product);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
