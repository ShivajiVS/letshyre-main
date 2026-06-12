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
          <li>Interview Transcripts</li>
          <li>Interview Reports</li>
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
          <li>pan, registration numbers.</li>
          <li>Hiring Requirements</li>
          <li>Job Descriptions.</li>
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
          <li>Generate interview reports and candidate insights</li>
          <li>Facilitate recruitment and hiring processes</li>
          <li>Improve platform performance and user experience</li>
          <li>Communicate platform updates and notifications</li>
          <li>Prevent fraud, abuse, and unauthorized activity.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-interview-data",
    title: "3. AI Interview Data",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre uses artificial intelligence technologies to conduct
          role-based interviews and generate interview reports.
        </p>
        <p className="tc-section-text">We may process:</p>
        <ul className="tc-list">
          <li>Interview responses</li>
          <li>Interview transcripts</li>
          <li>Interview recordings (if applicable)</li>
          <li>AI-generated interview reports</li>
        </ul>
        <p className="tc-section-text">
          These reports are intended to assist employers in evaluating
          candidates and are not a guarantee of hiring outcomes.
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
          <li>Verified employers using LetsHyre</li>
          <li>Authorized service providers supporting platform operations</li>
          <li>
            Government or legal authorities when required by applicable law
          </li>
        </ul>
        <p className="tc-section-text">
          LetsHyre does not sell personal information to third parties.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: (
      <>
        <p className="tc-section-text">
          We implement reasonable technical and organizational measures to
          protect personal information from unauthorized access, disclosure,
          alteration, or destruction.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: (
      <>
        <p className="tc-section-text">
          We retain information only as long as necessary to provide services,
          comply with legal obligations, resolve disputes, and enforce our
          agreements.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "7. User Rights",
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
      </>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookies",
    content: (
      <>
        <p className="tc-section-text">
          LetsHyre may use cookies and analytics technologies to improve
          platform functionality, security, and user experience.
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
          Our platform may contain links to third-party websites or services.
          LetsHyre is not responsible for the privacy practices of third-party
          platforms.
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
          LetsHyre may update this Privacy Policy from time to time. Continued
          use of the platform after updates constitutes acceptance of the
          revised policy.
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
            For privacy-related questions:
            <br />
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
