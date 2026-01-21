export const metadata = {
  title: "Disclaimer | AI Bricks Realtors",
  description:
    "Read the disclaimer for AI Bricks Realtors regarding website content, property information, and liability limitations.",
};

export default function DisclaimerPage() {
  return (
    <section className="bg-gray-50 py-12 sm:py-16 mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Disclaimer
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Last updated: January 2026
          </p>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <p className="mb-6 text-gray-700 leading-relaxed">
            The information provided on <strong>aibricksrealtors.com</strong> by
            <strong> AI Bricks Realtors</strong> is for general informational
            purposes only. While we strive to keep the information accurate,
            complete, and up to date, we make no warranties or representations
            of any kind regarding the accuracy, reliability, or completeness of
            any information on this website.
          </p>

          <Section title="1. No Professional Advice">
            <p>
              The content on this website does not constitute legal, financial,
              investment, or real estate advice. Any reliance you place on such
              information is strictly at your own risk. You are encouraged to
              consult qualified professionals before making any property,
              financial, or investment decisions.
            </p>
          </Section>

          <Section title="2. Property Information">
            <p>
              Property details, images, floor plans, pricing, availability, and
              specifications displayed on this website are indicative and
              subject to change without prior notice. All property-related
              information is sourced from developers or third parties, and
              <strong> AI Bricks Realtors</strong> does not guarantee its
              accuracy or authenticity.
            </p>
          </Section>

          <Section title="3. Third-Party Links">
            <p>
              This website may contain links to third-party websites or services
              for your convenience. We do not control or endorse the content,
              policies, or practices of such external websites and shall not be
              responsible for any loss or damage arising from your use of them.
            </p>
          </Section>

          <Section title="4. Limitation of Liability">
            <p>
              In no event shall <strong>AI Bricks Realtors</strong>, its
              directors, employees, partners, or affiliates be liable for any
              direct, indirect, incidental, consequential, or special damages
              arising out of or in connection with your use of this website or
              reliance on any information provided herein.
            </p>
          </Section>

          <Section title="5. No Guarantees">
            <p>
              We do not guarantee specific outcomes, returns on investment,
              property appreciation, or availability of listed properties.
              Market conditions, regulatory changes, and developer policies may
              affect real estate outcomes.
            </p>
          </Section>

          <Section title="6. Errors & Omissions">
            <p>
              While we take reasonable efforts to ensure accuracy, this website
              may contain typographical errors, inaccuracies, or omissions.
              <strong> AI Bricks Realtors</strong> reserves the right to correct
              or update information at any time without notice.
            </p>
          </Section>

          <Section title="7. Changes to This Disclaimer">
            <p>
              We reserve the right to modify or update this Disclaimer at any
              time. Any changes will be effective immediately upon posting on
              this page. Your continued use of the website constitutes
              acceptance of the updated Disclaimer.
            </p>
          </Section>

          <Section title="8. Contact Information">
            <p>
              If you have any questions or concerns regarding this Disclaimer,
              please contact us at:
            </p>
            <p className="mt-3 font-medium text-brickred">
              Email: support@aibricksrealtors.com
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
