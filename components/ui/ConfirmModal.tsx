import React from "react";
import Button from "./button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Evet",
  cancelText = "İptal",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2 text-black">{title}</h2>
        {description && (
          <p className="mb-4 text-gray-900 text-lg font-semibold">
            {description}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant="tertiary"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
