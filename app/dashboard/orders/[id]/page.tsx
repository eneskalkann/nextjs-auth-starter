import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PaymentStatusBadge } from "@/components/ui/PaymentStatusBadge";
import Image from "next/image";
import Link from "next/link";
import { getOrderById } from "../actions";
import OrderStatusDropdown from "./OrderStatusDropdown";

type Params = Promise<{ id: string }>;

export default async function OrderDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  const shipping =
    typeof order?.shippingAddress === "object" &&
    order?.shippingAddress !== null
      ? (order.shippingAddress as {
          address?: string;
          city?: string;
          zipCode?: string;
        })
      : {};

  if (!order) {
    return <div>Sipariş bulunamadı</div>;
  }
  console.log(order);
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
              <BreadcrumbPage>{order.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-2xl font-bold mb-4">Sipariş Detayı</h1>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Müşteri Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-medium">Ad Soyad:</span> {order.user?.name}
            </p>
            <p>
              <span className="font-medium">E-posta:</span> {order.user?.email}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Sipariş Tarihi:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Toplam Tutar:</span>{" "}
              {order.totalPrice} ₺
            </p>
            <div>
              <span className="font-medium">Ödeme Durumu:</span>{" "}
              <PaymentStatusBadge paymentStatus={order.paymentStatus} />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Sipariş Durumu:</span>
              <OrderStatusDropdown orderId={order.id} status={order.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-xl font-semibold mb-4 mt-8">Alıcı Bilgileri</div>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-medium">Ad Soyad:</span>{" "}
              {order?.customerName}
            </p>
            <p>
              <span className="font-medium">E-posta:</span>{" "}
              {order?.customerEmail}
            </p>
            <p>
              <span className="font-medium">Telefon:</span>{" "}
              {order?.customerPhone}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Kargo Adresi:</span>{" "}
              {shipping.address}, {shipping.city}, {shipping.zipCode}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sipariş</h2>
        <div className="space-y-4">
          {order.items?.map((item: any) => (
            <Link
              href={`/dashboard/products/${item.product?.slug}`}
              key={item.id}
              className="flex items-center border-b pb-4"
            >
              <Image
                src={item.product?.images[0]?.url || "/placeholder-product.jpg"}
                alt={item.product?.title}
                width={100}
                className="rounded-md object-cover"
                height={100}
              />
              <div className="flex-1 pl-3">
                <h3 className="font-medium">
                  {item.product?.title || "Ürün adı belirtilmemiş"}
                </h3>
                <p>Adet: {item.quantity}</p>
                <p>Birim Fiyat: {item.price} ₺</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)} ₺
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
