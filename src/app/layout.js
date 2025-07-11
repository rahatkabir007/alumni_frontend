import { Figtree } from "next/font/google";
import "@/styles/globals.css";
import StoreProvider from "./redux/StoreProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Framtonic",
  description: "A web application for managing frames and documents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} antialiased`}
      >
        <header>
          {/* <Header /> */}
        </header>
        <main className="">
          <StoreProvider>
            <AntdRegistry>{children}</AntdRegistry>
          </StoreProvider>
        </main>
        <footer className="mt-auto">
          {/* <Footer /> */}
        </footer>
      </body>
    </html>
  );
}
