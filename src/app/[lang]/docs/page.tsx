import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, MessageSquare, RefreshCw } from "lucide-react";
import { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/i18n";
import FAQ from "@/components/faq";
import { i18n } from "@/lib/i18n-config";

type Props = {
  params: { lang: Locale };
};

// Add metadata generation for canonical URLs
export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const baseUrl = "https://goodspeech.chat";
  const canonicalUrl = `${baseUrl}/${lang}/docs`;

  // Create language alternatives for this page
  const languages: Record<string, string> = {};
  i18n.locales.forEach((locale) => {
    languages[locale] = `${baseUrl}/${locale}/docs`;
  });

  return {
    title: dict.docs.metadata.title,
    description: dict.docs.metadata.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default async function Documentation({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-1">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="h-16 w-16 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {dict.docs.title}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            {dict.docs.subtitle}
          </p>
        </div>

        <Tabs defaultValue="install" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="install">
              {dict.docs.install.tabTitle}
            </TabsTrigger>
            <TabsTrigger value="usage">{dict.docs.usage.tabTitle}</TabsTrigger>
          </TabsList>

          <TabsContent value="install">
            <Card>
              <CardHeader>
                <CardTitle>{dict.docs.install.title}</CardTitle>
                <CardDescription>
                  {dict.docs.install.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">1</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {dict.docs.install.step1.title}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {dict.docs.install.step1.description}
                      </p>
                      <Button
                        size="sm"
                        className="w-full min-[400px]:w-auto mt-2"
                      >
                        <Image
                          alt="Add to Slack"
                          height="16"
                          width="16"
                          src="/slack-icon.png"
                        />
                        {dict.docs.install.addToSlack}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {dict.docs.install.step2.title}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {dict.docs.install.step2.description}
                      </p>
                    </div>
                  </div>

                  {/* Continue with steps 3-5 following the same pattern */}
                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {dict.docs.install.step3.title}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {dict.docs.install.step3.description}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {dict.docs.install.step4.title}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {dict.docs.install.step4.description}
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {dict.docs.install.step5.title}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {dict.docs.install.step5.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">
                      {dict.docs.install.complete.title}
                    </h3>
                  </div>
                  <p className="text-emerald-700">
                    {dict.docs.install.complete.description}
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-center">
                  {dict.faq.title}
                </h2>
                <section
                  id="how-it-works"
                  className="flex justify-center items-center"
                >
                  <div className="w-full">
                    <FAQ dict={dict} />
                  </div>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>{dict.docs.usage.title}</CardTitle>
                <CardDescription>{dict.docs.usage.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      {dict.docs.usage.features.title}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{dict.docs.usage.features.feature1}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{dict.docs.usage.features.feature2}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{dict.docs.usage.features.feature3}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{dict.docs.usage.features.feature4}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      {dict.docs.usage.howTo.title}
                    </h3>
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">1</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            {dict.docs.usage.howTo.step1.title}
                          </h4>
                          <p className="text-slate-600 mt-1">
                            {dict.docs.usage.howTo.step1.description
                              .split("/nvc")
                              .map((part, i, arr) =>
                                i < arr.length - 1 ? (
                                  <span key={i}>
                                    {part}
                                    <code className="bg-slate-100 px-2 py-1 rounded">
                                      /nvc
                                    </code>
                                  </span>
                                ) : (
                                  part
                                ),
                              )}
                          </p>
                          <div className="mt-2 bg-slate-100 p-3 rounded-md">
                            <code>/nvc why is this ticket still empty</code>
                          </div>
                        </div>
                      </div>

                      {/* Steps 2-4 */}
                      {/* Step 2 */}
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">2</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            {dict.docs.usage.howTo.step2.title}
                          </h4>
                          <p className="text-slate-600 mt-1">
                            {dict.docs.usage.howTo.step2.description}
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">3</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            {dict.docs.usage.howTo.step3.title}
                          </h4>
                          <p className="text-slate-600 mt-1">
                            {dict.docs.usage.howTo.step3.description}
                          </p>
                          <div className="mt-3 flex">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              {dict.docs.usage.example.regenerate}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">4</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            {dict.docs.usage.howTo.step4.title}
                          </h4>
                          <p className="text-slate-600 mt-1">
                            {dict.docs.usage.howTo.step4.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      {dict.docs.usage.example.title}
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-slate-800 text-white p-3 text-sm">
                        {dict.docs.usage.example.slackTitle}
                      </div>
                      <div className="p-4">
                        <Image
                          src="/example.webp"
                          alt="GoodSpeech Bot in action showing a suggestion for a more empathic message"
                          width={800}
                          height={400}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      {dict.docs.usage.example.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
