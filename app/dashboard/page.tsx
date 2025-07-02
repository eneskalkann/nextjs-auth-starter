import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        redirect("/login");
      }
  return <div className="text-black">Dashboard</div>;
}