import { useState, useEffect, useCallback, useRef } from "react";
import {
  useFindJobs,
  useIndustries,
  useApplyForJob,
} from "@/hooks/useFindJobs";

import JobCard from "./components/findJobs/JobCard";
import JobCardSkeleton from "./components/findJobs/JobCardSkeleton";
import JobDetailModal from "./components/findJobs/JobDetailModal";
import FindJobsFilters from "./components/findJobs/FindJobsFilters";
import EmptyState from "./components/findJobs/EmptyState";

import slide1 from "@/assets/Carousel-1.jpg";
import slide2 from "@/assets/Carousel-2.jpg";
import slide3 from "@/assets/Carousel-3.jpg";

import "./styles/find-jobs.css";

const DEBOUNCE_MS = 400;

const INITIAL_FILTERS = {
  job_search: "",
  location: "",
  employment_type: "",
  industry_type: "",
  salary_range: "",
  experience_required: "",
};

const slides = [{ image: slide1 }, { image: slide2 }, { image: slide3 }];

export function FindJobs() {
  /* ── Local UI state ── */
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Search / Filter state ── */
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const debounceTimer = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const userName =
    storedUser?.first_name ||
    storedUser?.name ||
    storedUser?.username ||
    "User";

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1); // reset page on new search
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer.current);
  }, [searchText]);

  const queryFilters = {
    ...filters,
    job_search: debouncedSearch,
    page: currentPage,
  };

  const {
    data: jobsData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useFindJobs(queryFilters);

  const { data: industries = [], isLoading: industriesLoading } =
    useIndustries();

  const applyMutation = useApplyForJob();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchText("");
    setDebouncedSearch("");
    setCurrentPage(1);
  }, []);

  const handleApply = useCallback(
    (jobId) => {
      applyMutation.mutate(jobId, {
        onSuccess: () => {
          // Update selected job in modal to reflect applied state
          setSelectedJob((prev) =>
            prev?.id === jobId
              ? { ...prev, status: "Applied", application_id: "temp" }
              : prev,
          );
        },
        onError: () => {
          alert("Failed to apply. Please try again.");
        },
      });
    },
    [applyMutation],
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top of job list
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jobs = jobsData?.results || [];
  const totalCount = jobsData?.count || 0;
  const totalPages = jobsData?.totalPages || 1;

  return (
    <>
      <div className="cd-welcome">
        <h3>Welcome {userName}!</h3>
        <p>
          Start discovering opportunities that match your skills and ambitions
        </p>
        <div className="cd-banner">
          {slides.map((item, index) => (
            <div
              key={index}
              className={`cd-slide ${index === activeIndex ? "active" : ""}`}
            >
              <img src={item.image} alt="" />
            </div>
          ))}

          <div className="cd-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      <div className="fj-search-bar">
        <i className="bi bi-search fj-search-icon"></i>
        <input
          className="fj-search-input"
          type="text"
          placeholder="Search jobs by title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className={`fj-filter-toggle ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <i className="bi bi-sliders"></i>
          Filters
        </button>
      </div>

      {showFilters && (
        <FindJobsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          industries={industries}
          industriesLoading={industriesLoading}
        />
      )}

      <div className="fj-results-header">
        <p className="fj-results-count">
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              Showing <span>{totalCount}</span> job{totalCount !== 1 ? "s" : ""}
            </>
          )}
        </p>
        {isFetching && !isLoading && (
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Updating...</span>
        )}
      </div>

      <div className="fj-job-list">
        {isLoading ? (
          <JobCardSkeleton count={4} />
        ) : isError ? (
          <div className="fj-error-state">
            <p>Something went wrong while loading jobs.</p>
            <button className="fj-retry-btn" onClick={() => refetch()}>
              <i className="bi bi-arrow-clockwise"></i> Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No jobs found"
            subtitle="Try adjusting your search or filters to discover more opportunities."
          />
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(j) => setSelectedJob(j)}
            />
          ))
        )}
      </div>
      {!isLoading && !isError && totalPages > 1 && (
        <div className="fj-pagination">
          <button
            className="fj-page-btn"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`fj-page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="fj-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ›
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
          isApplying={applyMutation.isPending}
        />
      )}
    </>
  );
}
