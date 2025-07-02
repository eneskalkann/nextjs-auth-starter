import { authOptions } from "@/auth";
import ProductCard from "@/components/product/product-card";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Product } from "./types";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ success: string }>;
}) {
  const { success } = await searchParams;

  // AUTH
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const products: Product[] = await prisma.product.findMany({
    where: { userId: session.user.id },
    include: {
      category: true,
      tags: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürünlerim</h1>
        <Link
          href="/dashboard/products/create-new-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Yeni Ürün Oluştur
        </Link>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product created successfully!
        </div>
      )}

      {products?.length === 0 ? (
        <p className="text-gray-600">
          No products found. Create your first product!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product: Product) => {
            return (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
