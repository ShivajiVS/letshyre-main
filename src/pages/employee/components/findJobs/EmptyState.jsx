/**
 * EmptyState
 * Reusable empty/no-results placeholder.
 *
 * @param {{ icon?: string, title: string, subtitle?: string }} props
 */
export default function EmptyState({
  icon = "📭",
  title = "No results found",
  subtitle = "",
}) {
  return (
    <div className="fj-empty-state">
      <span className="fj-empty-icon">{icon}</span>
      <h4 className="fj-empty-title">{title}</h4>
      {subtitle && <p className="fj-empty-subtitle">{subtitle}</p>}
    </div>
  );
}
