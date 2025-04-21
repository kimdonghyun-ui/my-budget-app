import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header showBackButton />
      <div className="pt-16">{children}</div>
    </>
  );
}
