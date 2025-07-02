import { Product } from "@/app/dashboard/products/types";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  console.log(product);
  return (
    <Link
      href={`/dashboard/products/${product.slug}`}
      className="flex flex-col w-full h-full relative text-black"
    >
      <div className="aspect-square w-full h-full relative">
        <div className="absolute left-2 top-2 z-50">
          {product.stock === 0 ? (
            <span className="bg-gray-200 text-xs text-gray-500 px-1 py-1 rounded font-semibold">
              Sold Out
            </span>
          ) : product.isOnSale === true ? (
            <span className="bg-gray-200 text-xs text-red-500 px-1 py-1 rounded font-semibold">
              On Sale
            </span>
          ) : (
            ""
          )}
        </div>
        <Image
          src={product.images?.[0].url ?? ""}
          alt={product.title}
          fill
          className="object-cover rounded-lg hover:rounded-2xl transition-all duration-500"
        />
      </div>
      <h2 className="text-lg font-bold">{product.title}</h2>
      {product.fixed_price ? (
        <p>₺{product.fixed_price}</p>
      ) : (
        <p>₺{product.price}</p>
      )}
    </Link>
  );
}
