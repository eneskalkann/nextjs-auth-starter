// app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import GlobalSpinnerWrapper from "../components/GlobalSpinnerWrapper";

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
    <html lang="en">
      <body className="">
        <Providers>
          <GlobalSpinnerWrapper />
          <div>
            <main className="w-full flex items-center justify-center h-full">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
