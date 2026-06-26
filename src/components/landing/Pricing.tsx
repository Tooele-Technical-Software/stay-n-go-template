import Link from "next/link";

const plans = [
  {
    name: "Guest",
    price: "Free",
    period: "to join",
    description: "Browse and book stays with no membership fees.",
    features: [
      "Access to 50,000+ listings",
      "Transparent pricing on every booking",
      "Secure payment processing",
      "24/7 customer support",
      "Flexible cancellation options",
    ],
    cta: "Start Exploring",
    highlighted: false,
  },
  {
    name: "Host",
    price: "3%",
    period: "service fee",
    description: "List your space and only pay when you earn.",
    features: [
      "Free listing creation",
      "Set your own nightly rates",
      "Calendar & availability tools",
      "Guest messaging built-in",
      "Host protection coverage",
      "Fast, direct payouts",
    ],
    cta: "List Your Space",
    highlighted: true,
  },
  {
    name: "Pro Host",
    price: "1.5%",
    period: "service fee",
    description: "For hosts with multiple properties who want more.",
    features: [
      "Everything in Host plan",
      "Multi-property dashboard",
      "Priority support",
      "Advanced analytics",
      "Bulk calendar management",
      "Featured listing placement",
    ],
    cta: "Go Pro",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-br from-slate-900 via-primary-dark to-primary py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Fantastic pricing, zero surprises
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Guests book for free. Hosts pay a small service fee only when they
            earn. That&apos;s it.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl p-8 ${
                plan.highlighted
                  ? "border-2 border-primary-light bg-white/10 shadow-xl shadow-primary/20"
                  : "border border-white/20 bg-white/5"
              }`}
            >
              {plan.highlighted && (
                <span className="mb-4 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-light">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-400">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">{plan.description}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-light"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="#"
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-gray-700 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
