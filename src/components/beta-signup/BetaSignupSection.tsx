import Image from "next/image";
import BetaSignupForm from "./BetaSignupForm";

interface BetaSignupSectionProps {
  dict: {
    betaSignup: {
      title: string;
      subtitle: string;
      emailPlaceholder: string;
      buttonText: string;
      successMessage: string;
      errorMessage: string;
    };
  };
}

export default function BetaSignupSection({ dict }: BetaSignupSectionProps) {
  return (
    <section className="flex justify-center py-16 items-center" id="#signup">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2 space-y-4">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src="/beta-signup-image.webp"
                alt="Beta Program Illustration"
                fill
                className="object-cover"
                priority={false}
                unoptimized
              />
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col items-center">
            <div className="w-full max-w-md">
              <BetaSignupForm
                dict={{
                  title: dict.betaSignup.title,
                  subtitle: dict.betaSignup.subtitle,
                  emailPlaceholder: dict.betaSignup.emailPlaceholder,
                  buttonText: dict.betaSignup.buttonText,
                  successMessage: dict.betaSignup.successMessage,
                  errorMessage: dict.betaSignup.errorMessage,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
