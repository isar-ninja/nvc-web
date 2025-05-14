"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToMailAction } from "@/actions/beta-signup-action";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BetaSignupFormProps {
  dict: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
  };
}

export default function BetaSignupForm({ dict }: BetaSignupFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await subscribeToMailAction(email);
      setMessage({
        type: "success",
        text: response.message || dict.successMessage,
      });
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : dict.errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{dict.title}</h2>
        <p className="text-gray-500 mt-2">{dict.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder={dict.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
            data-testid="beta-signup-email"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="whitespace-nowrap"
            data-testid="beta-signup-submit"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full mr-2"></span>
                {dict.buttonText}
              </span>
            ) : (
              dict.buttonText
            )}
          </Button>
        </div>

        {message && (
          <div
            className={`mt-4 p-4 rounded-md border flex gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="mt-0.5">
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="font-medium">
                {message.type === "success" ? "Success" : "Error"}
              </div>
              <div className="text-sm">{message.text}</div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
