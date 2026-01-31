import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function FavoritesPage() {
  const user = await currentUser();

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
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-8 border border-stone-100 dark:border-stone-800">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                欢迎来到收藏夹
              </h2>
              <p className="text-stone-500 dark:text-stone-400 mb-2">
                {user?.firstName || user?.username || "用户"}，这里将显示您收藏的诗词
              </p>
              <p className="text-sm text-stone-400 dark:text-stone-500">
                功能开发中，敬请期待...
              </p>
            </div>

            {/* Demo Favorites */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-8">
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">
                示例收藏
              </h3>
              <div className="space-y-3">
                <Link
                  href="/poem/李白/静夜思"
                  className="block p-4 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-stone-800 dark:text-stone-100">静夜思</h4>
                      <p className="text-sm text-stone-500">李白 · 唐代</p>
                    </div>
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/poem/苏轼/水调歌头"
                  className="block p-4 bg-stone-50 dark:bg-stone-800 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-stone-800 dark:text-stone-100">水调歌头·明月几时有</h4>
                      <p className="text-sm text-stone-500">苏轼 · 宋代</p>
                    </div>
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
