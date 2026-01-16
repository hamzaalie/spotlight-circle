import Link from "next/link"
import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: "Features", href: "/#features" },
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Pricing", href: "/auth/signup" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  }

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="Spotlight Circles" className="h-10 w-10" />
              <span className="text-xl font-bold text-gray-900">
                Spotlight Circles
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Building trusted professional referral networks powered by AI.
            </p>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <a href="mailto:support@spotlightcircles.com" className="flex items-center gap-2 hover:text-brand-teal-600 transition-colors">
                <Mail size={16} />
                support@spotlightcircles.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                San Francisco, CA
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/SpotlightCircles/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-gray-300 text-gray-600 hover:border-brand-teal-400 hover:text-brand-teal-600 hover:shadow-md transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/spotlight_circles"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-gray-300 text-gray-600 hover:border-brand-teal-400 hover:text-brand-teal-600 hover:shadow-md transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/spotlight-circles/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-gray-300 text-gray-600 hover:border-brand-teal-400 hover:text-brand-teal-600 hover:shadow-md transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-brand-teal-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-brand-teal-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-brand-teal-600 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Spotlight Circles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

