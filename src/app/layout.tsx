import "./globals.css";
export const metadata = { title: "Silk Road Horizons | Uzbekistan Tourism" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="uz"><body>{children}</body></html>;
}