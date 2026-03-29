import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";

const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

const footerLinks = {
  platform: [
    { label: "Scholarships", href: "/scholarships" },
    { label: "Universities", href: "/universities" },
    { label: "How It Works", href: "/about-us#how-it-works" },
  ],
  company: [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
      {/* Top accent */}
      <div
        className="h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.teal}40, ${BRAND.purple}40, transparent)`,
        }}
      />

      <div className="container mx-auto px-4 py-12 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="ScholarTrack"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Empowering students and universities with a seamless scholarship
              management platform.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, idx) => (
                <li key={`${link.href}-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={`${link.href}-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, idx) => (
                <li key={`${link.href}-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200/50 pt-8 dark:border-gray-800 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {year} ScholarTrack. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Built with
            </span>
            <div
              className="flex h-5 w-5 items-center justify-center rounded"
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
              }}
            >
              <GraduationCap className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;