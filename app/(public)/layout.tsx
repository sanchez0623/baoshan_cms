import { createClient } from "@/lib/supabase/server";
import type { SiteSetting } from "@/types";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .returns<SiteSetting[]>();

  const settingsMap = (settings || []).reduce(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {} as Record<string, string | null>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settingsMap} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settingsMap} />
    </div>
  );
}
