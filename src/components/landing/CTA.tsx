import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-primary to-vivid py-20">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to stay or start hosting?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
          Join thousands of travelers and hosts who&apos;ve made Stay N Go their
          go-to platform for unforgettable stays.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#"
            className="w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-blue-50 sm:w-auto"
          >
            Create Free Account
          </Link>
          <Link
            href="#pricing"
            className="w-full rounded-full border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
