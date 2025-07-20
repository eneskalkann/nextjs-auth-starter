import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
