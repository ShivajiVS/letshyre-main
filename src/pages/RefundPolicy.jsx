import React from "react";
import { PolicyLayout } from "@/components/common/PolicyLayout";
import { sections } from "@/components/refundPolicy/RefundPolicyData";

export function RefundPolicy() {
  return (
    <PolicyLayout 
      title="Refund Policy"
      metaDescription="Read LetsHyre's Refund Policy. Learn about our refund eligibility, non-refundable services, and subscription cancellation terms."
      intro="This Refund Policy outlines the terms and conditions regarding refunds and cancellations for LetsHyre's subscription-based hiring solutions."
      sections={sections}
    />
  );
}
