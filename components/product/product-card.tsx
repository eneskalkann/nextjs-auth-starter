import { Product } from "@/app/dashboard/products/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/dashboard/products/${product.slug}`}
      className="flex flex-col w-full h-full relative group text-black px-4 py-3 bg-white border-gray-300 hover:border-gray-400 transition-all border-[1.5px] rounded-lg"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 aspect-square relative">
            <Image
              src={product.images?.[0].url ?? ""}
              alt={product.title}
              fill
              sizes="10vw"
              className="object-cover rounded-md"
            />
          </div>
          <div className="block space-y-2">
            <h2 className="text-lg font-semibold">{product.title}</h2>

            {product.fixed_price ? (
              <p>{product.fixed_price}₺</p>
            ) : (
              <p>{product.price}₺</p>
            )}
          </div>
        </div>
        <div className=" -translate-x-2 group-hover:translate-x-0 transition-all">
          <ChevronRight />
        </div>
      </div>
      {/* <div className="aspect-square w-full h-full relative">
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
      )} */}
    </Link>
  );
}
