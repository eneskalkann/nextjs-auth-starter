"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { deleteProduct, updateProduct } from "../actions";
import { Product } from "../types";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const loadProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to load product");
      }
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    }
  }, [slug]);

  // Load product only once when component mounts
  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product updated successfully!
        </div>
      )}

      {/* Product images always shown */}
      {product.images && product.images.length > 0 && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {product.images.map((img: { url: string }, idx: number) => (
            <Image
              key={img.url}
              src={img.url}
              alt={`Product image ${idx + 1}`}
              width={300}
              height={300}
              className="object-cover rounded aspect-square"
            />
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">{product.title}</h1>

        {isEditing ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                await updateProduct(formData);
                loadProduct();
                setIsEditing(false);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "Failed to update product"
                );
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={product.title}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={product.description || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={product.price}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fixed Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="fixed_price"
                  defaultValue={product.fixed_price}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={product.stock}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isOnSale"
                  defaultChecked={product.isOnSale}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  On Sale
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isOnShopPage"
                  defaultChecked={product.isOnShopPage}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Show on Shop Page
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-600">{product.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">${product.price}</p>
                {product.isOnSale && (
                  <span className="text-sm text-red-500">On Sale!</span>
                )}
                {product.isOnShopPage && (
                  <span className="text-sm text-green-500">
                    Show on Shop Page
                  </span>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      await deleteProduct(slug);
                    } catch (err) {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Failed to delete product"
                      );
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
