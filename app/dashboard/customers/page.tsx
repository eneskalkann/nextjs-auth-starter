import { authOptions } from "@/auth";
import { CustomLink } from "@/components/ui/custom-link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { Customer } from "@/types/types";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getCustomers } from "./actions";

const CustomersPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const customers = await getCustomers();
  type CustomerWithOrders = (typeof customers)[number] & {
    orders?: { id: string; createdAt: string }[];
  };
  const customersTyped = customers as CustomerWithOrders[];

  function generateCustomerSlug(name: string, id: string) {
    return `${slugify(name)}-${id}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Müşteriler</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Müşteri</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sipariş Sayısı</TableHead>
              <TableHead>Son Sipariş</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customersTyped.length > 0 ? (
              customersTyped.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.name || "-"}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orders?.length ?? 0}</TableCell>
                  <TableCell>
                    {customer.orders && customer.orders[0]
                      ? format(
                          new Date(customer.orders[0].createdAt),
                          "dd MMM yyyy HH:mm",
                          { locale: tr }
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <CustomLink
                      href={`/dashboard/customers/${generateCustomerSlug(
                        customer.name || "",
                        customer.id
                      )}?vintemo`}
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
                  Henüz müşteri bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomersPage;
