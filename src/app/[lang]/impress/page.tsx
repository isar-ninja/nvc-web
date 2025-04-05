import Contact from "@/components/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | Goodspeech Web",
  description: "Legal information according to § 5 TMG",
};

export default function ImpressPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex justify-center">
      <div className="container py-16 px-4 sm:px-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800 border-b pb-4">
            Impressum{" "}
            <span className="text-slate-500 font-normal">(Legal Notice)</span>
          </h1>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              Information according to § 5 TMG
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1">Falk Michel</p>
              <p className="mb-1">[Street Address and Number]</p>
              <p className="mb-1">[Postal Code, City]</p>
              <p>Germany</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              Contact
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1 flex items-center">
                <span className="text-slate-500 w-16">Email:</span>
                <span>info@goospeech.chat</span>
              </p>
              <div className="max-w-lg">
                <Contact />
              </div>
            </div>

          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              Business Registration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="pl-3 border-l-2 border-slate-200">
                  <p className="mb-1">Commercial Register: [Handelsregister]</p>
                  <p className="mb-1">Registration Court: [Amtsgericht]</p>
                  <p>Registration Number: [HRA/HRB Number]</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </span>
              Tax Information
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-2">
                VAT Identification Number according to §27a of the German Value
                Added Tax Act:
              </p>
              <p className="mb-3 font-medium">DE [Your VAT ID Number]</p>
              <p className="italic text-slate-500">wip</p>
              <p>Tax Identification Number: wip</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              Responsible for Content according to § 55 Abs. 2 RStV
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1">Falk Michel</p>
              <p>[Same Address as Above]</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 9h8" />
                  <path d="M8 13h6" />
                  <path d="M18 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12z" />
                </svg>
              </span>
              Dispute Resolution
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-2">
                The European Commission provides a platform for online dispute
                resolution (OS):
              </p>
              <p className="mb-3">
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                We are not willing or obligated to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </p>
            </div>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center">
              <span className="bg-slate-100 p-1 rounded-md mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-slate-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </span>
              Disclaimer
            </h2>

            <div className="space-y-6 pl-4 border-l-2 border-slate-100 ml-2">
              <div>
                <h3 className="text-lg font-medium mb-2 text-slate-700">
                  Liability for Content
                </h3>
                <p className="text-slate-600">
                  As a service provider, we are responsible for our own content
                  on these pages according to general laws. However, we are not
                  obligated to monitor transmitted or stored third-party
                  information or to investigate circumstances that indicate
                  illegal activity. Obligations to remove or block the use of
                  information under general laws remain unaffected. However,
                  liability in this regard is only possible from the point in
                  time at which a concrete legal violation becomes known. If we
                  become aware of any such legal violations, we will remove the
                  content in question immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-slate-700">
                  Liability for Links
                </h3>
                <p className="text-slate-600">
                  Our website contains links to external websites over which we
                  have no control. Therefore, we cannot assume any liability for
                  this external content. The respective provider or operator of
                  the linked pages is always responsible for the content of the
                  linked pages. The linked pages were checked for possible legal
                  violations at the time of linking. Illegal content was not
                  recognizable at the time of linking. However, permanent
                  control of the content of the linked pages is not reasonable
                  without concrete indications of a legal violation. If we
                  become aware of any legal violations, we will remove such
                  links immediately.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 text-slate-700">
                  Copyright
                </h3>
                <p className="text-slate-600">
                  The content and works created by the site operators on these
                  pages are subject to German copyright law. Duplication,
                  processing, distribution, and any kind of exploitation outside
                  the limits of copyright require the written consent of the
                  respective author or creator. Downloads and copies of this
                  site are only permitted for private, non-commercial use.
                  Insofar as the content on this site was not created by the
                  operator, the copyrights of third parties are respected. In
                  particular, third-party content is marked as such. Should you
                  nevertheless become aware of a copyright infringement, please
                  inform us accordingly. If we become aware of any
                  infringements, we will remove such content immediately.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
