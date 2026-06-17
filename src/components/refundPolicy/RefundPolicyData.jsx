import React from "react";

export const sections = [
  {
    id: "service-model",
    title: "1. Service Model",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre operates on a Pay-Per-Unlock hiring model. Employers may make one-time payments to unlock:
        </p>
        <ul className="tc-list">
          <li>Candidate Profiles</li>
          <li>Interview Scorecards</li>
          <li>Interview Recordings</li>
          <li>Candidate Contact Information</li>
        </ul>
        <p className="tc-section-text">
          Each unlock purchase grants access to the selected candidate's profile information, interview scorecards, interview recordings, and contact details, subject to platform availability.
        </p>
        <p className="tc-section-text">
          Unlock purchases are one-time transactions and do not constitute a subscription or recurring service.
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
          Refund requests may be considered only in the following circumstances:
        </p>
        <ul className="tc-list">
          <li>Duplicate payments for the same candidate unlock.</li>
          <li>Incorrect billing caused by a technical error on the LetsHyre platform.</li>
          <li>Successful payment where access to the purchased candidate information was not provided due to a platform issue.</li>
          <li>Unauthorized transactions verified through investigation.</li>
        </ul>
        <p className="tc-section-text">
          All refund requests must be submitted within 7 days of the transaction date.
        </p>
      </>
    ),
  },
  {
    id: "non-refundable-purchases",
    title: "3. Non-Refundable Purchases",
    content: (
      <>
        <p className="tc-section-text">
          Refunds will generally not be provided in the following situations:
        </p>
        <ul className="tc-list">
          <li>Candidate profiles that have been successfully unlocked.</li>
          <li>Interview scorecards or interview recordings that have been successfully accessed.</li>
          <li>Candidate contact information that has been successfully revealed.</li>
          <li>Employer dissatisfaction with a candidate's qualifications, skills, experience, communication abilities, or suitability for a role.</li>
          <li>Failure to contact or hire a candidate after unlocking their profile.</li>
          <li>Candidate unresponsiveness after profile unlock.</li>
          <li>Changes in hiring requirements after a candidate has been unlocked.</li>
          <li>Hiring outcomes or recruitment results.</li>
        </ul>
        <p className="tc-section-text">
          Once candidate information has been successfully unlocked and made available to the employer, the transaction is considered completed.
        </p>
      </>
    ),
  },
  {
    id: "refund-review-process",
    title: "4. Refund Review Process",
    content: (
      <>
        <p className="tc-section-text">
          Eligible refund requests will be reviewed by LetsHyre within 7–14 business days.
        </p>
        <p className="tc-section-text">
          Additional information may be requested to verify refund eligibility.
        </p>
        <p className="tc-section-text">
          Approved refunds will be processed through the original payment method used for the transaction. Processing times may vary depending on the payment provider or financial institution.
        </p>
      </>
    ),
  },
  {
    id: "fraud-prevention",
    title: "5. Fraud Prevention",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to deny refund requests where fraudulent activity, misuse of the platform, violation of the Terms & Conditions, or abuse of the refund process is suspected.
        </p>
        <p className="tc-section-text">
          Accounts involved in fraudulent payment activity may be suspended or permanently terminated.
        </p>
      </>
    ),
  },
  {
    id: "chargebacks-and-payment-disputes",
    title: "6. Chargebacks and Payment Disputes",
    content: (
      <>
        <p className="tc-section-text">
          If a user initiates a chargeback or payment dispute through a bank, card issuer, or payment provider, LetsHyre reserves the right to investigate the transaction and provide relevant records to the payment processor.
        </p>
        <p className="tc-section-text">
          Fraudulent or abusive chargeback activity may result in account suspension or termination.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-refund-policy",
    title: "7. Changes to this Refund Policy",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to modify or update this Refund Policy at any time. Updated versions will be published on the website and become effective upon publication.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "8. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            For billing, payment, or refund-related inquiries, please contact:
            <br />
            Email:{" "}
            <a href="mailto:support@letshyre.ai" className="tc-contact-email">
              support@letshyre.ai
            </a>
            <br />
            LetsHyre Support Team
          </p>
        </div>
      </>
    ),
  },
];
