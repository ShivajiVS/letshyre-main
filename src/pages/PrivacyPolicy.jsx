import React from "react";
import { PolicyLayout } from "@/components/common/PolicyLayout";
import { sections } from "@/components/privacyPolicy/PrivacyPolicyData";

export function PrivacyPolicy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      metaDescription="Read LetsHyre's Privacy Policy. Learn about how we collect, use, and protect your personal information and data."
      intro={
        <>
          Welcome to LetsHyre ("LetsHyre", "we", "our", or "us"). We are
          committed to protecting your privacy and ensuring the security of your
          personal information.
          <br />
          <br />
          By using the LetsHyre platform, you consent to the collection, use, storage, and processing of
          your information as described in this Privacy Policy.
        </>
      }
      sections={sections}
    />
  );
}
