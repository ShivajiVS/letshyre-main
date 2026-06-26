import "./GlobalLoader.css";

export function GlobalLoader() {
  return (
    <div className="gl-container">
      <img src="/logo2.png" alt="Letshyre" className="gl-logo" />

      <div className="gl-dots">
        <div className="gl-dot" />
        <div className="gl-dot" />
        <div className="gl-dot" />
      </div>
    </div>
  );
}
