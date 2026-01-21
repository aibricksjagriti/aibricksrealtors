export const metadata = {
  title: "Privacy Policy | AI Bricks Realtors",
  description:
    "Read the privacy policy of AI Bricks Realtors to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 mt-18 ">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Last updated: January 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <p className="mb-6 text-gray-700 leading-relaxed">
            At <strong>AI Bricks Realtors</strong> (
            <strong>aibricksrealtors.com</strong>), we value your trust and are
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit or use our website and services.
          </p>

          {/* Section */}
          <Section title="1. Information We Collect">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, and any details you provide through enquiry or
                contact forms.
              </li>
              <li>
                <strong>Property Preferences:</strong> Information related to
                property searches, location preferences, and budget.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, browser
                type, device information, and usage data collected through
                cookies and analytics tools.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                To respond to your enquiries and provide requested services
              </li>
              <li>To personalize property recommendations</li>
              <li>To improve our website, services, and user experience</li>
              <li>
                To send important updates, offers, or service-related
                communication
              </li>
              <li>To comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Cookies & Tracking Technologies">
            <p>
              We use cookies and similar technologies to enhance website
              performance, analyze traffic, and improve user experience. You may
              disable cookies through your browser settings; however, some
              features of the website may not function properly.
            </p>
          </Section>

          <Section title="4. Data Sharing & Disclosure">
            <p>
              We do not sell or rent your personal data. Your information may be
              shared only with:
            </p>
            <ul className="list-disc space-y-2 pl-5 mt-3">
              <li>Trusted service providers assisting in website operations</li>
              <li>
                Real estate developers or partners (only with your consent)
              </li>
              <li>Legal or regulatory authorities when required by law</li>
            </ul>
          </Section>

          <Section title="5. Data Security">
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <ul className="list-disc space-y-2 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your information</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Request data portability, where applicable</li>
            </ul>
          </Section>

          <Section title="7. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of such external
              sites.
            </p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us at:
            </p>
            <p className="mt-3 font-medium text-brickred">
              Email: info@aibricksrealtors.com
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
