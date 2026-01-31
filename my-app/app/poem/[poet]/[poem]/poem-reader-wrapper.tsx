"use client";

import { PoemReader } from "@/app/components/poem-reader";

interface PoemReaderWrapperProps {
  content: string[];
  title: string;
  author: string;
}

export function PoemReaderWrapper({ content, title, author }: PoemReaderWrapperProps) {
  return (
    <div className="bg-stone-50 dark:bg-stone-800 rounded-xl p-4 border border-stone-200 dark:border-stone-700">
      <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        诗词朗读
      </h4>
      <PoemReader content={content} title={title} author={author} />
    </div>
  );
}
