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

type Props = {
  params: Promise<{ lang: Locale }>;
};

export default async function Documentation({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="h-16 w-16 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            GoodSpeech Bot for Slack
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Transform your team communication with more empathic and considerate
            messages
          </p>
        </div>

        <Tabs defaultValue="install" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="install">Installation Guide</TabsTrigger>
            <TabsTrigger value="usage">Usage Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="install">
            <Card>
              <CardHeader>
                <CardTitle>Installing GoodSpeech Bot</CardTitle>
                <CardDescription>
                  Follow these steps to add GoodSpeech to your Slack workspace
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
                        Go to the Goodspeech Dahsboard
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Go to the "Slack Integration" section and click the
                        button "Add to Slack"
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
                        Add to Slack
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">2</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Install Bot to a Slack Workspace
                      </h3>
                      <p className="text-slate-600 mt-1">
                        A new Browser window will open a where you can select
                        the Slack Workspace you want to integrate GoodSpeech
                        with.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">3</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Add to Workspace
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Click the "Add to Slack" button and authorize the app
                        for your workspace. You'll need to have the appropriate
                        permissions to add apps to your workspace.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">4</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Review Permissions
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Review the permissions requested by GoodSpeech. The bot
                        needs access to read and send messages in Workspaces
                        where it's used.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <span className="font-bold text-emerald-700">5</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Confirmation</h3>
                      <p className="text-slate-600 mt-1">
                        Once you click allow, slack will open and the bot
                        installed. The GoodSpeech bot is now ready to use in
                        your workspace!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">
                      Installation Complete
                    </h3>
                  </div>
                  <p className="text-emerald-700">
                    GoodSpeech is now available in your Slack workspace. You can
                    use it in any channel or direct message by typing the "/nvc"
                    command.
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-center">
                  Frequently Asked Questions
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
                <CardTitle>Using GoodSpeech Bot</CardTitle>
                <CardDescription>
                  Learn how to use GoodSpeech to improve your communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Key Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Use the bot in any channel or direct message
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Suggestions are only visible to you</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Generate multiple suggestions with the regenerate
                          button
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Copy and paste suggestions into your conversation
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">How to Use</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">1</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            Invoke the Bot
                          </h4>
                          <p className="text-slate-600 mt-1">
                            Type{" "}
                            <code className="bg-slate-100 px-2 py-1 rounded">
                              /nvc
                            </code>{" "}
                            followed by your message in any channel or direct
                            message.
                          </p>
                          <div className="mt-2 bg-slate-100 p-3 rounded-md">
                            <code>/nvc why is this ticket still empty</code>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">2</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            Review Suggestions
                          </h4>
                          <p className="text-slate-600 mt-1">
                            The bot will respond with a more empathic version of
                            your message. Only you can see this suggestion.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">3</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            Generate Alternatives
                          </h4>
                          <p className="text-slate-600 mt-1">
                            If you'd like a different suggestion, click the
                            "Regenerate" button to get a new version.
                          </p>
                          <div className="mt-3 flex">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="bg-emerald-100 rounded-full p-2 mt-1">
                          <span className="font-bold text-emerald-700">4</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium">
                            Use the Suggestion
                          </h4>
                          <p className="text-slate-600 mt-1">
                            Copy the suggestion and paste it into your
                            conversation. The bot doesn't automatically send
                            messages on your behalf.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Example</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-slate-800 text-white p-3 text-sm">
                        Slack - GoodSpeech Bot Example
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
                      In this example, the original message "hey please come to
                      my office we need to talk!" was transformed into a more
                      considerate alternative.
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
