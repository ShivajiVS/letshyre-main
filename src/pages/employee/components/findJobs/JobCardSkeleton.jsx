/**
 * Skeleton loader for job cards — renders shimmer placeholders.
 * @param {{ count?: number }} props
 */
export default function JobCardSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div className="fj-skeleton-card" key={i}>
          <div className="fj-sk-avatar" />
          <div className="fj-sk-body">
            <div className="fj-sk-line medium" />
            <div className="fj-sk-line short" />
            <div className="fj-sk-tags">
              <div className="fj-sk-tag" />
              <div className="fj-sk-tag" />
              <div className="fj-sk-tag" />
            </div>
            <div className="fj-sk-line long" />
          </div>
        </div>
      ))}
    </>
  );
}
