import React, { useState } from "react";
import { useStayUpdated } from "@/hooks/common/useStayUpdated";

export function StayUpdatedForm() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useStayUpdated();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }
    subscribe(email, {
      onSuccess: () => {
        setEmail("");
      },
    });
  };

  return (
    <form className="ft-form" onSubmit={handleSubscribe}>
      <input
        type="email"
        placeholder="Your Email"
        className="ft-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        required
      />
      <button type="submit" className="ft-submit" disabled={isPending}>
        {isPending ? <div className="ft-spinner"></div> : "✉"}
      </button>
    </form>
  );
}
