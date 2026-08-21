export default function ToolLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="h-4 w-72 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="h-64 rounded-lg bg-gray-100 dark:bg-gray-800" />
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
