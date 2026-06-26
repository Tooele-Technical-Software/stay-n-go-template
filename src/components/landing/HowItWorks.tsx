const guestSteps = [
  {
    step: "01",
    title: "Search & Discover",
    description: "Enter your destination, dates, and guests to explore available homes.",
  },
  {
    step: "02",
    title: "Book Instantly",
    description: "Review total pricing upfront and confirm your reservation in seconds.",
  },
  {
    step: "03",
    title: "Enjoy Your Stay",
    description: "Check in with ease and experience a home away from home.",
  },
];

const hostSteps = [
  {
    step: "01",
    title: "Create Your Listing",
    description: "Add photos, set your nightly rate, and describe what makes your space special.",
  },
  {
    step: "02",
    title: "Welcome Guests",
    description: "Approve bookings or enable instant book — you're always in control.",
  },
  {
    step: "03",
    title: "Get Paid",
    description: "Earnings are deposited directly after each completed stay.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Simple from start to finish
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Three easy steps whether you&apos;re traveling or hosting.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-16 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 text-xl font-bold text-primary">For Guests</h3>
            <div className="space-y-8">
              {guestSteps.map((item) => (
                <div key={item.step} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-black">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-8 text-xl font-bold text-primary">For Hosts</h3>
            <div className="space-y-8">
              {hostSteps.map((item) => (
                <div key={item.step} className="flex gap-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-semibold text-black">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
