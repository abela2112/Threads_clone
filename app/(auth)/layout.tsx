import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "../globals.css"; // Ensure your global styles are imported
import { Suspense } from "react";
import Loading from "./Loading";

export const metadata = {
  title: "Auth",
  description: "Generated by create next app",
};
const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <Suspense fallback={<Loading />}>
            <div className="w-full flex justify-center min-h-screen items-center">
              {children}
            </div>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
