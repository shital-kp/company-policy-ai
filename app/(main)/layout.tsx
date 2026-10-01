import "@/app/globals.scss";
import Header from "@/app/components/Header/Header";
import AuthSessionProvider from "@/app/components/SessionProvider/SessionProvider";

export default function mainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthSessionProvider>
        <Header />
        <main>
          {children}
        </main>
      </AuthSessionProvider>
    </>
  );
}