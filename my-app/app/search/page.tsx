import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "搜索诗词 - 中华诗词",
  description: "搜索中国古典诗词，按诗词名、诗人或标签查找。",
};

interface Poem {
  slug: string;
  title: string;
  image: string;
  tags: string[];
  year: string;
  period: string;
  order: number;
}

interface Poet {
  name: string;
  dynasty: string;
  dynastyOrder: number;
  lifePeriod: string;
  avatar: string;
  poems: Poem[];
}

interface ContentIndex {
  dynasties: { name: string; period: string; order: number }[];
  poets: Poet[];
}

// All searchable tags
function getAllTags(poets: Poet[]): string[] {
  const tagsSet = new Set<string>();
  poets.forEach((poet) => {
    poet.poems.forEach((poem) => {
      poem.tags.forEach((tag) => tagsSet.add(tag));
    });
  });
  return Array.from(tagsSet).sort();
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string };
}) {
  const contentPath = join(process.cwd(), "content");
  const indexData = JSON.parse(
    readFileSync(join(contentPath, "index.json"), "utf-8")
  ) as ContentIndex;

  const query = searchParams.q?.toLowerCase() || "";
  const selectedTag = searchParams.tag || "";

  // Filter poems
  const results = indexData.poets.flatMap((poet) =>
    poet.poems
      .filter((poem) => {
        const matchesQuery =
          !query ||
          poem.title.toLowerCase().includes(query) ||
          poet.name.toLowerCase().includes(query) ||
          poem.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesTag = !selectedTag || poem.tags.includes(selectedTag);

        return matchesQuery && matchesTag;
      })
      .map((poem) => ({ ...poem, poet }))
  );

  const allTags = getAllTags(indexData.poets);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-b from-stone-900 to-stone-800 text-stone-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-stone-400 hover:text-white transition-colors text-sm mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">搜索诗词</h1>
          
          {/* Search Form */}
          <form className="relative" action="/search" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="搜索诗词名、诗人或关键词..."
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors"
            >
              搜索
            </button>
          </form>
        </div>
      </header>

      {/* Filter Tags */}
      <section className="py-6 px-4 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-stone-500 text-sm mr-2">热门标签：</span>
            <Link
              href="/search"
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                !selectedTag
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              全部
            </Link>
            {allTags.slice(0, 15).map((tag) => (
              <Link
                key={tag}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTag === tag
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {(query || selectedTag) && (
            <div className="mb-8">
              <h2 className="text-xl text-stone-600">
                {query && `搜索 "${query}" 的结果：`}
                {selectedTag && `标签 "${selectedTag}" 的结果：`}
                <span className="font-bold text-stone-800">{results.length}</span> 首诗词
              </h2>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Link
                  key={`${result.poet.name}-${result.slug}`}
                  href={`/poem/${encodeURIComponent(result.poet.name)}/${encodeURIComponent(result.slug)}`}
                  className="group block"
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 px-3 py-1 rounded-full text-xs font-medium">
                        {result.year}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-800 px-3 py-1 rounded-full text-xs font-medium">
                        {result.poet.name}
                      </div>
                      <h3 className="absolute bottom-3 left-3 right-3 text-white text-xl font-bold leading-tight line-clamp-2">
                        {result.title}
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-stone-500 text-sm mb-3">{result.period}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (query || selectedTag) ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-stone-600 mb-2">未找到相关诗词</h3>
              <p className="text-stone-400">尝试使用其他关键词或标签搜索</p>
            </div>
          ) : null}

          {!query && !selectedTag && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-stone-600 mb-2">开始搜索</h3>
              <p className="text-stone-400">输入关键词或选择标签来查找诗词</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">中华诗词 © 2026</p>
        </div>
      </footer>
    </main>
  );
}
