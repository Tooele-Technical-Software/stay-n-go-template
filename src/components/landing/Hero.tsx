import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary-light/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-vivid-light/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-white px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
            Your next adventure starts here
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
            Rent, host, and travel{" "}
            <span className="text-primary">the simple way</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Stay N Go connects travelers with unique homes and helps hosts earn
            effortlessly. No hidden fees, no complicated setup — just great
            stays and great earnings.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#"
              className="w-full rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-primary/40 sm:w-auto"
            >
              Find a Stay
            </Link>
            <Link
              href="#"
              className="w-full rounded-full border-2 border-primary px-8 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:w-auto"
            >
              Become a Host
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "50K+", label: "Active listings" },
            { value: "120+", label: "Countries" },
            { value: "4.9★", label: "Average rating" },
            { value: "$0", label: "Hidden fees" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary/20 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
