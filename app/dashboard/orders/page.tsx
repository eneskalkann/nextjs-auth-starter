import { getOrders } from "./actions";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusBadge } from "@/components/ui/PaymentStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CustomLink } from "@/components/ui/custom-link";

type Order = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  billingAddress: any;
  createdAt: string;
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      title: string;
    };
  }>;
};

export default async function OrdersPage() {
  const { data, error } = await getOrders();
  const orders =
    data && Array.isArray(data)
      ? data.map((order: any) => ({
          ...order,
          orderNumber: `${String(order.id).padStart(6, "0")}`,
          customerName: order.user?.name || "Misafir Müşteri",
          customerEmail: order.user?.email || "guest@example.com",
          items: order.items || [],
        }))
      : [];

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Siparişler</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Ürünler</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Ödeme</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="text-sm">
                          {item.quantity}x{" "}
                          {item.product?.title || "Ürün adı yok"}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{order.totalPrice.toFixed(2)} ₺</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge paymentStatus={order.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "dd MMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <CustomLink href={`/dashboard/orders/${order.id}`}>
                      Detay
                    </CustomLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  Henüz sipariş bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, string> = {
    processing: "İşleniyor",
    preparing: "Hazırlanıyor",
    shipping: "Kargoda",
    delivered: "Teslim Edildi",
    completed: "Tamamlandı",
    cancelled: "İptal Edildi",
    pending: "Beklemede",
    paid: "Ödendi",
  };
  const colorMap: Record<string, string> = {
    processing:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-700 transition-all",
    preparing:
      "bg-blue-100 text-blue-800 hover:bg-blue-50 hover:text-blue-700 transition-all",
    shipping:
      "bg-orange-100 text-orange-800 hover:bg-orange-50 hover:text-orange-700 transition-all",
    delivered:
      "bg-green-100 text-green-800 hover:bg-green-50 hover:text-green-700 transition-all",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
  };
  return (
    <Badge className={`${colorMap[status] || "bg-gray-100 text-gray-800"}`}>
      {statusMap[status] || status}
    </Badge>
  );
}
