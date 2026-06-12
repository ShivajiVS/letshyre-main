import React from "react";
import { Tooltip } from "./Tooltip";

export const sections = [
  {
    id: "overview",
    title: "1. Platform Overview",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre is an AI-powered hiring platform that helps employers
          discover experienced and immediate-joiner candidates through:
        </p>
        <ul className="tc-list">
          <li>Resume Screening</li>
          <li>Role-Based AI Interviews</li>
          <li>Interview Reports</li>
          <li>Interview Transparency</li>
          <li>Candidate Validation</li>
        </ul>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: (
      <>
        <p className="tc-section-text">Users must:</p>
        <ul className="tc-list">
          <li>Be at least 18 years old</li>
          <li>Provide accurate and complete information</li>
          <li>Use the platform in compliance with applicable laws</li>
        </ul>
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
          <li>All submitted information is accurate and truthful</li>
          <li>Resumes and employment information are genuine</li>
          <li>AI interviews are completed honestly</li>
          <li>
            No impersonation or{" "}
            <span className="tc-highlight">fraudulent activity</span> will occur
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "employer-responsibilities",
    title: "4. Employer Responsibilities",
    content: (
      <>
        <p className="tc-section-text">Employers agree that:</p>
        <ul className="tc-list">
          <li>Job opportunities posted are genuine</li>
          <li>
            Candidate information will be used only for recruitment purposes
          </li>
          <li>Candidate data will not be sold, shared, or misused</li>
          <li>Hiring activities will comply with applicable laws</li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-interview-disclaimer",
    title: "5. AI Interview Disclaimer",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre uses artificial intelligence to conduct role-based interviews
          and generate interview reports.
        </p>
        <p className="tc-section-text">Users acknowledge that:</p>
        <ul className="tc-list">
          <li>
            AI-generated interview reports are{" "}
            <Tooltip text="Serving as a sign or suggestion rather than a definitive guarantee.">
              <span className="tc-highlight">indicative only</span>
            </Tooltip>
          </li>
          <li>Interview insights may not always be fully accurate</li>
          <li>
            Final hiring decisions remain the sole responsibility of employers
          </li>
        </ul>
        <p className="tc-section-text">LetsHyre does not guarantee:</p>
        <ul className="tc-list">
          <li>Employment opportunities</li>
          <li>Job offers</li>
          <li>Candidate selection</li>
          <li>Hiring outcomes</li>
        </ul>
      </>
    ),
  },
  {
    id: "subscription-services",
    title: "6. Subscription Services",
    content: (
      <>
        <p className="tc-section-text">
          Certain employer services may require paid{" "}
          <span className="tc-highlight">subscriptions</span>.
        </p>
        <p className="tc-section-text">LetsHyre reserves the right to:</p>
        <ul className="tc-list">
          <li>Modify subscription pricing</li>
          <li>Introduce new plans</li>
          <li>Update platform features</li>
        </ul>
        <p className="tc-section-text">
          Changes will apply{" "}
          <Tooltip text="Taking effect from the date of the change going forward.">
            prospectively
          </Tooltip>{" "}
          and will not affect completed purchases.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: (
      <>
        <p className="tc-section-text">
          All content, software, branding, technology, interview frameworks, and
          platform materials are the{" "}
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
          <li>Redistribute proprietary materials</li>
          <li>Use LetsHyre branding without written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited-activities",
    title: "8. Prohibited Activities",
    content: (
      <>
        <p className="tc-section-text">Users shall not:</p>
        <ul className="tc-list">
          <li>Submit false information</li>
          <li>Attempt unauthorized access</li>
          <li>Upload malicious software</li>
          <li>Disrupt platform operations</li>
          <li>Violate applicable laws.</li>
        </ul>
      </>
    ),
  },
  {
    id: "account-suspension",
    title: "9. Account Suspension or Termination",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre reserves the right to{" "}
          <span className="tc-highlight">suspend or terminate</span> accounts
          that:
        </p>
        <ul className="tc-list">
          <li>Violate these Terms</li>
          <li>Engage in fraudulent activity</li>
          <li>Misuse platform resources</li>
          <li>Provide false or misleading information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "10. Limitation of Liability",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre shall <span className="tc-highlight">not be liable</span>{" "}
          for:
        </p>
        <ul className="tc-list">
          <li>Hiring decisions</li>
          <li>Employment disputes</li>
          <li>Employer-candidate interactions</li>
          <li>Business losses</li>
          <li>
            Indirect or{" "}
            <Tooltip text="Damages that do not flow directly from an act but from some of the consequences of the act.">
              consequential damages
            </Tooltip>
            .
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content: (
      <>
        <p className="tc-section-text">
          These Terms shall be governed by and interpreted under the laws of
          India.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "12. Changes to Terms",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may revise these Terms periodically. Continued use of the
          platform constitutes acceptance of updated Terms.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "13. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            Email:{" "}
            <a href="mailto:support@letshyre.ai" className="tc-contact-email">
              support@letshyre.ai
            </a>
          </p>
        </div>
      </>
    ),
  },
];
