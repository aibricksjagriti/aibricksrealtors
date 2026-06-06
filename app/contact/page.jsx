import { buildMetadata } from "@/lib/utils/seo";
import { contactFaqs } from "@/data/faq";

export const metadata = buildMetadata({
  title: "Contact Us | AI Bricks Realtors",
  description:
    "Get in touch with AI Bricks Realtors for property enquiries, site visits, and expert real estate guidance across India.",
  path: "/contact",
});
import ComingSoon from "@/src/ComingSoon";
import CompanyDetails from "@/src/Contact/CompanyDetails";
import ContactPage from "@/src/Contact/ContactPage";
import FAQSection from "@/src/FAQSection";
import React from "react";

const PageContact = () => {
  return (
    <div>
      {/* <ComingSoon /> */}
      <CompanyDetails />
      <ContactPage />
      <FAQSection title="Frequently Asked Questions" faqs={contactFaqs} />
    </div>
  );
};

export default PageContact;
