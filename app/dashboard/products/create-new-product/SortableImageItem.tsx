"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import RemoveImageButton from "./RemoveImageButton";

interface SortableImageItemProps {
  file: File;
  id: string;
  index: number;
  onRemove: () => void;
}

export default function SortableImageItem({ file, id, index, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm touch-none"
    >
      <div className="absolute top-2 left-2 bg-black bg-gray-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-10">
        {index + 1}
      </div>
      <Image
        src={URL.createObjectURL(file)}
        alt={file.name}
        width={100}
        height={100}
        className="object-cover w-full h-full"
        unoptimized
      />
      <RemoveImageButton onClick={onRemove} />
    </div>
  );
}
