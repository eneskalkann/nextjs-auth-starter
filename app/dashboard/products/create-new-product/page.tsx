"use client";

import { useState } from "react";
import Link from "next/link";
import { createProduct } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import UploadIcon from "./UploadIcon";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImageItem from "./SortableImageItem";

export default function CreateNewProductPage() {
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
      setError("Each image must be 5MB or smaller");
      return;
    }
    setError(null);
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
    setError(null);
    const form = new FormData(event.currentTarget);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary ayarları eksik");
      return;
    }
    const urls: string[] = [];
    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be 5MB or smaller");
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
        setError(err.message || "Cloudinary upload error");
        return;
      }
    }
    urls.forEach((url) => form.append("imageUrls", url));
    try {
      await createProduct(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  }

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

      <div className="mx-auto w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
                      required
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
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Product title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                name="description"
                required
                maxLength={200}
                placeholder="Product description"
                showCharacterCount={true}
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
                required
                placeholder="0.00"
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
                required
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <Input type="number" name="stock" required placeholder="0" />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isOnSale"
                className="rounded border-gray-400 text-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                On Sale
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isOnShopPage"
                className="rounded border-gray-400 text-blue-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Show on Shop Page
              </label>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Product
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
