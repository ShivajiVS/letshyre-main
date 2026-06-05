import React from "react";

const CreditUsageCard = ({ credits, isLoading }) => {
  if (isLoading) {
    return (
      <div className="ds-sub-inner02" style={{ height: "100%" }}>
        <div
          className="ds-credit-card"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            className="skeleton-pulse"
            style={{ width: "60%", height: "24px", marginBottom: "30px" }}
          ></div>
          <div
            className="skeleton-pulse"
            style={{ width: "260px", height: "260px", borderRadius: "50%" }}
          ></div>
        </div>
      </div>
    );
  }

  const rawPercentage = credits?.usage_percent || 0;
  const creditPercentage = Math.round(rawPercentage);

  const size = 280;
  const center = 140;

  // Mask calculation for the pie reveal
  const maskRadius = 70;
  const maskCircumference = 2 * Math.PI * maskRadius;
  const strokeDashoffset = maskCircumference * (1 - rawPercentage / 100);

  // Outer and Inner dashed circle radii
  const rOuter = 125;
  const rInner = 95;

  const fontSans =
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  // Generate a unique mask ID so the browser repaints when the percentage changes
  const maskId = `progressMask-${creditPercentage}`;

  return (
    <div className="ds-sub-inner02" style={{ height: "100%" }}>
      <div
        className="ds-credit-card"
        style={{ height: "100%", padding: "36px", fontFamily: fontSans }}
      >
        <h3
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#111",
            marginBottom: "32px",
            fontFamily: fontSans,
          }}
        >
          Your Credit Balance
        </h3>

        <div
          style={{
            position: "relative",
            width: `${size}px`,
            height: `${size}px`,
            margin: "0 auto",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ display: "block" }}
          >
            <defs>
              <mask id={maskId}>
                <circle
                  cx={center}
                  cy={center}
                  r={maskRadius}
                  fill="none"
                  stroke="white"
                  strokeWidth={size}
                  strokeDasharray={maskCircumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </mask>
            </defs>

            {/* The entire group is rotated so 0 progress starts at 12 o'clock */}
            <g transform={`rotate(-90 ${center} ${center})`}>
              {/* Background dashed circles (grey) */}
              <circle
                cx={center}
                cy={center}
                r={rOuter}
                fill="none"
                stroke="#b0b0b0"
                strokeWidth="16"
                strokeDasharray="16 12"
              />
              <circle
                cx={center}
                cy={center}
                r={rInner}
                fill="none"
                stroke="#b0b0b0"
                strokeWidth="12"
                strokeDasharray="12 10"
              />

              {/* Foreground dashed circles with pie mask */}
              <g mask={`url(#${maskId})`}>
                <circle
                  cx={center}
                  cy={center}
                  r={rOuter}
                  fill="none"
                  stroke="#8cb5fa"
                  strokeWidth="16"
                  strokeDasharray="16 12"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={rInner}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="12"
                  strokeDasharray="12 10"
                />
              </g>
            </g>
          </svg>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              width: "60%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                margin: "0 0 6px 0",
                fontSize: "48px",
                fontWeight: "bold",
                color: "#5587f0",
                fontFamily: fontSans,
                lineHeight: "1",
              }}
            >
              {creditPercentage}%
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#888",
                lineHeight: "1.5",
                fontWeight: "500",
                fontFamily: fontSans,
              }}
            >
              {creditPercentage === 50 ? "Half" : `${creditPercentage}%`} of
              your credits is <br />
              done
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditUsageCard;
