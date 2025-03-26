import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquareText, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Workplace Communication
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  NVC-Bot translates aggressive and passive-aggressive messages
                  into empathic, understandable communication that builds
                  connection and understanding.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild={true}
                  size="lg"
                  className="w-full min-[400px]:w-auto"
                >
                  <Link
                    target="_blank"
                    href="https://slackbot-e8huapd7e6cegqd9.germanywestcentral-01.azurewebsites.net/slack/install"
                  >
                    Try NVC-Bot Free
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
                  src="https://kzmjph0iozma3tygpba2.lite.vusercontent.net/placeholder.svg"
                  width={600}
                  height={400}
                  alt="NVC-Bot in action showing message transformation"
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
                NVC-Bot helps your team communicate with empathy and clarity
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
                How NVC-Bot Works
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
                  Add NVC-Bot to your Slack workspace with just a few clicks
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
                src="https://kzmjph0iozma3tygpba2.lite.vusercontent.net/placeholder.svg"
                width={1000}
                height={400}
                alt="Step-by-step demonstration of NVC-Bot in action"
                className="object-cover w-full h-full"
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
                See NVC-Bot in Action
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Watch how NVC-Bot transforms real messages
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
                      <span className="font-semibold">NVC-Bot</span>
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
                      <span className="font-semibold">NVC-Bot</span>
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
            <div className="flex flex-col rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Starter</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  For small teams just getting started
                </p>
              </div>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold">$9</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Up to 10 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>100 translations per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic support</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="#signup">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-primary p-6 shadow-md">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Professional</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  For growing teams with more needs
                </p>
              </div>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold">$29</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Up to 50 users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>1,000 translations per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="#signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  For large organizations
                </p>
              </div>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                <span className="text-3xl font-bold">Custom</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited users</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Unlimited translations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>On-premise deployment option</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link href="#contact">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
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
                  src="/testimonials/man-1.png"
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
                {`"As a remote team, clear communication is essential. NVC-Bot
                  helps us avoid misunderstandings that used to derail our
                  projects."`}
              </blockquote>
            </div>
            <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <Image
                  src="/testimonials/woman-1.png"
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
                {`"NVC-Bot has completely transformed how our teams communicate.
                 Conflicts are resolved faster, and people feel more heard and
                 understood."`}
              </blockquote>
            </div>
            <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <Image
                  src="/testimonials/man-2.png"
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
                {` "The ROI on NVC-Bot has been incredible. Less time spent on
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
                Everything you need to know about NVC-Bot
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12 space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">How does NVC-Bot work?</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                NVC-Bot uses advanced AI to analyze messages for aggressive or
                passive-aggressive language. It then rewrites these messages
                using the principles of Nonviolent Communication, focusing on
                observations, feelings, needs, and requests.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Is my data secure?</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Yes, we take data security seriously. NVC-Bot only processes
               the messages it's explicitly asked to translate, and we don't
               store message content. All data is encrypted in transit and at
               rest.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                Can I customize how NVC-Bot responds?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Yes, on our Professional and Enterprise plans, you can
                  customize the tone and style of NVC-Bot's translations to
                  match your company culture.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                How long does it take to set up?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {`Most teams are up and running with NVC-Bot in less than 5
                 minutes. Just add the bot to your Slack workspace and you're
                 ready to go.`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">
                Can NVC-Bot translate messages in languages other than English?
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {` Currently, NVC-Bot supports English, Spanish, French, German,
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
                {`Get started with NVC-Bot today and see the difference in your
                 team's communication`}
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                  placeholder="Enter your work email"
                  type="email"
                />
                <Button
                  type="submit"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Start Free Trial
                </Button>
              </form>
              <p className="text-xs text-primary-foreground/80">
                No credit card required. 14-day free trial.
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
                  hello@nvc-bot.com
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Call Us</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  +1 (555) 123-4567
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-semibold">Office Hours</h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Monday - Friday: 9am - 5pm EST
                </p>
              </div>
            </div>
            <div className="rounded-lg border p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your name"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your email"
                      type="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Subject"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
