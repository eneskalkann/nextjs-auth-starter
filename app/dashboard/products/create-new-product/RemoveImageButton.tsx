import { X } from "lucide-react";
import React from "react";

export default function RemoveImageButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 hover:text-red-600 transition"
      title="Resmi kaldır"
    >
      <X size={18} />
    </button>
  );
}
