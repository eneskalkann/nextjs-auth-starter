"use server";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getServerSessionSafe() {
  return getServerSession(authOptions);
}

export async function getUserProducts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const products = await prisma.product.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
      tags: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

export async function getProductBySlug(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findFirst({
    where: {
      slug,
      userId: session.user.id,
    },
    include: {
      category: true,
      tags: true,
      images: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function updateProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const fixed_price = parseFloat(formData.get("fixed_price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const isOnSale = formData.get("isOnSale") === "on";
  const isOnShopPage = formData.get("isOnShopPage") === "on";

  await prisma.product.update({
    where: {
      slug,
      userId: session.user.id,
    },
    data: {
      title,
      description,
      price,
      fixed_price,
      stock,
      isOnSale,
      isOnShopPage,
      updatedAt: new Date(),
    },
  });

  redirect(`/dashboard/products/${slug}`);
}

export async function deleteProduct(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({
    where: {
      slug,
      userId: session.user.id,
    },
  });

  redirect("//products");
}


export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const fixed_price = parseFloat(formData.get("fixed_price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const isOnSale = formData.get("isOnSale") === "on";
  const isOnShopPage = formData.get("isOnShopPage") === "on";
  const imageUrls = formData.getAll("imageUrls") as string[];

  // Handle Categories
  const categoryIdsString = formData.get("categoryIds") as string;
  const categoryIds = categoryIdsString
    ? categoryIdsString.split(",").map((id) => parseInt(id.trim()))
    : [];

  // Handle Tags
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString.split(",").map((tag) => tag.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  // Create slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  if (!title || !slug) {
    throw new Error("Title is required to create a product.");
  }

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      fixed_price,
      stock,
      isOnSale,
      isOnShopPage,
      slug,
      userId: session.user.id,
      images: imageUrls.length > 0 ? {
        create: imageUrls.map((url: string) => ({ url }))
      } : undefined,
      category: categoryIds.length > 0 ? {
        connect: categoryIds.map((id) => ({ id }))
      } : undefined,
      tags: tags.length > 0 ? {
        connectOrCreate: tags.map((name) => ({
          where: { name },
          create: { name },
        })),
      } : undefined,
    },
  });

  redirect(`/dashboard/products/${slug}`);
}
