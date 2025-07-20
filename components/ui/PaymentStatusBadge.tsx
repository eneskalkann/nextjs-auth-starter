import { Badge } from "./badge";

export function PaymentStatusBadge({
  paymentStatus,
}: {
  paymentStatus: string;
}) {
  let label = paymentStatus;
  let className = "bg-gray-100 text-gray-800 hover:bg-gray-200";
  if (paymentStatus === "odendi" || paymentStatus === "paid") {
    label = "Ödendi";
    className = "bg-green-100 text-green-800 hover:bg-green-50";
  } else if (paymentStatus === "basarisiz" || paymentStatus === "failed") {
    label = "Başarısız";
    className = "bg-red-100 text-red-800 hover:bg-red-50";
  } else if (
    paymentStatus === "iptal edildi" ||
    paymentStatus === "cancelled"
  ) {
    label = "İptal Edildi";
    className = "bg-black text-white hover:bg-gray-800";
  }
  return <Badge className={className}>{label}</Badge>;
}
