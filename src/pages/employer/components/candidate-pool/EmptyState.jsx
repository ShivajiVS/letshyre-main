/**
 * EmptyState — Reusable empty/error state component for Candidate Pool.
 *
 * @param {string} icon - Bootstrap icon class (e.g. "bi-briefcase")
 * @param {string} title - Heading text
 * @param {string} description - Description text
 * @param {string} [actionLabel] - Optional button label
 * @param {function} [onAction] - Optional button click handler
 * @param {"empty"|"error"} [variant="empty"] - Style variant
 */
export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "empty",
}) => {
  if (variant === "error") {
    return (
      <div className="cp-error" role="alert">
        <div className="cp-error-icon" aria-hidden="true">
          <i className={`bi ${icon || "bi-exclamation-triangle"}`} />
        </div>
        <h3 className="cp-error-title">{title}</h3>
        <p className="cp-error-desc">{description}</p>
        {actionLabel && onAction && (
          <button
            className="cp-retry-btn"
            onClick={onAction}
            type="button"
          >
            <i className="bi bi-arrow-clockwise" /> {actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cp-empty" role="status">
      <div className="cp-empty-icon" aria-hidden="true">
        <i className={`bi ${icon || "bi-inbox"}`} />
      </div>
      <h3 className="cp-empty-title">{title}</h3>
      <p className="cp-empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          className="cp-empty-btn"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
