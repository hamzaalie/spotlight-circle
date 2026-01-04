import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-brand-teal-50 to-brand-gold-50">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(74, 144, 164, 0.15) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600">
              Last updated: December 29, 2025
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">Welcome to Spotlight Circles (&quot;Spotlight Circles,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of SpotlightCircles.com and any related services, features, content, or applications (collectively, the &quot;Services&quot;).</p>
            <p className="text-lg leading-relaxed">By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">1. Description of Services</h2>
            <p className="text-lg leading-relaxed">Spotlight Circles is a professional networking platform designed to help service-based professionals connect with trusted, non-competing referral partners to grow their businesses through warm introductions. Key features include:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Create professional profiles</li>
              <li>Identify and invite trusted, non-competing referral partners</li>
              <li>Share referral circles with their clients</li>
              <li>Facilitate and track referral introductions</li>
            </ul>
            <p className="text-lg leading-relaxed">Spotlight Circles does not guarantee referrals, business outcomes, or revenue.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">2. Eligibility</h2>
            <p className="text-lg leading-relaxed">To use Spotlight Circles, you must:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Be at least 18 years old</li>
              <li>Have the authority to enter into these Terms</li>
              <li>Use the Services for lawful professional purposes</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">3. Accounts and Profiles</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>All profile information must be accurate, truthful, and complete.</li>
              <li>You may not impersonate others or provide false information.</li>
              <li>Spotlight Circles reserves the right to suspend or terminate accounts for violation of these Terms.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">4. Professional Conduct</h2>
            <p className="text-lg leading-relaxed">All users agree to conduct themselves professionally. You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Misrepresent your professional qualifications or services</li>
              <li>Harass, spam, or send unsolicited communications to other users</li>
              <li>Share confidential client information without consent</li>
              <li>Engage in unethical business practices</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">5. Referrals and Introductions</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Referrals and introductions are made at the discretion of individual users.</li>
              <li>Spotlight Circles does not guarantee any business relationship will result from introductions.</li>
              <li>Users remain fully responsible for their professional services and client outcomes.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">6. Fees and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Some features may require paid subscriptions.</li>
              <li>Subscription terms and pricing will be disclosed before purchase.</li>
              <li>All payments are non-refundable except as required by law.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>All content, branding, and features of Spotlight Circles remain our exclusive property.</li>
              <li>Users retain ownership of their content but grant Spotlight Circles a license to display, share, and promote user profiles and content for platform purposes.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">8. Privacy</h2>
            <p className="text-lg leading-relaxed">Your use of the Services is subject to our <a href="/privacy" className="text-brand-teal-600 underline font-semibold">Privacy Policy</a>, which explains how we collect, use, and protect your information.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">9. Prohibited Uses</h2>
            <p className="text-lg leading-relaxed">You may not:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Use the platform for illegal activities</li>
              <li>Attempt to access another user&apos;s account</li>
              <li>Scrape, copy, or harvest data from the platform</li>
              <li>Interfere with platform operations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">10. Disclaimers</h2>
            <p className="text-lg leading-relaxed font-semibold">Spotlight Circles provides the Services &quot;AS IS&quot; without warranty of any kind.</p>
            <p className="text-lg leading-relaxed">We do not warrant:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Referrals or introductions</li>
              <li>Client engagement</li>
              <li>Business results</li>
              <li>Platform availability without interruption</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">11. Limitation of Liability</h2>
            <p className="text-lg leading-relaxed font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPOTLIGHT CIRCLES SHALL NOT BE LIABLE FOR:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
              <li>LOSS OF PROFITS, DATA, OR BUSINESS</li>
              <li>DISPUTES BETWEEN USERS OR CLIENTS</li>
            </ul>
            <p className="text-lg leading-relaxed">Our total liability shall not exceed the amount paid by you to Spotlight Circles in the preceding 12 months, if any.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">12. Indemnification</h2>
            <p className="text-lg leading-relaxed">You agree to indemnify and hold harmless Spotlight Circles from claims arising out of:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Your use of the Services</li>
              <li>Your professional services</li>
              <li>Your violation of these Terms</li>
              <li>Your interactions with clients or other professionals</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">13. Termination</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>You may close your account at any time.</li>
              <li>Spotlight Circles may suspend or terminate accounts for violations.</li>
              <li>Upon termination, your access to the platform and data may be restricted.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">14. Modifications</h2>
            <p className="text-lg leading-relaxed">We may update these Terms from time to time. Changes will be posted on the website with an updated &quot;Last Updated&quot; date. Continued use of the Services constitutes acceptance of the revised Terms.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">15. Governing Law</h2>
            <p className="text-lg leading-relaxed">These Terms are governed by the laws of the State of California, without regard to conflict of law principles.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">16. Contact Information</h2>
            <p className="text-lg leading-relaxed">For questions about these Terms, contact:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Email: <a href="mailto:info@spotlightcircles.com" className="text-brand-teal-600 underline font-semibold">info@spotlightcircles.com</a></li>
              <li>Website: <a href="https://www.spotlightcircles.com" className="text-brand-teal-600 underline font-semibold">https://www.spotlightcircles.com</a></li>
            </ul>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
