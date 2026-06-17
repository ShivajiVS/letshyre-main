import React from "react";
import { PolicyLayout } from "@/components/common/PolicyLayout";
import { sections } from "@/components/refundPolicy/RefundPolicyData";

export function RefundPolicy() {
  return (
    <PolicyLayout 
      title="Refund Policy"
      metaDescription="Read LetsHyre's Refund Policy. Learn about our refund eligibility, non-refundable purchases, and review process for our Pay-Per-Unlock hiring model."
      intro="Welcome to LetsHyre. This Refund Policy explains the conditions under which refunds may be provided for payments made on the LetsHyre platform."
      sections={sections}
    />
  );
}
