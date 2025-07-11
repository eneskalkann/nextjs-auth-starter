"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Spinner from "@/components/ui/Spinner";
import UploadIcon from "@/components/ui/UploadIcon";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteProduct, updateProduct } from "../actions";
import SortableImageItem from "../create-new-product/SortableImageItem";
import { Product } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import CategorySelect from "@/components/categorySelect";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]); // {id, url} veya {file}
  const [deletedImages, setDeletedImages] = useState<any[]>([]); // {id, url}
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const loadProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to load product");
      }
      const data = await response.json();
      setProduct(data);
      setImages(
        (data.images || []).map((img: any) => ({ id: img.id, url: img.url }))
      );
      setDeletedImages([]);
      setCategoryId(data.categories?.[0]?.id ? String(data.categories[0].id) : "");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    }
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const oversize = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversize) {
      toast.error("Her görsel 5MB veya daha küçük olmalı.");
      return;
    }
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        id: `new-${file.name}-${file.size}`,
        isNew: true,
      })),
    ]);
    setIsDirty(true);
  }

  function handleRemoveImage(idx: number) {
    setImages((prev) => {
      const img = prev[idx];
      if (img.id && !img.isNew) {
        setDeletedImages((del) => [...del, img]);
      }
      return prev.filter((_, i) => i !== idx);
    });
    setIsDirty(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((img) => img.id === active.id);
        const newIndex = items.findIndex((img) => img.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setIsDirty(true);
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 font-semibold text-black"
        >
          <ArrowLeft /> Back to Products
        </Link>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title={`"${product?.title}" isimli ürünü silmek üzeresiniz!`}
        description="Bu işlemi geri alamazsınız. Emin misiniz?"
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          setShowDeleteModal(false);
          try {
            await deleteProduct(slug);
            toast.success("Ürün başarıyla silindi!");
            router.push("/dashboard/products");
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Ürün silinemedi!"
            );
          }
        }}
      />

      <div className="">
        <h1 className="text-3xl font-bold mb-6 text-black">{product?.title}</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            // Zorunlu alan kontrolleri
            const form = e.currentTarget as HTMLFormElement;
            const title = (
              form.elements.namedItem("title") as HTMLInputElement
            )?.value.trim();
            const price = (form.elements.namedItem("price") as HTMLInputElement)
              ?.value;
            const fixed_price = (
              form.elements.namedItem("fixed_price") as HTMLInputElement
            )?.value;
            const stock = (form.elements.namedItem("stock") as HTMLInputElement)
              ?.value;
            if (!title || !price || !fixed_price || !stock) {
              toast.error("Lütfen tüm zorunlu alanları doldurun.");
              return;
            }
            if (images.length === 0) {
              toast.error("En az bir görsel eklemelisiniz.");
              return;
            }
            if (!categoryId) {
              toast.error("Lütfen bir kategori seçin.");
              return;
            }
            setIsLoading(true);
            const formData = new FormData(form);
            formData.append("categoryId", categoryId);
            formData.append(
              "imageOrder",
              JSON.stringify(images.map((img) => img.id))
            );
            formData.append(
              "deletedImages",
              JSON.stringify(deletedImages.map((img) => img.id))
            );
            images.forEach((img) => {
              if (img.isNew && img.file) {
                formData.append("newImages", img.file);
              }
            });
            try {
              await updateProduct(slug, formData);
              toast.success("Ürün başarıyla güncellendi!");
              loadProduct();
              setIsDirty(false);
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Failed to update product"
              );
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <div className="flex gap-4 w-full h-full">
            <div className="w-1/2 h-full">
              <div className="h-full bg-white w-full rounded-lg shadow-md p-2 aspect-square overflow-y-auto">
                {images.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <label
                      htmlFor="product-images"
                      className="w-full cursor-pointer flex flex-col items-center justify-center h-48 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition mb-4"
                    >
                      <UploadIcon className="w-12 h-12 text-blue-400" />
                      <span className="mt-2 text-gray-600 text-sm">
                        Henüz dosya seçmediniz
                      </span>
                      <input
                        id="product-images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="w-full mt-1 grid grid-cols-3 gap-2 overflow-x-hidden overflow-y-auto">
                        {images.map((img, idx) => (
                          <SortableImageItem
                            key={img.id}
                            id={img.id}
                            file={img.file}
                            url={img.url}
                            index={idx}
                            onRemove={() => handleRemoveImage(idx)}
                          />
                        ))}
                        <label
                          htmlFor="product-images"
                          className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition relative"
                        >
                          <UploadIcon className="w-8 h-8 text-blue-400" />
                          <input
                            id="product-images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Images (max 5MB each)
              </label>
            </div>
            <div className="flex-1 flex flex-col gap-4 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  defaultValue={product.title}
                  required
                  onChange={() => setIsDirty(true)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  maxLength={200}
                  defaultValue={product.description || ""}
                  required
                  onChange={() => setIsDirty(true)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Category
                </label>
                <CategorySelect
                  value={categoryId}
                  onChange={(val) => {
                    setCategoryId(val);
                    setIsDirty(true);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={product.price}
                  required
                  onChange={() => setIsDirty(true)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fixed Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  name="fixed_price"
                  defaultValue={product.fixed_price}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={() => setIsDirty(true)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <Input
                  type="number"
                  name="stock"
                  defaultValue={product.stock}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={() => setIsDirty(true)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isOnSale"
                  defaultChecked={product.isOnSale}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={() => setIsDirty(true)}
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
                  onChange={() => setIsDirty(true)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Show on Shop Page
                </label>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Sil
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[140px]"
                  disabled={!isDirty || isLoading}
                >
                  {isLoading ? (
                    <Spinner className="h-5 w-5 text-white mr-2" />
                  ) : null}
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
