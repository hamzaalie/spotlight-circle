import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"

export default function PrivacyPage() {
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
              Privacy Policy
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
            <p className="text-lg leading-relaxed">Spotlight Circles (&quot;Spotlight Circles,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how information is collected, used, and disclosed when you visit SpotlightCircles.com or use our platform and services (the &quot;Services&quot;).</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">1. Information We Collect</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">A. Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Name</li>
                <li>Business name</li>
                <li>Email address</li>
                <li>Professional bio and services</li>
                <li>Referral partner information</li>
                <li>Any information submitted through forms, onboarding, or communications</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">B. Client Referral Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Client name (if provided)</li>
                <li>Client email (if provided)</li>
                <li>Referral selections and timestamps</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">C. Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Pages visited</li>
                <li>Referral link or QR code activity</li>
              </ul>
              <p className="text-lg leading-relaxed">This information is used for analytics, security, and performance optimization.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Provide and operate the Spotlight Circles platform</li>
              <li>Create and manage professional profiles</li>
              <li>Facilitate referral introductions between professionals</li>
              <li>Notify users of referral activity</li>
              <li>Generate referral links and QR codes</li>
              <li>Improve platform functionality and user experience</li>
              <li>Communicate updates, service-related messages, and onboarding information</li>
              <li>Maintain security and prevent misuse</li>
            </ul>
            <p className="text-lg leading-relaxed font-semibold">We do not sell personal information.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">3. How Referrals Work & Data Sharing</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Referral information is shared only to facilitate the requested introduction.</li>
              <li>A client&apos;s information is shared only with the professional(s) they select.</li>
              <li>Spotlight Circles does not add clients to marketing lists.</li>
              <li>Referral activity may be tracked for analytics and reporting to professionals.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">4. How We Share Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>With other users only as required to complete referral introductions</li>
              <li>With trusted service providers who help operate our platform (e.g., hosting, email delivery)</li>
              <li>When required by law or to protect legal rights</li>
            </ul>
            <p className="text-lg leading-relaxed font-semibold">We do not share data with advertisers or third-party marketing platforms.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">5. Cookies & Analytics</h2>
            <p className="text-lg leading-relaxed">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Understand site usage</li>
              <li>Improve performance</li>
              <li>Maintain session functionality</li>
            </ul>
            <p className="text-lg leading-relaxed">You may control cookies through your browser settings.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">6. Data Retention</h2>
            <p className="text-lg leading-relaxed">We retain personal information as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Provide services</li>
              <li>Meet legal or regulatory requirements</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="text-lg leading-relaxed">Users may request deletion of their account information at any time.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">7. Data Security</h2>
            <p className="text-lg leading-relaxed">We implement reasonable administrative, technical, and organizational safeguards to protect personal information. However, no system can be guaranteed 100% secure.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">8. Your Choices & Rights</h2>
            <p className="text-lg leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
            <p className="text-lg leading-relaxed">Requests can be made by contacting us at the email below.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">9. Children&apos;s Privacy</h2>
            <p className="text-lg leading-relaxed">Spotlight Circles is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">10. Third-Party Links</h2>
            <p className="text-lg leading-relaxed">Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">11. Changes to This Policy</h2>
            <p className="text-lg leading-relaxed">We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised &quot;Last Updated&quot; date.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">12. Contact Us</h2>
            <p className="text-lg leading-relaxed">If you have questions about this Privacy Policy or our data practices, contact us at:</p>
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
