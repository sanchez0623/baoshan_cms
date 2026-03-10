import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import { getSettingsMap } from "@/lib/cms-data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsMap = await getSettingsMap();

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settingsMap} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settingsMap} />
    </div>
  );
}
