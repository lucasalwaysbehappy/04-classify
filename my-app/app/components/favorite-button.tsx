"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addFavorite, removeFavorite, isFavorited } from "@/lib/favorites-api";

interface FavoriteButtonProps {
  poemSlug: string;
  poetName: string;
  poemTitle: string;
}

export function FavoriteButton({ poemSlug, poetName, poemTitle }: FavoriteButtonProps) {
  const { user, isLoaded } = useUser();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user?.id) {
      checkFavoriteStatus();
    } else {
      setChecking(false);
    }
  }, [user?.id, poemSlug]);

  async function checkFavoriteStatus() {
    if (!user?.id) return;
    setChecking(true);
    const status = await isFavorited(user.id, poemSlug);
    setFavorited(status);
    setChecking(false);
  }

  async function handleToggle() {
    if (!user?.id) return;
    setLoading(true);

    if (favorited) {
      const success = await removeFavorite(user.id, poemSlug);
      if (success) setFavorited(false);
    } else {
      const result = await addFavorite(user.id, poemSlug, poetName, poemTitle);
      if (result) setFavorited(true);
    }

    setLoading(false);
  }

  if (!isLoaded || checking) {
    return (
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-400 rounded-lg">
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        加载中...
      </button>
    );
  }

  if (!user) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-400 rounded-lg cursor-not-allowed"
        title="登录后收藏"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        登录后收藏
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
        favorited
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
          : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
      }`}
    >
      {loading ? (
        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : favorited ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
      {favorited ? "已收藏" : "收藏"}
    </button>
  );
}
