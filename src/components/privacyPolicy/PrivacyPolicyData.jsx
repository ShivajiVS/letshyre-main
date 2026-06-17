import React from "react";

export const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p className="tc-section-text">
          <strong>Candidate Information:</strong>
        </p>
        <p className="tc-section-text">We may collect:</p>
        <ul className="tc-list">
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>Resume/CV</li>
          <li>Employment History</li>
          <li>Educational Qualifications</li>
          <li>Professional Skills and Experience</li>
          <li>AI Interview Responses</li>
          <li>Interview Scorecards</li>
          <li>Profile Information submitted by candidates</li>
        </ul>
        <br />
        <p className="tc-section-text">
          <strong>Employer Information:</strong>
        </p>
        <p className="tc-section-text">We may collect:</p>
        <ul className="tc-list">
          <li>Company Name</li>
          <li>Recruiter Name</li>
          <li>Business Email Address</li>
          <li>Contact Information</li>
          <li>Hiring Requirements</li>
          <li>Job Descriptions</li>
          <li>Profile Information submitted by employers</li>
        </ul>
        <br />
        <p className="tc-section-text">
          <strong>Technical Information:</strong>
        </p>
        <p className="tc-section-text">We may automatically collect:</p>
        <ul className="tc-list">
          <li>IP Address</li>
          <li>Browser Information</li>
          <li>Device Information</li>
          <li>Operating System</li>
          <li>Website Usage Data</li>
          <li>Cookies and Similar Technologies</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Information",
    content: (
      <>
        <p className="tc-section-text">We use collected information to:</p>
        <ul className="tc-list">
          <li>Create and manage user accounts</li>
          <li>Match candidates with relevant job opportunities</li>
          <li>Conduct AI-powered role-based interviews</li>
          <li>Generate interview scorecards and candidate insights</li>
          <li>Facilitate recruitment and hiring processes</li>
          <li>Improve platform performance and user experience</li>
          <li>Communicate platform updates and notifications</li>
          <li>Prevent fraud, abuse, and unauthorized activity.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-interview-processing-and-consent",
    title: "3. AI Interview Processing and Consent",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre uses artificial intelligence technologies to conduct
          role-based interviews and generate interview scorecards and insights.
        </p>
        <p className="tc-section-text">
          By participating in AI interviews, candidates acknowledge and consent
          to:
        </p>
        <ul className="tc-list">
          <li>AI-based processing of interview responses</li>
          <li>Generation of AI-powered interview scorecards and insights</li>
          <li>Evaluation of responses for recruitment purposes</li>
          <li>
            Sharing of interview scorecards and insights with employers through
            the LetsHyre platform
          </li>
        </ul>
        <br />
        <p className="tc-section-text">We may process:</p>
        <ul className="tc-list">
          <li>Interview Responses</li>
          <li>Interview Recordings</li>
          <li>AI-Generated Interview Scorecards</li>
        </ul>
        <br />
        <p className="tc-section-text">
          AI-generated scorecards and insights are intended to assist employers
          in evaluating candidates and do not guarantee hiring outcomes.
        </p>
      </>
    ),
  },
  {
    id: "sharing-of-information",
    title: "4. Sharing of Information",
    content: (
      <>
        <p className="tc-section-text">We may share information with:</p>
        <ul className="tc-list">
          <li>Employers using LetsHyre for legitimate recruitment purposes</li>
          <li>Authorized service providers supporting platform operations</li>
          <li>
            Trusted cloud hosting, analytics, communication, payment processing,
            and AI service providers
          </li>
          <li>
            Government or legal authorities when required by applicable law
          </li>
        </ul>
        <br />
        <p className="tc-section-text">
          Candidate profiles may be matched and presented to employers based on
          job requirements, role relevance, skills, experience, and other
          matching criteria.
        </p>
        <p className="tc-section-text">
          Detailed candidate information, interview scorecards, interview
          recordings, and candidate contact information may be made available to
          employers when employers choose to unlock candidate information
          through the LetsHyre platform.
        </p>
        <p className="tc-section-text">
          Employers are responsible for using candidate information solely for
          legitimate recruitment purposes and in accordance with applicable
          laws.
        </p>
        <p className="tc-section-text">
          LetsHyre does not sell personal information to third parties.
        </p>
      </>
    ),
  },
  {
    id: "profile-activity-and-data-retention",
    title: "5. Profile Activity and Data Retention",
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
    id: "user-rights",
    title: "6. User Rights",
    content: (
      <>
        <p className="tc-section-text">Users may:</p>
        <ul className="tc-list">
          <li>Access their personal information</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of their account</li>
          <li>
            Request removal of personal information where legally applicable
          </li>
        </ul>
        <br />
        <p className="tc-section-text">
          Users may submit account deletion or data removal requests by
          contacting LetsHyre support. Certain information may be retained where
          required by law or for legitimate business purposes.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "7. Data Security",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre implements reasonable technical and organizational safeguards
          to protect personal information from unauthorized access, disclosure,
          alteration, misuse, or destruction.
        </p>
        <p className="tc-section-text">
          While we take appropriate measures to protect information, no method
          of electronic storage or transmission over the internet can be
          guaranteed to be completely secure.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookies",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may use cookies and similar technologies to improve platform
          functionality, security, analytics, performance, and user experience.
        </p>
        <p className="tc-section-text">
          Users may choose to disable cookies through their browser settings;
          however, certain platform features may not function properly.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "9. Third-Party Services",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may use trusted third-party service providers to support
          platform operations, including hosting, analytics, communication,
          payment processing, and AI-related services.
        </p>
        <p className="tc-section-text">
          These service providers may process information on our behalf solely
          for the purpose of providing their services to LetsHyre.
        </p>
        <p className="tc-section-text">
          LetsHyre is not responsible for the privacy practices of third-party
          websites or services that may be accessed through external links.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-this-policy",
    title: "10. Changes to This Policy",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may update this Privacy Policy from time to time.
        </p>
        <p className="tc-section-text">
          Any updates will be published on this page. Continued use of the
          platform after such updates constitutes acceptance of the revised
          Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "11. Contact Us",
    content: (
      <>
        <div className="tc-contact">
          <p className="tc-section-text">
            For privacy-related questions, requests, or concerns, please
            contact:
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
