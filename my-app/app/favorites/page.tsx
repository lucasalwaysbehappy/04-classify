"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { getFavorites, removeFavorite, type Favorite } from "@/lib/favorites-api";
import { FadeIn } from "@/app/components/animations";

export default function FavoritesPage() {
  const { user, isLoaded } = useUser();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  async function loadFavorites() {
    if (!user?.id) return;
    setLoading(true);
    const data = await getFavorites(user.id);
    setFavorites(data);
    setLoading(false);
  }

  async function handleRemove(poemSlug: string) {
    if (!user?.id) return;
    setRemoving(poemSlug);
    const success = await removeFavorite(user.id, poemSlug);
    if (success) {
      setFavorites((prev) => prev.filter((f) => f.poem_slug !== poemSlug));
    }
    setRemoving(null);
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700"></div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">
              请先登录
            </h1>
            <p className="text-stone-500">登录后查看您的收藏</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-stone-900 dark:bg-black text-stone-50 py-4 px-4 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-stone-300 hover:text-white transition-colors inline-flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-lg font-bold">我的收藏</h1>
          <div className="w-20"></div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-8 border border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                    收藏的诗词
                  </h2>
                  <p className="text-stone-500 dark:text-stone-400 mt-1">
                    共 {favorites.length} 首收藏
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-700"></div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-stone-600 dark:text-stone-400 mb-2">
                    暂无收藏
                  </h3>
                  <p className="text-stone-500 mb-6">去发现一些喜欢的诗词吧</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors"
                  >
                    浏览诗词
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    >
                      <Link
                        href={`/poem/${encodeURIComponent(favorite.poet_name)}/${encodeURIComponent(favorite.poem_slug)}`}
                        className="flex-1"
                      >
                        <h4 className="font-bold text-stone-800 dark:text-stone-100 text-lg">
                          {favorite.poem_title}
                        </h4>
                        <p className="text-sm text-stone-500">{favorite.poet_name}</p>
                      </Link>
                      <button
                        onClick={() => handleRemove(favorite.poem_slug)}
                        disabled={removing === favorite.poem_slug}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="取消收藏"
                      >
                        {removing === favorite.poem_slug ? (
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
