import ProductCard from "@/components/product/product-card";
import { CustomLink } from "@/components/ui/custom-link";
import { getUserProducts } from "./actions";
import { Product } from "./types";

export default async function ProductsPage() {
  const products = await getUserProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ürünlerim</h1>
        <CustomLink href="/dashboard/products/create-new-product">
          Yeni Ürün Oluştur
        </CustomLink>
      </div>

      {products?.length === 0 ? (
        <p className="text-gray-600">
          No products found. Create your first product!
        </p>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-600 text-md font-medium">
            {products?.length} adet ürün var.
          </p>

          <div className="space-y-3">
            {products?.map((product: Product) => {
              return (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
