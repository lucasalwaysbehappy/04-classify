import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";

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

interface Dynasty {
  name: string;
  period: string;
  order: number;
}

interface ContentIndex {
  dynasties: Dynasty[];
  poets: Poet[];
}

export default function Home() {
  const contentPath = join(process.cwd(), "content");
  const indexData = JSON.parse(
    readFileSync(join(contentPath, "index.json"), "utf-8")
  ) as ContentIndex;

  // Group poets by dynasty
  const poetsByDynasty = indexData.poets.reduce((acc, poet) => {
    if (!acc[poet.dynasty]) {
      acc[poet.dynasty] = [];
    }
    acc[poet.dynasty].push(poet);
    return acc;
  }, {} as Record<string, Poet[]>);

  // Sort dynasties by order
  const sortedDynasties = [...indexData.dynasties].sort(
    (a, b) => a.order - b.order
  );

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-b from-stone-900 via-stone-800 to-stone-700 text-stone-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
            中华诗词
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            穿越千年时光，品读诗词之美
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm text-stone-400">
            <span>唐代</span>
            <span>→</span>
            <span>宋代</span>
            <span>→</span>
            <span>元代</span>
            <span>→</span>
            <span>明代</span>
            <span>→</span>
            <span>清代</span>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {sortedDynasties.map((dynasty, dynastyIndex) => (
            <div key={dynasty.name} className="mb-20">
              {/* Dynasty Header */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 rounded-full bg-stone-800 text-stone-50 flex items-center justify-center text-2xl font-bold">
                  {dynasty.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
                    {dynasty.name}
                  </h2>
                  <p className="text-stone-500">{dynasty.period}</p>
                </div>
                <div className="flex-1 h-px bg-stone-300 ml-8" />
              </div>

              {/* Poets in this dynasty */}
              <div className="space-y-16">
                {poetsByDynasty[dynasty.name]
                  ?.sort((a, b) => {
                    // Sort by first poem's order as a proxy for timeline
                    const aFirstYear = a.poems[0]?.order || 0;
                    const bFirstYear = b.poems[0]?.order || 0;
                    return aFirstYear - bFirstYear;
                  })
                  .map((poet) => (
                    <div
                      key={poet.name}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                      {/* Poet Header */}
                      <div className="bg-gradient-to-r from-stone-100 to-stone-50 px-6 py-4 border-b border-stone-200">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-stone-300">
                            <Image
                              src={poet.avatar}
                              alt={poet.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-stone-800">
                              {poet.name}
                            </h3>
                            <p className="text-stone-500 text-sm">
                              {poet.lifePeriod}
                            </p>
                          </div>
                          <div className="ml-auto text-stone-400">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Poems Timeline */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-stone-400 text-sm">
                          <span>创作时间线</span>
                          <div className="flex-1 h-px bg-stone-200" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {poet.poems
                            .sort((a, b) => a.order - b.order)
                            .map((poem, index) => (
                              <Link
                                key={poem.slug}
                                href={`/poem/${poet.name}/${poem.slug}`}
                                className="group block"
                              >
                                <div className="bg-stone-50 rounded-xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                  <div className="relative h-44 overflow-hidden">
                                    <Image
                                      src={poem.image}
                                      alt={poem.title}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    
                                    {/* Year badge */}
                                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 px-3 py-1 rounded-full text-xs font-medium">
                                      {poem.year}
                                    </div>
                                    
                                    <h4 className="absolute bottom-3 left-3 right-3 text-white text-lg font-semibold leading-tight">
                                      {poem.title}
                                    </h4>
                                  </div>
                                  
                                  <div className="p-4">
                                    <p className="text-stone-500 text-sm mb-3 line-clamp-1">
                                      {poem.period}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {poem.tags.slice(0, 3).map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 bg-stone-200 text-stone-600 text-xs rounded"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">中华诗词 © 2026 | 按年代时间线展示</p>
        </div>
      </footer>
    </main>
  );
}
