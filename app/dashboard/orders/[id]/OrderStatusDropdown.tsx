"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { updateOrderStatusAction } from "../actions";

const STATUS_OPTIONS = [
  {
    value: "processing",
    label: "İşleniyor",
    color:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all",
  },
  {
    value: "preparing",
    label: "Hazırlanıyor",
    color:
      "bg-blue-100 text-blue-800 hover:bg-blue-50 hover:text-blue-700 transition-all",
  },
  {
    value: "shipping",
    label: "Kargoda",
    color:
      "bg-orange-100 text-orange-800 hover:bg-orange-50 hover:text-orange-700 transition-all",
  },
  {
    value: "delivered",
    label: "Teslim Edildi",
    color:
      "bg-green-100 text-green-800 hover:bg-green-50 hover:text-green-700 transition-all",
  },
];

type Props = {
  orderId: string;
  status: string;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" type="submit" disabled={pending}>
      {pending ? "Kaydediliyor..." : "Kaydet"}
    </Button>
  );
}

export default function OrderStatusDropdown({ orderId, status }: Props) {
  const [selectedStatus, setSelectedStatus] = useState(status ?? "");
  const [showSave, setShowSave] = useState(false);
  const [formState, formAction] = React.useActionState(
    updateOrderStatusAction.bind(null, orderId),
    { status }
  );

  useEffect(() => {
    if (formState.status !== status) {
      setShowSave(false);
    }
  }, [formState.status, status]);

  const handleSelect = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setShowSave(newStatus !== status);
  };

  return (
    <form action={formAction} className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button">
            <Badge
              className={
                STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.color ||
                "bg-yellow-100 text-yellow-800"
              }
            >
              {STATUS_OPTIONS.find((s) => s.value === selectedStatus)?.label ||
                "İşleniyor"}
            </Badge>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuItem asChild key={opt.value}>
              <button
                type="button"
                onClick={() => handleSelect(opt.value)}
                className="w-full flex items-center gap-2 bg-transparent cursor-pointer border-0 outline-none"
                style={{ background: "none" }}
              >
                <Badge className={opt.color}>{opt.label}</Badge>
                {selectedStatus === opt.value && (
                  <span className="ml-2 text-xs">(Seçili)</span>
                )}
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <input type="hidden" name="status" value={selectedStatus || ""} />
      {showSave && <SaveButton />}
    </form>
  );
}
