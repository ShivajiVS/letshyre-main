import { useState, useEffect, useRef } from "react";

function useDebouncedCallback(callback, delay = 400) {
  const timer = useRef(null);

  const debounced = (value) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => callback(value), delay);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return debounced;
}

/**
 * FindJobsFilters
 * Filter panel with select dropdowns for server-side filtering.
 * Text inputs (location, salary, experience) are debounced to prevent
 * unnecessary API calls on every keystroke.
 *
 * @param {{
 *   filters: Object,
 *   onFilterChange: (key: string, value: string) => void,
 *   onClear: () => void,
 *   industries: Array<{ value: string, label: string }>,
 *   industriesLoading: boolean,
 * }} props
 */
export default function FindJobsFilters({
  filters,
  onFilterChange,
  onClear,
  industries = [],
  industriesLoading = false,
}) {
  /* ── Local state for text inputs (debounced) ── */
  const [localLocation, setLocalLocation] = useState(filters.location || "");
  const [localSalary, setLocalSalary] = useState(filters.salary_range || "");
  const [localExperience, setLocalExperience] = useState(
    filters.experience_required || "",
  );

  /* ── Debounced callbacks ── */
  const debouncedLocation = useDebouncedCallback((val) =>
    onFilterChange("location", val),
  );
  const debouncedSalary = useDebouncedCallback((val) =>
    onFilterChange("salary_range", val),
  );
  const debouncedExperience = useDebouncedCallback((val) =>
    onFilterChange("experience_required", val),
  );

  /* ── Sync local state when filters are cleared externally ── */
  useEffect(() => {
    setLocalLocation(filters.location || "");
    setLocalSalary(filters.salary_range || "");
    setLocalExperience(filters.experience_required || "");
  }, [filters.location, filters.salary_range, filters.experience_required]);

  /* ── Handlers ── */
  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocalLocation(val);
    debouncedLocation(val);
  };

  const handleSalaryChange = (e) => {
    const val = e.target.value;
    setLocalSalary(val);
    debouncedSalary(val);
  };

  const handleExperienceChange = (e) => {
    const val = e.target.value;
    setLocalExperience(val);
    debouncedExperience(val);
  };

  return (
    <div className="fj-filters-panel">
      {/* LOCATION */}
      <div className="fj-filter-group">
        <label className="fj-filter-label">Location</label>
        <input
          className="fj-filter-input"
          type="text"
          placeholder="e.g. Hyderabad"
          value={localLocation}
          onChange={handleLocationChange}
        />
      </div>

      {/* EMPLOYMENT TYPE — select, no debounce needed */}
      <div className="fj-filter-group">
        <label className="fj-filter-label">Employment Type</label>
        <select
          className="fj-filter-select"
          value={filters.employment_type || ""}
          onChange={(e) => onFilterChange("employment_type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      {/* INDUSTRY TYPE — select, no debounce needed */}
      <div className="fj-filter-group">
        <label className="fj-filter-label">Industry</label>
        <select
          className="fj-filter-select"
          value={filters.industry_type || ""}
          onChange={(e) => onFilterChange("industry_type", e.target.value)}
          disabled={industriesLoading}
        >
          <option value="">
            {industriesLoading ? "Loading..." : "All Industries"}
          </option>
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      {/* SALARY RANGE */}
      <div className="fj-filter-group">
        <label className="fj-filter-label">Salary Range</label>
        <input
          className="fj-filter-input"
          type="text"
          placeholder="e.g. 3-10"
          value={localSalary}
          onChange={handleSalaryChange}
        />
      </div>

      {/* EXPERIENCE */}
      <div className="fj-filter-group">
        <label className="fj-filter-label">Experience</label>
        <input
          className="fj-filter-input"
          type="text"
          placeholder="e.g. 2-5"
          value={localExperience}
          onChange={handleExperienceChange}
        />
      </div>

      {/* CLEAR ALL */}
      <div className="fj-filter-actions">
        <button className="fj-clear-btn" onClick={onClear}>
          <i className="bi bi-x-circle"></i> Clear All
        </button>
      </div>
    </div>
  );
}
