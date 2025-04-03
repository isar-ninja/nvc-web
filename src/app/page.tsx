import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquareText, Shield, Zap } from "lucide-react";
import Image from "next/image";
import { verifyCookie } from "@/actions/auth-actions";
import { getPlans } from "@/actions/plan-actions";
import Contact from "@/components/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goodspeech | Transform Workplace Communication with AI",
  description:
    "Goodspeech transforms aggressive and passive-aggressive messages into empathic, understandable communication that builds connection and understanding in workplace conversations.",
  keywords:
    "workplace communication, communication ai, slack bot, empathic communication, nonviolent communication, conflict resolution, team communication",
  openGraph: {
    title: "Goodspeech | Transform Workplace Communication with AI",
    description:
      "Our AI-powered bot helps teams communicate with empathy and clarity by transforming messages in Slack and other platforms.",
    images: [
      {
        url: "/talking couple.png", // Make sure this image exists in your public folder
        width: 1536 ,
        height: 1024,
        alt: "Goodspeech - AI Communication Assistant",
      },
    ],
    type: "website",
    siteName: "Goodspeech",
  },
  authors: [{ name: "Goodspeech Team" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  const loggedIn = await verifyCookie();
  const plans = await getPlans();
  return (
    <>
      {/* Hero Section */}
      <section className="py-8 md:py-28 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Workplace Communication
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Goodspeech translates aggressive and passive-aggressive
                  messages into empathic, understandable communication that
                  builds connection and understanding.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild={true}
                  size="lg"
                  className="w-full min-[400px]:w-auto"
                >
                  <Link href={loggedIn.valid ? "/dashboard" : "/register"}>
                    Try Goodspeech Free
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
                    See Demo
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
                  alt="Goodspeech in action showing message transformation"
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
                Features That Transform Communication
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Goodspeech helps your team communicate with empathy and clarity
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <MessageSquareText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Translation</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Instantly transforms aggressive messages into empathic
                communication
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Private & Secure</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Your conversations stay private with enterprise-grade security
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Easy Integration</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Installs in minutes with no coding required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How Goodspeech Works
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                See how our AI-powered bot transforms communication in your
                Slack workspace
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 mt-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Install the Bot</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Add Goodspeech to your Slack workspace with just a few clicks
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Call the Bot</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {`Type "/nvc your message" in any conversation where you need
                      translation`}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Better Communication</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Watch as messages are transformed into empathic communication
                </p>
              </div>
            </div>
            <div className="relative mt-8 rounded-xl overflow-hidden border shadow-lg">
              <Image
                src="/lunch-break.webp"
                width={600}
                height={300}
                alt="Step-by-step demonstration of Goodspeech in action"
                className="object-cover w-full"
              />
            </div>
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
                See Goodspeech in Action
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Watch how Goodspeech transforms real messages
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
                      <span className="font-semibold">John Doe</span>
                      <span className="text-xs text-gray-500">10:30 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      {`Why hasn't anyone fixed this bug yet? We've been talking
                        about it for weeks!`}
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
                      {`"I'm feeling concerned about the bug that's been
                        discussed for several weeks. I'm wondering what
                        obstacles might be preventing its resolution, and I'd
                        appreciate understanding the timeline for when we might
                        expect it to be fixed."`}
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
                      <span className="font-semibold">Jane Smith</span>
                      <span className="text-xs text-gray-500">11:15 AM</span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-50 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      {`Fine, whatever. I guess I'll just do it myself since no
                        one else seems to care.`}
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
                      {`"I'm feeling frustrated because I value collaboration
                        and shared responsibility. I'm willing to take on this
                        task, but I'd appreciate some support or acknowledgment
                        from the team. Could we discuss how to distribute this
                        work more effectively?"`}
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
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the plan that works for your team
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
                        /month
                      </span>
                    )}
                  </div>
                  {typeof plan.pricing.monthly === "number" && (
                    <div className="flex items-baseline text-gray-900 dark:text-gray-50">
                      <span className="text-lg font-medium">
                        ${Math.round(plan.pricing.monthly * 12 * 0.8)}
                      </span>
                      <span className="ml-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                        /year
                      </span>
                      <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                        Save 20%
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
                        ? "Contact Sales"
                        : "Get Started"}
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
                What Our Customers Say
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Hear from teams that have transformed their communication
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <Image
                  src="/testimonials/testi-1.webp"
                  width={60}
                  height={60}
                  alt="Michael Chen"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Michael Lütkenhorst</h4>
                  <p className="text-sm text-gray-500">
                    Engineering Lead, StartupX
                  </p>
                </div>
              </div>
              <blockquote className="mt-4 text-gray-700 dark:text-gray-300">
                {`"As a remote team, clear communication is essential. Goodspeech
                  helps us avoid misunderstandings that used to derail our
                  projects."`}
              </blockquote>
            </div>
            <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <Image
                  src="/testimonials/testi-2.webp"
                  width={60}
                  height={60}
                  alt="Sarah Johnson"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Sarah Jung</h4>
                  <p className="text-sm text-gray-500">HR Director, TechCorp</p>
                </div>
              </div>
              <blockquote className="mt-4 text-gray-700 dark:text-gray-300">
                {`"Goodspeech has completely transformed how our teams communicate.
                 Conflicts are resolved faster, and people feel more heard and
                 understood."`}
              </blockquote>
            </div>
            <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <Image
                  src="/testimonials/testi-3.webp"
                  width={60}
                  height={60}
                  alt="Hermann Sorglos"
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div>
                  <h4 className="font-semibold">Martin Zoller</h4>
                  <p className="text-sm text-gray-500">
                    Team Lead, Global Solutions
                  </p>
                </div>
              </div>
              <blockquote className="mt-4 text-gray-700 dark:text-gray-300">
                {` "The ROI on Goodspeech has been incredible. Less time spent on
                 resolving conflicts means more time for productive work."`}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="flex justify-center py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Everything you need to know about Goodspeech
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                How does Goodspeech work?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Goodspeech uses advanced AI to analyze messages for aggressive
                or passive-aggressive language. It then rewrites these messages
                using the principles of Nonviolent Communication, focusing on
                observations, feelings, needs, and requests.
              </p>
              <br />
              <ul className="space-y-4">
                <li className="flex items-start">
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
                      Suggestion-Only Model
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      The bot analyzes communication and generates response
                      suggestions without sending messages automatically.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
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
                      Private Suggestions
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      All suggestions are only visible to you and are never
                      shared with message recipients.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
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
                      Manual Copy & Paste Required
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      To use a suggestion, you must manually copy and paste it
                      into your messaging platform.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
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
                      Full Control Over Content
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      You always have the opportunity to review, edit, or
                      discard any suggestion before sending.
                    </p>
                  </div>
                </li>
              </ul>
              <br />
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <span className="font-semibold">Our promise:</span> Goodspeech
                  enhances your natural communication abilities rather than
                  replacing your unique voice. You maintain complete control
                  over every message you send, and it does not make you being
                  right or wrong in any argument.
                </p>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Is my data secure?</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Goodspeech never collects user messages. We use a secure API to
                 translate messages in real-time. Your messages are never stored
                 on our servers. We take data privacy seriously and ensure that
                 all data is encrypted and transmitted securely. We also comply
                 with all relevant data protection regulations. We are committed
                 to protecting your data and ensuring that it is handled with the
                 utmost care and respect.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                Can I customize how Goodspeech responds?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Yes, on our Professional and Enterprise plans, you can
                  customize the tone and style of Goodspeech's translations to
                  match your company culture.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                How long does it take to set up?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Most teams are up and running with Goodspeech in less than 5
                 minutes. Just add the bot to your Slack workspace and you're
                 ready to go.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                Can Goodspeech translate messages in languages other than
                English?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {` Currently, Goodspeech supports English, Spanish, French, German,
                 and Japanese. We're adding more languages regularly based on
                 customer demand.`}
              </p>
            </div>
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
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {`Ready to Transform Your Team's Communication?`}
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {`Get started with Goodspeech today and see the difference in your
                 team's communication`}
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2 mt-6">
              <Link
                href="/register"
                className="text-md text-primary-foreground/80"
              >
                <Button className="bg-white h-10 text-primary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <p className="text-md text-primary-foreground/80">
                No credit card required. 14-day free trial. <br />
                Cancel anytime.
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
                Get in Touch
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {`Have questions or need more information? We're here to help.`}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-12">
            <div className="flex flex-col space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Email Us</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  contact@goodspeech.chat
                </p>
              </div>
              {/* <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Call Us</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  +1 (555) 123-4567
                </p>
              </div> */}
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Office Hours</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Monday - Friday: 9am - 5pm EST
                </p>
              </div>
            </div>
            <div className="rounded-lg border p-6">
              <Contact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
