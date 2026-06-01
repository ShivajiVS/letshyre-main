export function PaymentSkeleton() {
  return (
    <div className="sub-card">
      <div className="card-title skeleton-box" style={{ width: "150px", height: "28px" }}></div>
      <div className="summary-details mt-4">
        <div className="skeleton-box skeleton-row"></div>
        <div className="skeleton-box skeleton-row"></div>
        <div className="skeleton-box skeleton-row mt-4" style={{ height: "32px" }}></div>
      </div>
      <div className="skeleton-box skeleton-btn"></div>
    </div>
  );
}
