import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import "./view-jobs.css";
import { useJobs } from "@/hooks/employer/useEmployerJobs";
import { JobList } from "@/components/employer/view-jobs/JobList";
import { Pagination } from "@/components/employer/view-jobs/Pagination";
import { LoadingSkeleton } from "@/components/employer/view-jobs/LoadingSkeleton";

export function ViewJobs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get("status") || "all";
  const approvalStatus = searchParams.get("approval_status");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const queryParams = useMemo(() => {
    const params = { page: currentPage };
    if (urlStatus && urlStatus !== "all") {
      if (urlStatus === "pending") {
        params.approval_status = "pending";
      } else {
        params.status = urlStatus;
      }
    }
    if (approvalStatus) params.approval_status = approvalStatus;
    return params;
  }, [urlStatus, approvalStatus, currentPage]);

  const { data: jobsData = {}, isLoading, isError } = useJobs(queryParams);

  const currentJobs = jobsData.results || [];
  const totalPages = jobsData.total_pages || 1;

  const handleTabChange = (tab) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (tab === "all") {
        newParams.delete("status");
      } else {
        newParams.set("status", tab);
      }
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="ho-error">
        Failed to load jobs. Please try again later.
      </div>
    );
  }

  return (
    <>
      <div className="ho-header">
        <h1>All Jobs</h1>
      </div>
      <div className="cd-job-tabs">
        {["all", "open", "closed", "paused", "pending"].map((tab) => (
          <button
            key={tab}
            className={`cd-tab ${urlStatus.toLowerCase() === tab ? "active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="cd-job-list">
        <JobList
          jobs={currentJobs}
          onView={(jobId) => navigate(`/employer/view-jobs/${jobId}`)}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
