export default function ToolsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800 mb-2" />
      <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-800 mb-4" />
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800 mb-2" />
            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800 mb-3" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-800" />
              <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
