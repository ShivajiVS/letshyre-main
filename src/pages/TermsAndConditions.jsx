import React from "react";
import { PolicyLayout } from "@/components/common/PolicyLayout";
import { sections } from "@/components/TermsAndConditions/SectionsData";

export function TermsAndConditions() {
  return (
    <PolicyLayout 
      title="Terms & Conditions"
      metaDescription="Terms and Conditions for using LetsHyre. Read our policies on candidate and employer responsibilities, AI interviews, and more."
      intro="By accessing or using LetsHyre, you agree to be bound by these Terms & Conditions."
      sections={sections}
    />
  );
}
