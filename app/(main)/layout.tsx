import "@/app/globals.scss";
import Header from "@/app/components/Header/Header";

export default function mainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}