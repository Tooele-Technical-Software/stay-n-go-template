import Link from "next/link";
import LogoLink from "@/components/LogoLink";

const footerLinks = {
  Product: [
    { label: "Find a Stay", href: "#" },
    { label: "Become a Host", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Safety", href: "#" },
    { label: "Cancellation", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <LogoLink />
            <p className="mt-4 text-sm leading-6 text-gray-500">
              The simplest way to find your next stay or share your space with
              the world.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-black">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Stay N Go. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
