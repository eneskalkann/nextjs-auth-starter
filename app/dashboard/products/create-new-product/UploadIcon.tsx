import { Upload } from "lucide-react";
import React from "react";

export default function UploadIcon({ className = "w-10 h-10 text-blue-500" }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Upload className={className} />
      <span className="text-xs text-gray-600 mt-2"></span>
    </div>
  );
}
