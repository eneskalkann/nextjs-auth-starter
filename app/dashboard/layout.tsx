// app/layout.tsx
import Header from "../../components/header";
import "../globals.css";

export const metadata = {
  title: "Vintemo",
  description: "ecom",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 w-full overflow-hidden bg-black">
          <div className="min-h-screen flex overflow-hidden min-w-full">
            <div className="w-[20vw] bg-transparent">
            <Header />
            </div>
            <div className="flex-1 bg-white rounded-xl m-10 overflow-x-hidden overflow-y-auto max-h-[calc(100vh-80px)] w-[80vw]">{children}</div>
          </div>
    </div>
  );
}
