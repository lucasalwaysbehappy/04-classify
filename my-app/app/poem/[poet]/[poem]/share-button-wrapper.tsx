"use client";

import { ShareButton } from "@/app/components/share-button";

interface ShareButtonWrapperProps {
  title: string;
  author: string;
  dynasty: string;
  poemLines: string[];
  tags: string[];
}

export function ShareButtonWrapper({ title, author, dynasty, poemLines, tags }: ShareButtonWrapperProps) {
  return (
    <ShareButton
      title={title}
      author={author}
      dynasty={dynasty}
      content={poemLines}
      tags={tags}
    />
  );
}
