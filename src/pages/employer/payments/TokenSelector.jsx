import { useState } from "react";

export function TokenSelector({ selectedTokens, onChange, isPending }) {
  const [customAmount, setCustomAmount] = useState("");
  const packages = [10, 50];

  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val)) {
      setCustomAmount(val);
      if (val && parseInt(val) > 0) {
        onChange(parseInt(val));
      }
    }
  };

  const handlePackageClick = (pkg) => {
    setCustomAmount("");
    onChange(pkg);
  };

  return (
    <div className="sub-card">
      <h2 className="card-title">
        <i className="bi bi-coin" style={{ color: "var(--brand-blue)" }}></i>
        Select Tokens
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "var(--slate-600)" }}>
        Tokens allow you to unlock premium candidate profiles and schedule AI interviews.
      </p>

      <div className="token-options">
        {packages.map((pkg) => (
          <button
            key={pkg}
            type="button"
            className={`token-btn ${selectedTokens === pkg && !customAmount ? "active" : ""}`}
            onClick={() => handlePackageClick(pkg)}
            disabled={isPending}
          >
            {pkg} Tokens
          </button>
        ))}
      </div>

      <div className="custom-input-group">
        <label htmlFor="customTokens">Or enter custom amount</label>
        <input
          id="customTokens"
          type="number"
          min="1"
          className="custom-token-input"
          placeholder="e.g. 100"
          value={customAmount}
          onChange={handleCustomChange}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
