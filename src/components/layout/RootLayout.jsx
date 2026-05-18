import { Outlet, useNavigation } from "react-router";

export function RootLayout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  return (
    <>
      {/* Top Edge Progress Bar */}
      {isLoading && (
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBar}>
            {/* The glowing tip of the progress bar */}
            <div style={styles.glowDrop}></div>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <main>
        <Outlet />
      </main>

      {/* Embedded CSS Keyframes */}
      <style>
        {`
          @keyframes slide-infinite {
            0% {
              transform: translateX(-100%) scaleX(0.2);
            }
            50% {
              transform: translateX(0%) scaleX(0.5);
            }
            100% {
              transform: translateX(100%) scaleX(0.2);
            }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

// Extracted styles object
const styles = {
  progressBarContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px", // Very thin, modern profile
    backgroundColor: "transparent",
    zIndex: 9999, // Ensure it sits above all navbars/modals
    pointerEvents: "none", // Prevent it from blocking clicks
    overflow: "hidden",
    animation: "fade-in 0.2s ease-out", // Smooth appearance
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "#2563eb", // Letshyre Brand Blue
    transformOrigin: "left center",
    animation:
      "slide-infinite 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
  },
  glowDrop: {
    position: "absolute",
    right: 0,
    width: "100px",
    height: "100%",
    boxShadow: "0 0 10px #2563eb, 0 0 5px #2563eb", // Creates the glowing tip
    transform: "rotate(3deg) translateY(-4px)",
  },
};
