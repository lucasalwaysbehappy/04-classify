"use client";

import { FavoriteButton } from "@/app/components/favorite-button";

interface FavoriteButtonWrapperProps {
  poemSlug: string;
  poetName: string;
  poemTitle: string;
}

export function FavoriteButtonWrapper({ poemSlug, poetName, poemTitle }: FavoriteButtonWrapperProps) {
  return (
    <FavoriteButton
      poemSlug={poemSlug}
      poetName={poetName}
      poemTitle={poemTitle}
    />
  );
}
