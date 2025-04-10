import { CheckCircle } from "lucide-react";
import Contact from "@/components/contact";
import { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { Locale } from "@/lib/i18n-config";

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return {
    title: `Goodspeech | ${dict.enterprise.title}`,
    description: dict.enterprise.description,
    keywords: "enterprise solutions, workplace communication, contact, inquiry",
  };
}

export default async function EnterpriseContact({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      {/* Hero Section */}
      <section className="py-8 md:py-28 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {dict.enterprise.heroTitle}
            </h1>
            <p className="mt-4 max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              {dict.enterprise.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            {dict.enterprise.benefitsTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.enterprise.benefit1.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.enterprise.benefit1.description}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.enterprise.benefit2.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.enterprise.benefit2.description}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.enterprise.benefit3.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.enterprise.benefit3.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex justify-center items-center py-16">
        <div className="container px-4 md:px-6 max-w-2xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold">
              {dict.enterprise.contactTitle}
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl dark:text-gray-400">
              {dict.enterprise.contactSubtitle}
            </p>
          </div>
          <div className="mx-auto mt-12 rounded-lg border p-6">
            <Contact dict={dict} />
          </div>
        </div>
      </section>
    </>
  );
}
