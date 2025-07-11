"use client";
import { use, useEffect, useState } from "react";
import { getOrderById, markOrderAsRead } from "../actions";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useNewOrder } from "@/lib/context/NewOrderContext";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setNewOrdersCount, newOrdersCount } = useNewOrder();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const order = await getOrderById(id);

        if (!order) {
          throw new Error("order not found");
        }

        setOrder(order);
      } catch (err) {
        console.error("Siparişler yüklenirken hata oluştu:", err);
        setError("Siparişler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await markOrderAsRead(id);
        setNewOrdersCount(Math.max(0, newOrdersCount - 1));
      } catch (e) {
        console.error("Order isNew güncellenirken hata:", e);
      }
    };
    markAsRead();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner /> <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div>Sipariş bulunamadı</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-2 font-semibold text-black"
        >
          <ArrowLeft /> Siparişlere geri dön
        </Link>
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
            <p>
              <span className="font-medium">Ödeme Durumu:</span>{" "}
              {order.paymentStatus}
            </p>
            <p>
              <span className="font-medium">Durum:</span> {order.status}
            </p>
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
              {order?.shippingAddress?.address}, {order?.shippingAddress?.city},{" "}
              {order?.shippingAddress?.zipCode}
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
