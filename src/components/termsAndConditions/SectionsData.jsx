import React from "react";
import { Tooltip } from "./Tooltip";

export const sections = [
  {
    id: "platform-overview",
    title: "1. Platform Overview",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre is an AI-powered hiring platform that helps employers
          discover experienced professionals through:
        </p>
        <ul className="tc-list">
          <li>Resume Screening</li>
          <li>Role-Based AI Interviews</li>
          <li>Interview Scorecards</li>
          <li>Interview Transparency</li>
          <li>Candidate Screening</li>
        </ul>
        <br />
        <p className="tc-section-text">
          LetsHyre is designed to streamline the hiring process by enabling
          employers to evaluate candidates through AI-assisted interviews and
          structured interview insights.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: (
      <>
        <p className="tc-section-text">
          <strong>2.1 Candidate Eligibility</strong>
        </p>
        <p className="tc-section-text">
          LetsHyre is designed exclusively for experienced professionals seeking
          employment opportunities. To use LetsHyre as a candidate, you must:
        </p>
        <ul className="tc-list">
          <li>Have prior professional work experience.</li>
          <li>Be actively seeking employment opportunities.</li>
          <li>
            Be an immediate joiner or a candidate currently serving a notice
            period.
          </li>
          <li>
            Provide accurate, complete, and truthful professional information.
          </li>
        </ul>
        <br />
        <p className="tc-section-text">
          Freshers, students, interns, and candidates without prior professional
          work experience may not be eligible to use certain candidate services
          available on the platform.
        </p>
        <p className="tc-section-text">
          LetsHyre reserves the right to review, restrict, suspend, or remove
          candidate profiles that do not align with the intended purpose of the
          platform.
        </p>
        <br />
        <p className="tc-section-text">
          <strong>2.2 Employer Eligibility:</strong>
        </p>
        <p className="tc-section-text">
          Employers, recruiters, hiring managers, and authorized representatives
          of organizations may use the platform for legitimate recruitment and
          hiring purposes.
        </p>
        <p className="tc-section-text">
          Employers must provide accurate company information and comply with
          all applicable employment and recruitment laws.
        </p>
      </>
    ),
  },
  {
    id: "candidate-responsibilities",
    title: "3. Candidate Responsibilities",
    content: (
      <>
        <p className="tc-section-text">Candidates agree that:</p>
        <ul className="tc-list">
          <li>All submitted information is accurate and truthful.</li>
          <li>
            Resumes, employment history, qualifications, and experience details
            are genuine.
          </li>
          <li>
            AI interviews are completed honestly and without impersonation.
          </li>
          <li>
            Any information provided during interviews reflects their actual
            professional experience and skills.
          </li>
          <li>
            They will not create multiple misleading profiles or engage in
            fraudulent activity.
          </li>
        </ul>
        <br />
        <p className="tc-section-text">
          LetsHyre reserves the right to suspend or remove profiles found to
          contain false, misleading, or fraudulent information.
        </p>
      </>
    ),
  },
  {
    id: "profile-availability",
    title: "4. Profile Availability",
    content: (
      <>
        <p className="tc-section-text">
          To maintain a high-quality and actively available talent pool,
          candidate profiles remain active on the platform for up to 90 days
          from the date of profile creation.
        </p>
        <p className="tc-section-text">
          Candidates may update their profile information during this period and
          participate in additional AI interviews, including retakes for the
          same role or interviews for different roles, in accordance with
          platform policies.
        </p>
        <p className="tc-section-text">
          LetsHyre may allow candidates to complete up to three interview
          attempts to improve their interview scorecards, profile strength, and
          visibility to employers.
        </p>
        <p className="tc-section-text">
          After the 90-day period expires, candidate profiles may be permanently
          removed from the active LetsHyre candidate pool.
        </p>
        <p className="tc-section-text">
          Candidates who wish to continue using LetsHyre after profile removal
          may create a new profile, subject to the platform's policies and
          requirements.
        </p>
      </>
    ),
  },
  {
    id: "employer-responsibilities",
    title: "5. Employer Responsibilities",
    content: (
      <>
        <p className="tc-section-text">Employers agree that:</p>
        <ul className="tc-list">
          <li>Job opportunities posted on the platform are genuine.</li>
          <li>
            Candidate information will be used solely for recruitment and hiring
            purposes.
          </li>
          <li>
            Candidate information will not be sold, shared, distributed, or
            misused.
          </li>
          <li>
            Hiring activities will comply with all applicable employment laws
            and regulations.
          </li>
          <li>
            Employers will not use candidate data for marketing, solicitation,
            or unrelated business activities.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-interview-disclaimer",
    title: "6. AI Interview Disclaimer",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre uses artificial intelligence technologies to conduct
          role-based interviews and generate interview reports and insights.
        </p>
        <p className="tc-section-text">Users acknowledge that:</p>
        <ul className="tc-list">
          <li>
            AI-generated interview reports and insights are{" "}
            <Tooltip text="Serving as a sign or suggestion rather than a definitive guarantee.">
              <span className="tc-highlight">intended to assist</span>
            </Tooltip>{" "}
            hiring decisions.
          </li>
          <li>
            Interview insights may not always be fully accurate or complete.
          </li>
          <li>
            AI-generated reports should not be considered the sole basis for
            employment decisions.
          </li>
          <li>
            Final hiring decisions remain solely the responsibility of
            employers.
          </li>
          <li>
            LetsHyre provides AI-assisted interview and candidate screening
            services.
          </li>
          <li>
            LetsHyre does not guarantee employment opportunities, job offers,
            candidate selection, successful hiring outcomes, or recruitment
            results.
          </li>
          <li>
            Final hiring decisions remain solely the responsibility of
            employers.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payment-and-candidate-unlocks",
    title: "7. Payment and Candidate Unlocks",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre operates on a Pay-Per-Unlock hiring model.
        </p>
        <p className="tc-section-text">
          Employers may make one-time payments to unlock:
        </p>
        <ul className="tc-list">
          <li>Candidate profiles</li>
          <li>Interview Scorecards</li>
          <li>Interview Recordings</li>
          <li>Candidate contact information</li>
        </ul>
        <br />
        <p className="tc-section-text">
          Once candidate information has been successfully unlocked and made
          available to the employer, the transaction is considered completed.
        </p>
        <p className="tc-section-text">
          All payments are subject to the LetsHyre Refund Policy.
        </p>
        <p className="tc-section-text">
          LetsHyre reserves the right to modify pricing, unlock fees, and
          payment structures at any time. Any pricing changes will apply only to
          future transactions.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual Property",
    content: (
      <>
        <p className="tc-section-text">
          All platform content, software, branding, logos, interview frameworks,
          reports, technology, designs, and related materials are the exclusive{" "}
          <Tooltip text="Creations of the mind, such as software, branding, and proprietary algorithms.">
            <span className="tc-highlight">property of LetsHyre</span>
          </Tooltip>
          .
        </p>
        <p className="tc-section-text">Users may not:</p>
        <ul className="tc-list">
          <li>Copy platform content</li>
          <li>
            <Tooltip text="Deconstructing software to extract its source code or proprietary logic.">
              Reverse engineer
            </Tooltip>{" "}
            platform functionality
          </li>
          <li>Reproduce proprietary materials</li>
          <li>Distribute platform content without authorization</li>
          <li>Use LetsHyre branding without prior written permission</li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited-activities",
    title: "9. Prohibited Activities",
    content: (
      <>
        <p className="tc-section-text">Users shall not:</p>
        <ul className="tc-list">
          <li>Submit false or misleading information.</li>
          <li>Impersonate another individual or organization.</li>
          <li>Attempt unauthorized access to the platform.</li>
          <li>Upload malicious software, malware, or harmful code.</li>
          <li>Interfere with platform functionality or security.</li>
          <li>Misuse candidate or employer information.</li>
          <li>Violate any applicable laws or regulations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-suspension",
    title: "10. Account Suspension or Termination",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to{" "}
          <span className="tc-highlight">suspend, restrict, or terminate</span>{" "}
          accounts that:
        </p>
        <ul className="tc-list">
          <li>Violate these Terms & Conditions.</li>
          <li>Engage in fraudulent activity.</li>
          <li>Misuse platform resources.</li>
          <li>Provide false or misleading information.</li>
          <li>Attempt to compromise platform security.</li>
        </ul>
        <br />
        <p className="tc-section-text">
          Such actions may be taken without prior notice where necessary to
          protect the platform, its users, or legal obligations.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "11. Limitation of Liability",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre shall <span className="tc-highlight">not be liable</span>{" "}
          for:
        </p>
        <ul className="tc-list">
          <li>Hiring decisions made by employers.</li>
          <li>Employment disputes between employers and candidates.</li>
          <li>Candidate-employer communications or agreements.</li>
          <li>Business losses or recruitment outcomes.</li>
          <li>
            Indirect, incidental, special, or{" "}
            <Tooltip text="Damages that do not flow directly from an act but from some of the consequences of the act.">
              consequential damages
            </Tooltip>{" "}
            arising from use of the platform.
          </li>
        </ul>
        <br />
        <p className="tc-section-text">
          Users acknowledge that they use the platform at their own discretion
          and risk.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "12. Privacy",
    content: (
      <>
        <p className="tc-section-text">
          Use of LetsHyre is also governed by our Privacy Policy, which explains
          how personal information is collected, processed, stored, and
          protected.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "13. Governing Law",
    content: (
      <>
        <p className="tc-section-text">
          These Terms & Conditions shall be governed by the laws of India.
        </p>
        <p className="tc-section-text">
          Any disputes arising from the use of LetsHyre shall be subject to the
          jurisdiction of the courts in Hyderabad, Telangana.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "14. Changes to Terms",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to modify these Terms & Conditions at any
          time.
        </p>
        <p className="tc-section-text">
          Updated versions will be published on the platform, and continued use
          of LetsHyre after such updates constitutes acceptance of the revised
          Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "15. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            For questions regarding these Terms & Conditions, please contact:
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
