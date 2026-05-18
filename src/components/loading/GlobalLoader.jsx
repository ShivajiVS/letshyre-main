export function GlobalLoader() {
  // Split the brand name into an array so we can animate each letter individually
  const brandName = "Letshyre".split("");

  return (
    <div style={styles.container}>
      {/* Sleek Dual-Ring Spinner */}
      <div style={styles.spinnerContainer}>
        <div style={{ ...styles.ring, ...styles.outerRing }}></div>
        <div style={{ ...styles.ring, ...styles.innerRing }}></div>
      </div>

      {/* Cascading Wave Text Animation */}
      <div style={styles.textContainer}>
        {brandName.map((letter, index) => (
          <span
            key={index}
            style={{
              ...styles.letter,
              // This delay staggers the animation, creating the "wave" effect
              animationDelay: `${index * 0.1}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Embedded CSS Keyframes */}
      <style>
        {`
          @keyframes spin-outer {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-inner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          @keyframes wave-text {
            0%, 100% { 
              transform: translateY(0); 
              color: #64748b; /* Muted gray */
            }
            50% { 
              transform: translateY(-8px); 
              color: #2563eb; /* Letshyre Brand Blue */
              text-shadow: 0px 4px 10px rgba(37, 99, 235, 0.3);
            }
          }
        `}
      </style>
    </div>
  );
}

// Extracted styles object to keep the JSX clean
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#f8fafc", // Clean, tech-friendly background
  },
  spinnerContainer: {
    position: "relative",
    width: "60px",
    height: "60px",
    marginBottom: "24px",
  },
  ring: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "3px solid transparent",
  },
  outerRing: {
    borderTopColor: "#2563eb", // Blue
    borderBottomColor: "#2563eb",
    animation:
      "spin-outer 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite",
  },
  innerRing: {
    width: "70%",
    height: "70%",
    top: "15%",
    left: "15%",
    borderLeftColor: "#93c5fd", // Lighter blue
    borderRightColor: "#93c5fd",
    animation: "spin-inner 0.8s linear infinite",
  },
  textContainer: {
    display: "flex",
    gap: "2px",
    fontSize: "1.5rem",
    fontWeight: "600",
    fontFamily: "system-ui, -apple-system, sans-serif",
    letterSpacing: "1px",
  },
  letter: {
    display: "inline-block",
    animation: "wave-text 1.5s ease-in-out infinite",
  },
};
