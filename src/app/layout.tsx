import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import SmoothScroll from "@/components/layout/SmoothScroll";

export const metadata = {
  title: "Tezco | Technical Experts",
  description: "Engineering ideas into reality. SaaS, Web, and App development specialists.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  // --- ADD THIS SECTION ---
  icons: {
    icon: "/tezco-logo.png", // Points to public/tezco-logo.png
    shortcut: "/tezco-logo.png",
    apple: "/tezco-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#050505] text-white antialiased selection:bg-blue-600 selection:text-white">
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}