"use client";
import { useCallback, useEffect, useState } from "react";

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [categories, setCategories] = useState([]);

  const loadCategories = useCallback(async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
    return data;
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <select
      id="category"
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-gray-900 rounded-md border-[1.5px] border-gray-400 bg-transparent w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {categories.map((category: any) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
