"use client";

import { useState } from "react";
import { Coffee, X, Heart } from "lucide-react";

export function TipJar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        title="Buy us a coffee"
      >
        <Coffee className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline">Tip</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Coffee className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Enjoying ToolPilot?</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              If our tools helped you, consider buying us a coffee. It keeps us building!
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://www.buymeacoffee.com/sandydixitp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <Coffee className="h-5 w-5" />
                Buy Me a Coffee
              </a>
              <p className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <Heart className="h-3 w-3 text-red-400" /> Every contribution matters
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
