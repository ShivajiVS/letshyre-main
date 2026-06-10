import { Helmet } from "react-helmet-async";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";

import "./styles/contact.css";

export function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | LetsHyre</title>
        <meta
          name="description"
          content="Have questions about LetsHyre? Contact our support team for help with interviews, hiring plans, and more."
        />
      </Helmet>

      <div className="contact-page-container">
        <div className="contact-content-wrapper">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </>
  );
}
