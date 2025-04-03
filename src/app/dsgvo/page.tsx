import Contact from "@/components/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Goodspeech Web",
  description: "Informationen zum Datenschutz gemäß DSGVO",
};

export default function DatenschutzPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex justify-center">
      <div className="container py-16 px-4 sm:px-6 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800 border-b pb-4">
            Datenschutzerklärung{" "}
            <span className="text-slate-500 font-normal">(gemäß DSGVO)</span>
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
              Verantwortlicher im Sinne der Datenschutzgesetze
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1">Goodspeech</p>
              <p className="mb-1">Einzelunternehmen</p>
              <p className="mb-1">Sommerstraße 23</p>
              <p className="mb-1">81543 München</p>
              <p>E-Mail: info@goodspeech.chat</p>
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="m12 8-4 4 4 4" />
                  <path d="m16 12-4-4-4 4 4 4 4-4Z" />
                </svg>
              </span>
              1. Allgemeine Hinweise zur Datenverarbeitung
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1">
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                Personenbezogene Daten werden von uns nur erhoben, wenn dies
                gesetzlich erlaubt ist oder Sie in die Datenerhebung
                einwilligen.
              </p>
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
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </span>
              2. Zugriffsdaten und Hosting
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Unsere Website goodspeech.chat (inkl. store.goodspeech.chat)
                wird auf Servern in Frankfurt gehostet. Beim Aufrufen der
                Website erheben wir nur die Daten, die Ihr Browser an unseren
                Server übermittelt (sogenannte Server-Logfiles). Diese
                beinhalten z. B.:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Referrer-URL</li>
                <li>Browsertyp und -version</li>
                <li>Betriebssystem</li>
              </ul>
              <p>
                Diese Daten werden ausschließlich zur Sicherstellung eines
                störungsfreien Betriebs der Website und zur Verbesserung unseres
                Angebots ausgewertet und erlauben uns keinen Rückschluss auf
                Ihre Person.
              </p>
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
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </span>
              3. Cookies und Einwilligungsmanagement
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Wir setzen Cookies ein, um bestimmte Funktionen (z. B.
                Authentifizierung) zu ermöglichen. Beim ersten Besuch unserer
                Website wird ein Cookie-Banner eingeblendet, das Sie über die
                verwendeten Cookies informiert und Ihre Einwilligung einholt.
              </p>
              <p>
                Die Rechtsgrundlage für die Datenverarbeitung ist Art. 6 Abs. 1
                lit. a DSGVO (Einwilligung) sowie Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an einer technisch fehlerfreien
                Darstellung und Optimierung unserer Website).
              </p>
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
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="10" y1="6" x2="14" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
              </span>
              4. Einsatz von Google Analytics
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Diese Website nutzt Google Analytics, einen Webanalysedienst der
                Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4,
                Irland. Die Datenverarbeitung kann in den USA erfolgen. Google
                Analytics verwendet Cookies, um Ihre Benutzung der Website zu
                analysieren.
              </p>
              <p>
                Wir haben IP-Anonymisierung aktiviert. Die Datenverarbeitung
                erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a
                DSGVO). Sie können Ihre Einwilligung jederzeit über unser
                Cookie-Banner widerrufen.
              </p>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              5. Registrierung und Kundenbereich
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Für die Nutzung unseres Dienstes können Sie ein Benutzerkonto
                anlegen. Dabei werden folgende Daten gespeichert:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>E-Mail-Adresse</li>
                <li>Unternehmensinformationen</li>
              </ul>
              <p>
                Diese Daten sind notwendig zur Vertragserfüllung (Art. 6 Abs. 1
                lit. b DSGVO). Sie können Ihr Benutzerkonto jederzeit im
                Kundenbereich löschen.
              </p>
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
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="m10 13-2 2 2 2" />
                  <path d="m14 17 2-2-2-2" />
                </svg>
              </span>
              6. Slack-Bot und SaaS-Dienste
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Unser Slack-Bot verarbeitet folgende Daten, wenn er durch den
                Nutzer aktiviert wird:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Slack User ID</li>
                <li>Team ID</li>
                <li>
                  Nachrichteninhalte des aufrufenden Nutzers (temporär
                  verarbeitet)
                </li>
                <li>Workspace-Informationen</li>
              </ul>
              <p className="mb-3">
                Die Verarbeitung erfolgt ausschließlich zur Bereitstellung der
                gewünschten Funktion. Die Nachrichteninhalte werden nicht
                gespeichert, sondern ausschließlich temporär auf Servern in
                Frankfurt verarbeitet und zur Weiterverarbeitung an die OpenAI
                API übergeben.
              </p>
              <p className="mb-3">
                Eine dauerhafte Speicherung, Profilbildung oder Auswertung der
                Inhalte erfolgt nicht.
              </p>
              <p>
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              </p>
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
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <line x1="7" y1="15" x2="8" y2="15" />
                  <line x1="12" y1="15" x2="13" y2="15" />
                </svg>
              </span>
              7. Zahlung und Abrechnung
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Für die Abwicklung kostenpflichtiger Pläne nutzen wir den
                Zahlungsdienstleister LemonSqueezy, der auf der Infrastruktur
                von Stripe basiert.
              </p>
              <p className="mb-3">
                Dabei werden zur Rechnungsstellung und Zahlungsabwicklung
                personenbezogene Daten wie Name, E-Mail-Adresse und
                Zahlungsinformationen verarbeitet. LemonSqueezy ist ein Anbieter
                mit Sitz in den USA. Die Datenverarbeitung erfolgt auf Grundlage
                von Art. 6 Abs. 1 lit. b DSGVO.
              </p>
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              8. E-Mail-Kommunikation und Newsletter
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Bei der Anmeldung zum Newsletter erfolgt die Anmeldung über ein
                Double-Opt-in-Verfahren. Der Versand erfolgt über unseren
                Dienstleister LemonSqueezy. Die Datenverarbeitung erfolgt auf
                Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
              </p>
              <p>
                Sie können den Newsletter jederzeit über den Link in der E-Mail
                abbestellen.
              </p>
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
                  <path d="M23 21v-2a4 4 0 0 0-4-4h-3" />
                </svg>
              </span>
              9. Einsatz von Auftragsverarbeitern (Subdienstleister)
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Folgende Dienstleister werden zur Verarbeitung eingesetzt:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg mb-3 overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-slate-700 py-2 px-3">
                        Dienstleister
                      </th>
                      <th className="text-left text-slate-700 py-2 px-3">
                        Zweck
                      </th>
                      <th className="text-left text-slate-700 py-2 px-3">
                        Sitz / Übermittlung
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Firebase (Google)
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Datenbank / Auth
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        USA
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-t border-slate-200">
                        OpenAI API
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Sprachverarbeitung
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        USA
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Netlify / Azure
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Hosting
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        USA / EU
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Slack API
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        Integration / Auth
                      </td>
                      <td className="py-2 px-3 border-t border-slate-200">
                        USA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Mit allen Auftragsverarbeitern wurden
                Auftragsverarbeitungsverträge (AVV) geschlossen bzw. die
                Standardvertragsklauseln (SCC) der EU-Kommission akzeptiert, um
                ein angemessenes Datenschutzniveau sicherzustellen.
              </p>
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
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <path d="m9 16 3-3 3 3" />
                </svg>
              </span>
              10. Datensicherheit
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Wir setzen technische und organisatorische Maßnahmen (TOMs) ein,
                um Ihre Daten zu schützen:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Verschlüsselung bei Übertragung und Speicherung</li>
                <li>Zugriffsbeschränkung nur für Administratoren</li>
                <li>Regelmäßige Sicherheitsupdates</li>
              </ul>
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
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m16 6-4 4-4-4" />
                  <path d="M16 18a4 4 0 0 0-8 0" />
                </svg>
              </span>
              11. Speicherdauer und Löschung
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">
                Daten werden nur so lange gespeichert, wie dies für den
                jeweiligen Zweck erforderlich ist:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>
                  Nachrichteninhalte: temporäre Verarbeitung für wenige
                  Sekunden, danach automatische Löschung
                </li>
                <li>Nutzerkonten: bis zur Löschung durch den Nutzer</li>
              </ul>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="m16 11 2 2 4-4" />
                </svg>
              </span>
              12. Betroffenenrechte
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-3">Sie haben jederzeit das Recht:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>
                  Auskunft über Ihre gespeicherten Daten zu erhalten (Art. 15
                  DSGVO)
                </li>
                <li>
                  Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)
                </li>
                <li>Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
                <li>
                  Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)
                </li>
                <li>Datenübertragbarkeit zu fordern (Art. 20 DSGVO)</li>
                <li>
                  Beschwerde bei einer Aufsichtsbehörde einzulegen (Art. 77
                  DSGVO)
                </li>
              </ul>
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </span>
              13. Ansprechpartner für Datenschutz
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p className="mb-1">
                Für Fragen zum Datenschutz wenden Sie sich bitte an:
              </p>
              <p className="mb-1">Administrator</p>
              <p>E-Mail: info@goodspeech.chat</p>
              <div className="max-w-lg mt-4">
                <Contact />
              </div>
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
                  <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                </svg>
              </span>
              14. Änderungen dieser Datenschutzerklärung
            </h2>
            <div className="pl-4 border-l-2 border-slate-100 ml-2">
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
                damit sie stets den aktuellen rechtlichen Anforderungen
                entspricht oder um Änderungen unserer Leistungen umzusetzen.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            Letzte Aktualisierung: {new Date().toLocaleDateString("de-DE")}
          </div>
        </div>
      </div>
    </div>
  );
}
