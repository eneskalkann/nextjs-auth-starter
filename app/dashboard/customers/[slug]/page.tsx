import { CustomLink } from "@/components/ui/custom-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderItem } from "@/types/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getCustomerDetail } from "../actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Params = Promise<{ slug: string }>;
export default async function CustomerDetailPage({
  params,
}: {
  params: Params;
}) {
  // Slug'dan id'yi çöz
  const { slug } = await params;
  const id = slug.split("-").slice(-1)[0];

  const { customer, orders } = await getCustomerDetail(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/orders">
                Siparişler
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{customer?.name || "-"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-2xl font-bold mb-4">Müşteri Detayı</h1>
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <div>
          <span className="font-semibold">Adı:</span> {customer?.name || "-"}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {customer?.email}
        </div>
        <div>
          <span className="font-semibold">Toplam Sipariş:</span> {orders.length}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Siparişler</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Ürünler</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {String(order.id).padStart(6, "0")}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {/* order.items may not exist on type, so fallback gracefully */}
                      {Array.isArray((order as any).items) ? (
                        (order as any).items.map((item: any) => (
                          <div key={item.id} className="text-sm">
                            {item.quantity}x{" "}
                            {item.product?.title || "Ürün adı yok"}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Ürün bilgisi yok
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{order.totalPrice.toFixed(2)} ₺</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "dd MMM yyyy HH:mm", {
                      locale: tr,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <CustomLink
                      href={`/dashboard/orders/${order.id}`}
                      size="sm"
                    >
                      Detay
                    </CustomLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
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
