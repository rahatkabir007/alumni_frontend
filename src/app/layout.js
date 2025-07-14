import { Figtree } from "next/font/google";
import "@/styles/globals.css";
import StoreProvider from "../redux/StoreProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { Suspense } from "react";
import AppWrapper from "@/components/shared/AppWrapper";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Alumni Network",
  description: "A web application for alumni networking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
        <StoreProvider>
          <AntdRegistry>
            <Suspense>
              <AppWrapper>{children}</AppWrapper>
            </Suspense>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
