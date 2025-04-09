export default function FAQ({ dict }: { dict: any }) {
  return (
    <div className="space-y-4">
      {dict.faq.items.map((faq, index) => (
        <div key={index} className="rounded-lg border p-4">
          <h3 className="text-lg font-semibold">{faq.question}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
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
  );
}
