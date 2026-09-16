import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskMarket | هر کاری داری، فقط بگو",
  description: "بازار هوشمند انجام کارها و پیدا کردن متخصص مناسب",
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
