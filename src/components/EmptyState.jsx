export default function EmptyState({ title = 'Nothing here yet', description = 'Try adjusting your filters or come back later.', action = null }) {
  return (
    <div className="text-center border rounded-lg py-12 px-6 bg-white/40 dark:bg-black/10">
      <div className="text-5xl mb-3" aria-hidden>🪄</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
