"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
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
import { useState } from "react";
import { createProduct } from "../actions";
import SortableImageItem from "./SortableImageItem";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import UploadIcon from "@/components/ui/UploadIcon";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCategories } from "../actions";
import { useEffect } from "react";
import CategorySelect from "@/components/categorySelect";
import { Switch } from "@/components/ui/switch";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CreateNewProductPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isOnSale, setIsOnSale] = useState(true);
  const [isOnShopPage, setIsOnShopPage] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag needed to start
      },
    }),
    useSensor(KeyboardSensor)
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const oversize = files.find((f) => f.size > 5 * 1024 * 1024);
    if (oversize) {
      toast.error("Her görsel 5MB veya daha küçük olmalı.");
      return;
    }
    setSelectedFiles((prev) => {
      const names = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...files.filter((f) => !names.has(f.name + f.size))];
    });
  }

  function handleRemoveFile(idx: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedFiles((items) => {
        const oldIndex = items.findIndex(
          (file) => (file.name + file.size).toString() === active.id
        );
        const newIndex = items.findIndex(
          (file) => (file.name + file.size).toString() === over.id
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryId) {
      toast.error("Lütfen bir kategori seçin.");
      return;
    }

    const form = new FormData(event.currentTarget);
    form.append("categoryId", categoryId);
    form.append("isOnSale", isOnSale ? "on" : "off");
    form.append("isOnShopPage", isOnShopPage ? "on" : "off");

    if (selectedFiles.length === 0) {
      toast.error("En az bir görsel eklemelisiniz.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      toast.error("Birşeyler ters gitti.");
      return;
    }
    const urls: string[] = [];
    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Her görsel 5MB veya daha küçük olmalı.");
        return;
      }
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("folder", "products");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const json = await res.json();
        if (!json.secure_url)
          throw new Error(json.error?.message || "Cloudinary upload failed");
        urls.push(json.secure_url);
      } catch (err: any) {
        toast.error(err.message || "Cloudinary upload error");
        return;
      }
    }
    urls.forEach((url) => form.append("imageUrls", url));
    try {
      const result = await createProduct(form);
      if (result?.slug) {
        router.push(`/dashboard/products/${result.slug}`);
        toast.success("Ürün başarıyla oluşturuldu!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create product"
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/products">
                Ürünler
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Yeni ürün oluştur</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex gap-4 w-full h-full">
          <div className="w-1/2 h-full">
            <div className="h-full bg-white w-full rounded-lg shadow-md p-2 aspect-square overflow-y-auto">
              {selectedFiles.length === 0 ? (
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
                    items={selectedFiles.map((f) =>
                      (f.name + f.size).toString()
                    )}
                    strategy={rectSortingStrategy}
                  >
                    <div className="w-full mt-1 grid grid-cols-3 gap-2 overflow-x-hidden overflow-y-auto">
                      {selectedFiles.map((file, idx) => (
                        <SortableImageItem
                          key={file.name + file.size}
                          id={(file.name + file.size).toString()}
                          file={file}
                          index={idx}
                          onRemove={() => handleRemoveFile(idx)}
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
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                placeholder="Product title"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                required
                placeholder="Product description"
              />
            </div>
            <div>
              <CategorySelect value={categoryId} onChange={setCategoryId} />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                name="price"
                required
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Fixed Price</Label>
              <Input
                type="number"
                step="0.01"
                name="fixed_price"
                placeholder="0.00"
                min="0"
                // required kaldırıldı
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <Input type="number" name="stock" required placeholder="0" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isOnSale}
                onCheckedChange={setIsOnSale}
                id="isOnSale"
              />
              <label
                htmlFor="isOnSale"
                className="text-sm font-medium text-gray-700"
              >
                On Sale
              </label>
            </div>
            {/*
            <div className="flex items-center space-x-2">
              <Switch
                checked={isOnShopPage}
                onCheckedChange={setIsOnShopPage}
                id="isOnShopPage"
              />
              <label
                htmlFor="isOnShopPage"
                className="text-sm font-medium text-gray-700"
              >
                Show on Shop Page
              </label>
            </div>
            */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner className="mr-2" />}
                {isLoading ? "Oluşturuluyor..." : "Ürünü oluştur"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
