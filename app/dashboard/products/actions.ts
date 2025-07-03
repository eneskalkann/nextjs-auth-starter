"use server";

import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";

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

export async function updateProduct(slug: string, formData: FormData) {
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

  // Görsel sırası ve silinecekler
  const imageOrder = JSON.parse((formData.get("imageOrder") as string) || "[]");
  const deletedImages = JSON.parse(
    (formData.get("deletedImages") as string) || "[]"
  );
  const newImages = formData.getAll("newImages") as File[];

  // 1. Silinecek görselleri Cloudinary ve DB'den sil
  for (const imageId of deletedImages) {
    const image = await prisma.productImage.findUnique({
      where: { id: Number(imageId) },
    });
    if (image) {
      // Cloudinary public_id'yi url'den çıkar
      const publicId = image.url.split("/").slice(-1)[0].split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (e) {
        // logla ama devam et
        console.error("Cloudinary silme hatası:", e);
      }
      await prisma.productImage.delete({ where: { id: image.id } });
    }
  }

  // 2. Yeni görselleri Cloudinary'e yükle ve url'lerini al
  const uploadedImageUrls: string[] = [];
  for (const file of newImages) {
    // Next.js server actions'da File objesi buffer ile alınır
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadRes = await cloudinary.uploader.upload_stream(
      { folder: "products" },
      (err, result) => {
        if (err || !result) throw err || new Error("Cloudinary upload failed");
        return result.secure_url;
      }
    );
    // upload_stream callback ile çalışır, await ile kullanmak için bir promise'e sarmak gerekir
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (err, result) => {
          if (err || !result)
            return reject(err || new Error("Cloudinary upload failed"));
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });
    uploadedImageUrls.push(url);
  }

  // 3. Ürünü güncelle
  const categoryId = formData.get("categoryId") as string;
  const product = await prisma.product.update({
    where: { slug, userId: session.user.id },
    data: {
      title,
      description,
      price,
      fixed_price,
      stock,
      isOnSale,
      isOnShopPage,
      updatedAt: new Date(),
      category: categoryId ? { set: [{ id: Number(categoryId) }] } : undefined,
    },
  });

  // 4. Yeni görselleri DB'ye ekle
  for (const url of uploadedImageUrls) {
    await prisma.productImage.create({
      data: {
        url,
        productId: product.id,
      },
    });
  }

  // 5. Görsel sırasını güncelle (varsayım: product.images ile imageOrder aynı uzunlukta ve sıralı)
  // Eğer productImage modelinde bir 'order' alanı yoksa, eklenmesi önerilir. Yoksa bu adımı atla.
  // Burada sıralama desteği için bir güncelleme yapılabilir.

  return true;
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

  return true;
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

  // Kategori ID'sini formdan al
  const categoryId = formData.get("categoryId") as string;

  // Handle Tags
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter(Boolean)
    : [];

  // Create slug from title
  const randomSlugCode = "VINTEMO" + Math.floor(Math.random() * 100000000);
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const slug = `${baseSlug}-${randomSlugCode}`;

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
      images:
        imageUrls.length > 0
          ? {
              create: imageUrls.map((url: string) => ({ url })),
            }
          : undefined,
      category: categoryId
        ? {
            connect: { id: Number(categoryId) },
          }
        : undefined,
      tags:
        tags.length > 0
          ? {
              connectOrCreate: tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
    },
  });

  // Başarılı olursa slug'ı döndür
  return { slug };
}
