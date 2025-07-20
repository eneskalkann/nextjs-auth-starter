"use client";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CategorySelect({
  value,
  onChange,
  label = "Select Category",
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      const cats = await res.json();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Kategori seçin" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
