"use client";

import { Suspense } from "react";
import { getToolComponent } from "@/components/tools";
import { Card, CardContent } from "@/components/ui/card";

function ToolSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-40 rounded-lg bg-gray-100 dark:bg-gray-800" />
      <div className="flex gap-3">
        <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-10 w-28 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function ToolRenderer({ slug }: { slug: string }) {
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Coming Soon</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              This tool is under development
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
