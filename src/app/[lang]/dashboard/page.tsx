import { getDictionary } from "@/lib/i18n";
import Dashboard from "./dashboard-client";
import { Locale } from "@/lib/i18n-config";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return <Dashboard dict={dict} />;
}
