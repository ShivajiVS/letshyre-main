import React from "react";

export const sections = [
  {
    id: "subscription-services",
    title: "1. Subscription Services",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre provides subscription-based hiring solutions and recruitment
          services for employers and recruiters.
        </p>
      </>
    ),
  },
  {
    id: "refund-eligibility",
    title: "2. Refund Eligibility",
    content: (
      <>
        <p className="tc-section-text">
          Refund requests may be considered in the following situations:
        </p>
        <ul className="tc-list">
          <li>Duplicate payments</li>
          <li>Incorrect billing caused by technical errors</li>
          <li>
            Service unavailability caused solely by LetsHyre for an extended
            period
          </li>
          <li>Unauthorized transactions verified through investigation</li>
        </ul>
      </>
    ),
  },
  {
    id: "non-refundable-services",
    title: "3. Non-Refundable Services",
    content: (
      <>
        <p className="tc-section-text">
          Refunds will generally not be provided for:
        </p>
        <ul className="tc-list">
          <li>Activated subscription plans</li>
          <li>Partial use of services</li>
          <li>Employer hiring outcomes</li>
          <li>Dissatisfaction with recruitment results</li>
          <li>Failure to utilize purchased services</li>
          <li>Subscription cancellations after activation.</li>
        </ul>
      </>
    ),
  },
  {
    id: "subscription-cancellation",
    title: "4. Subscription Cancellation",
    content: (
      <>
        <p className="tc-section-text">
          Users may cancel subscription renewals at any time.
        </p>
        <p className="tc-section-text">Cancellation:</p>
        <ul className="tc-list">
          <li>Stops future recurring charges</li>
          <li>
            Does not automatically qualify for refunds of current billing periods.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "refund-review-process",
    title: "5. Refund Review Process",
    content: (
      <>
        <p className="tc-section-text">
          Refund requests will be reviewed within 7–14 business days.
        </p>
        <p className="tc-section-text">
          Approved refunds will be processed through the original payment method
          wherever applicable.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-refund-policy",
    title: "6. Changes to Refund Policy",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to modify this Refund Policy at any time.
          Updated versions will be published on the website.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "7. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            For billing and refund-related inquiries:
            <br />
            Email:{" "}
            <a href="mailto:support@letshyre.com" className="tc-contact-email">
              support@letshyre.com
            </a>
          </p>
        </div>
      </>
    ),
  },
];
