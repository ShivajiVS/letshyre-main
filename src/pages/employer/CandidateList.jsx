import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import api from "@/services/api";

export function CandidateList() {
  const navigate = useNavigate();

  const [credits, setCredits] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("all");

  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState("ai");
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(null);

  /* ----------------------------- */
  useEffect(() => {
    boot();
  }, []);

  /* ----------------------------- */
  async function boot() {
    try {
      setLoading(true);

      const [jobRes, creditRes] = await Promise.all([
        api.get("/user/v1/employer_jobs/"),
        api.get("/payment/v1/employer_credits/"),
      ]);

      const jobRows = normalize(jobRes.data);

      const mappedJobs = jobRows.map((j) => ({
        id: j.id,
        title: j.title || j.job_title || "Job",
      }));

      setJobs(mappedJobs);

      const creditData = creditRes.data?.data || creditRes.data || {};

      setCredits(creditData.available_credits || 0);

      if (mappedJobs.length) {
        await loadAllCandidates(mappedJobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------- */
  function normalize(payload) {
    if (Array.isArray(payload)) return payload;

    if (Array.isArray(payload?.results)) return payload.results;

    if (Array.isArray(payload?.data)) return payload.data;

    if (Array.isArray(payload?.data?.results)) return payload.data.results;

    return [];
  }

  /* ----------------------------- */
  function randomScore() {
    return Math.floor(70 + Math.random() * 28);
  }

  function maskName(name) {
    if (!name) return "C******";

    return name
      .split(" ")
      .map((part) => part[0] + "*".repeat(Math.max(3, part.length - 1)))
      .join(" ");
  }

  /* ----------------------------- */
  async function fetchCandidates(jobId) {
    try {
      const res = await api.get(
        `/user/v1/employer_candidate_job_management/${jobId}/`
      );

      const rows = normalize(res.data);

      return rows.map((c) => {
        const fullName =
          c.candidate?.full_name ||
          c.candidate_name ||
          c.full_name ||
          c.user?.name ||
          c.user?.username ||
          "Candidate";

        return {
          id: c.id,
          applicationId: c.id,
          jobId,

          name: fullName,

          maskedName: maskName(fullName),

          role:
            c.job?.title ||
            c.job_title ||
            c.applied_role ||
            "Full Stack Developer",

          experience: c.years_experience || c.experience || "5 Years",

          email: c.email || c.user?.email,

          location: c.location || "Hyderabad",

          verified: true,

          aiScore: c.ai_match_score || c.interview_score || randomScore(),

          status: c.application_status || "Applied",

          unlocked: localStorage.getItem(`candidate_unlock_${c.id}`) === "yes",

          avatar:
            c.profile_pic ||
            `https://randomuser.me/api/portraits/men/${Math.floor(
              Math.random() * 70
            )}.jpg`,
        };
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /* ----------------------------- */
  async function loadAllCandidates(jobList = jobs) {
    const results = await Promise.all(
      jobList.map((j) => fetchCandidates(j.id))
    );

    setCandidates(results.flat());
  }

  /* ----------------------------- */
  async function handleJobChange(id) {
    setSelectedJob(id);

    if (id === "all") {
      loadAllCandidates();
      return;
    }

    const rows = await fetchCandidates(id);

    setCandidates(rows);
  }

  /* ----------------------------- */
  async function unlockProfile(candidate) {
    if (credits < 1) {
      navigate("/employer/managing-subscriptions");
      return;
    }

    try {
      setUnlocking(candidate.id);

      /*
consume credit
*/
      await api.patch("/payment/v1/employer_credits/", {
        available_credits: credits - 1,
      });

      setCredits((prev) => prev - 1);

      localStorage.setItem(`candidate_unlock_${candidate.id}`, "yes");

      setCandidates((prev) =>
        prev.map((c) => (c.id === candidate.id ? { ...c, unlocked: true } : c))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUnlocking(null);
    }
  }

  /* ----------------------------- */
  const filtered = useMemo(() => {
    if (filter === "opened") {
      return candidates.filter((c) => c.unlocked);
    }

    if (filter === "applied") {
      return candidates.filter((c) => c.status.toLowerCase() === "applied");
    }

    /* ai matched default */
    return [...candidates].sort((a, b) => b.aiScore - a.aiScore);
  }, [filter, candidates]);

  /* ----------------------------- */
  if (loading) {
    return <div style={styles.loading}>Loading candidate pool...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <div>
            <h2 style={styles.heading}>Candidate Pool</h2>

            <p style={styles.sub}>
              Sort applicants by AI match, applied, or unlocked profiles.
            </p>
          </div>

          <div style={styles.rightFilters}>
            <select
              value={selectedJob}
              onChange={(e) => handleJobChange(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Jobs</option>

              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="ai">AI Matched</option>

              <option value="applied">Applied</option>

              <option value="opened">Opened</option>
            </select>
          </div>
        </div>

        <div style={styles.creditBox}>
          Available Credits:
          <b>{credits}</b>
        </div>

        {filtered.map((candidate) => (
          <div key={candidate.id} style={styles.row}>
            <img src={candidate.avatar} style={styles.avatar} />

            <div style={styles.col1}>
              <div style={styles.name}>
                {candidate.unlocked ? candidate.name : candidate.maskedName}
              </div>

              <div style={styles.role}>&lt;/&gt; {candidate.role}</div>

              {!candidate.unlocked && (
                <div style={styles.lockTag}>🔒 Profile Locked</div>
              )}
            </div>

            <div style={styles.scoreCol}>
              <div style={styles.label}>AI Interview Score</div>

              <div style={styles.scoreWrap}>
                <div
                  style={{
                    ...styles.scoreBar,
                    width: candidate.aiScore + "%",
                  }}
                />

                <span style={styles.scoreBadge}>{candidate.aiScore}%</span>
              </div>
            </div>

            <div style={styles.verifyCol}>
              <div>✔ Profile Verified</div>

              <div>🧪 {candidate.experience}</div>
            </div>

            <div>
              {candidate.unlocked ? (
                <button style={styles.openBtn}>Opened</button>
              ) : (
                <button
                  disabled={unlocking === candidate.id}
                  style={styles.unlockBtn}
                  onClick={() => unlockProfile(candidate)}
                >
                  {unlocking === candidate.id
                    ? "Unlocking..."
                    : "Unlock (1 Credit)"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "35px",
    background: "#f4f7ff",
    minHeight: "100vh",
  },

  loading: {
    padding: "60px",
  },

  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },

  sub: {
    color: "#666",
  },

  rightFilters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  select: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  creditBox: {
    background: "#eef4ff",
    padding: "12px 18px",
    borderRadius: "12px",
    display: "inline-block",
    marginBottom: "20px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "70px 1.5fr 1.2fr 1fr auto",
    gap: "25px",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #eef2ff",
  },

  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    objectFit: "cover",
  },

  col1: {},

  name: {
    fontSize: "20px",
    fontWeight: 600,
  },

  role: {
    color: "#666",
    marginTop: "6px",
  },

  lockTag: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#ef4444",
  },

  scoreCol: {},

  label: {
    fontSize: "14px",
    marginBottom: "10px",
  },

  scoreWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  scoreBar: {
    height: "6px",
    background: "#4f86ff",
    borderRadius: "20px",
    minWidth: "100px",
  },

  scoreBadge: {
    fontSize: "12px",
    color: "#4f86ff",
  },

  verifyCol: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#5b6b8a",
  },

  unlockBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  openBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
  },
};
