import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskMarket",
  description: "هر کاری داری، فقط بگو.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
