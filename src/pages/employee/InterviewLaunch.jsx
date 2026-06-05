import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/interview-launch.css";

export function InterviewLaunch() {
  const [status, setStatus] = useState("initiating");
  const [appStatus, setAppStatus] = useState("pending");
  const cleanupRef = useRef(null);
  const navigate = useNavigate();

  const triggerDeepLink = () => {
    if (cleanupRef.current) cleanupRef.current();

    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.error("Auth parsing error", e);
    }

    const accessToken = storedUser?.access_token;
    const refreshToken = storedUser?.refresh_token;

    if (!accessToken) {
      navigate("/download", { replace: true });
      return;
    }

    let deepLink = `letshyre://interview?ac=${encodeURIComponent(accessToken)}`;
    if (refreshToken) {
      deepLink += `&rc=${encodeURIComponent(refreshToken)}`;
    }

    setStatus("launching");
    setAppStatus("pending");

    let hasBlurred = false;

    const onBlur = () => {
      hasBlurred = true;
      setAppStatus("success");
    };

    window.addEventListener("blur", onBlur);

    const checkTimeout = setTimeout(() => {
      if (!hasBlurred) {
        setAppStatus("failed");
      }
      window.removeEventListener("blur", onBlur);
    }, 3500);

    cleanupRef.current = () => {
      window.removeEventListener("blur", onBlur);
      clearTimeout(checkTimeout);
    };

    window.location.href = deepLink;
  };

  useEffect(() => {
    const launchTimer = setTimeout(() => {
      triggerDeepLink();
    }, 1000);

    return () => {
      clearTimeout(launchTimer);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="interview-launch-container">
      <motion.div 
        className="interview-launch-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          {status === "initiating" && (
            <motion.div
              key="initiating"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={itemVariants} className="interview-launch-icon-container">
                <div className="interview-launch-spinner"></div>
              </motion.div>
              <motion.h2 variants={itemVariants} className="interview-launch-title">Preparing your interview<span className="animated-dots"></span></motion.h2>
              <motion.p variants={itemVariants} className="interview-launch-description">
                Please wait while we get things ready.
              </motion.p>
            </motion.div>
          )}

          {status === "launching" && (
            <motion.div
              key="launching"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="interview-launch-icon-container">
                <motion.div 
                  className="interview-launch-icon"
                  animate={appStatus === "success" ? { y: 0 } : { y: [0, -6, 0] }}
                  transition={{ repeat: appStatus === "success" ? 0 : Infinity, duration: 3, ease: "easeInOut" }}
                >
                  {appStatus !== "success" && (
                    <motion.div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        zIndex: -1,
                      }}
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(37, 99, 235, 0.3)", 
                          "0 0 0 20px rgba(37, 99, 235, 0)", 
                          "0 0 0 0 rgba(37, 99, 235, 0)"
                        ] 
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: [0.215, 0.61, 0.355, 1] }}
                    />
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={appStatus === "success" ? "#16a34a" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <motion.rect x="2" y="3" width="20" height="14" rx="2" ry="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}></motion.rect>
                    <motion.line x1="8" y1="21" x2="16" y2="21" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}></motion.line>
                    <motion.line x1="12" y1="17" x2="12" y2="21" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}></motion.line>
                  </svg>
                </motion.div>
              </motion.div>

              <motion.h2 variants={itemVariants} className="interview-launch-title">
                {appStatus === "success" ? "App Launched!" : "Opening LetsHyre App"}
                {appStatus === "pending" && <span className="animated-dots"></span>}
              </motion.h2>

              <motion.div variants={itemVariants} style={{ minHeight: "60px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                <AnimatePresence mode="wait">
                  {appStatus === "failed" ? (
                    <motion.div key="failed" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                      <p className="interview-launch-description" style={{ color: "#dc2626", fontWeight: 500, margin: "0 0 12px 0" }}>
                        We couldn't detect the app opening.
                      </p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerDeepLink}
                        style={{
                          background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px",
                          padding: "8px 16px", fontSize: "14px", cursor: "pointer", fontWeight: 500, color: "#334155"
                        }}
                      >
                        Try Again
                      </motion.button>
                    </motion.div>
                  ) : appStatus === "success" ? (
                    <motion.p key="success" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="interview-launch-description" style={{ margin: 0, color: "#16a34a", fontWeight: 500 }}>
                      You can safely close this window.
                    </motion.p>
                  ) : (
                    <motion.p key="pending" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="interview-launch-description" style={{ margin: 0 }}>
                      Click <strong>Open Link</strong> if your browser asks for permission.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants} style={{ paddingTop: "20px", borderTop: "1px solid #e2e8f0", width: "100%", marginTop: "16px" }}>
                <p className="interview-launch-description" style={{ fontSize: "14px", margin: 0 }}>
                  Don't have the desktop app?{" "}
                  <motion.span whileHover={{ scale: 1.05 }} style={{ display: "inline-block" }}>
                    <Link to="/download" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                      Download it here
                    </Link>
                  </motion.span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
