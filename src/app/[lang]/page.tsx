import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Instagram,
  MessageSquareText,
  Shield,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { verifyCookie } from "@/actions/auth-actions";
import { getPlans } from "@/actions/plan-actions";
import Contact from "@/components/contact";
import { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { Locale } from "@/lib/i18n-config";
import FAQ from "@/components/faq";

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return {
    title: `Goodspeech | ${dict.hero.title}`,
    description: dict.hero.subtitle,
    keywords:
      "workplace communication, communication ai, slack bot, empathic communication, nonviolent communication, conflict resolution, team communication",
    openGraph: {
      title: `Goodspeech | ${dict.hero.title}`,
      description: dict.meta.ogDescription,
      type: "website",
      siteName: "Goodspeech",
      images: [
        {
          url: "https://goodspeech.chat/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Goodspeech - AI Communication Assistant",
        },
      ],
    },
    authors: [{ name: "Goodspeech Team" }],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home({ params }: Props) {
  const loggedIn = await verifyCookie();
  const plans = await getPlans();
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="py-8 md:py-28 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {dict.hero.title}
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  {dict.hero.subtitle}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild={true}
                  size="lg"
                  className="w-full min-[400px]:w-auto"
                >
                  <Link
                    href={
                      loggedIn.valid
                        ? `/${lang}/dashboard`
                        : `/${lang}/register`
                    }
                  >
                    {dict.actions.tryFree}
                    <Image
                      alt="Add to Slack"
                      height="20"
                      width="20"
                      src="/slack-icon.png"
                    />
                  </Link>
                </Button>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full min-[400px]:w-auto"
                  >
                    {dict.demo.seeDemo}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border shadow-lg">
                <Image
                  src="/talking_couple.webp"
                  priority
                  width={600}
                  height={600}
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  alt={dict.hero.imageAlt}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 bg-gray-50 dark:bg-gray-900 flex justify-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.features.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.features.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquareText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.features.realtime.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.features.realtime.description}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.features.secure.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.features.secure.description}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                {dict.features.integration.title}
              </h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {dict.features.integration.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 flex justify-center">
        <div className="container px-4 md:px-6 space-y-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.howItWorks.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.howItWorks.subtitle}
              </p>
            </div>
          </div>
          <div className="container mx-auto max-w-3xl">
            <FAQ dict={dict} />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        className="flex justify-center py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.demo.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.demo.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-8">
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-red-100 p-2">
                    <span className="text-red-600 font-bold">JD</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{dict.demo.person1}</span>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      {dict.demo.message1}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Goodspeech</span>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      {dict.demo.response1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <span className="text-blue-600 font-bold">JS</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{dict.demo.person2}</span>
                      <span className="text-xs text-gray-500">11:15 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      {dict.demo.message2}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Goodspeech</span>
                      <span className="text-xs text-gray-500">11:15 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      {dict.demo.response2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="flex justify-center py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.pricing.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.pricing.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex flex-col rounded-lg border p-6 shadow-sm ${
                  plan.recommended ? "border-primary shadow-md" : ""
                }`}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex items-baseline text-gray-900 dark:text-gray-50">
                    <span className="text-3xl font-bold">
                      {typeof plan.pricing.monthly === "number"
                        ? `$${plan.pricing.monthly}`
                        : plan.pricing.monthly}
                    </span>
                    {typeof plan.pricing.monthly === "number" && (
                      <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                        {dict.pricing.monthly}
                      </span>
                    )}
                  </div>
                  {typeof plan.pricing.monthly === "number" && (
                    <div className="flex items-baseline text-gray-900 dark:text-gray-50">
                      <span className="text-lg font-medium">
                        ${Math.round(plan.pricing.monthly * 12 * 0.8)}
                      </span>
                      <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        {dict.pricing.yearly}
                      </span>
                      <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {dict.pricing.savePercent}
                      </span>
                    </div>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li
                    key={"max-workspaces"}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>
                      {plan.limits.maxWorkspaces} Workspace
                      {plan.limits.maxWorkspaces > 1 ? "s" : ""}
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link
                    href={plan.id === "enterprise" ? "#contact" : "#signup"}
                  >
                    <Button
                      variant={plan.recommended ? "default" : "outline"}
                      className="w-full"
                    >
                      {plan.id === "enterprise"
                        ? dict.pricing.contactSales
                        : dict.pricing.getStarted}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex justify-center py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.testimonials.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.testimonials.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {dict.testimonials.items.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    width={60}
                    height={60}
                    alt={testimonial.name}
                    className="rounded-full h-12 w-12 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="mt-4 text-gray-700 dark:text-gray-300">
                  {testimonial.quote}
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="flex justify-center py-16 w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.faq.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.faq.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            {dict.faq.items.map((faq, index) => (
              <div key={index} className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </p>
                {index === 0 && (
                  <>
                    <br />
                    <ul className="space-y-4">
                      {dict.faq.workModel.map((model, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mt-0.5">
                            <svg
                              className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-slate-700 dark:text-slate-200 font-medium">
                              {model.title}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                              {model.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <br />
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-300 text-sm">
                        <span className="font-semibold">
                          {dict.faq.promise.title}
                        </span>{" "}
                        {dict.faq.promise.text}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="signup"
        className="flex justify-center py-16 bg-primary text-primary-foreground"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 items-center flex flex-col">
              <h2 className="text-3xl font-bold  tracking-tighter sm:text-4xl md:text-5xl">
                {dict.cta.title}
              </h2>
              <p className="max-w-[900px]  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {dict.cta.subtitle}
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2 mt-6 items-center flex flex-col">
              <Link
                href={`/${lang}/register`}
                className="text-md text-primary-foreground/80"
              >
                <Button className="bg-white h-10 text-primary hover:bg-gray-100">
                  {dict.cta.button}
                </Button>
              </Link>
              <p className="text-md text-primary-foreground/80 mt-2">
                {dict.cta.noCreditCard} <br />
                {dict.cta.cancelAnytime}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex justify-center py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {dict.contact.title}
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {dict.contact.subtitle}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-12">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">
                  {dict.contact.emailUs}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  contact@goodspeech.chat
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">
                  {/* {dict.contact.officeHours} */}
                  Social Media
                </h3>
                <span className="mt-2 flex">
                  <Link href="https://www.instagram.com/goodspeech.chat/" target="_blank">
                    <Instagram />
                  </Link>
                </span>
              </div>
            </div>
            <div className="rounded-lg border p-6">
              <Contact dict={dict} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
