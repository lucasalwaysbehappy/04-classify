import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { UserNav } from "@/app/components/user-nav";
import { FadeIn, ScrollReveal, StaggerContainer, StaggerItem, HoverScale } from "@/app/components/animations";

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

export const metadata: Metadata = {
  title: "中华诗词 - 按年代时间线品读古典之美",
  description: "探索中国古典诗词的优美世界，按朝代时间线展示唐诗、宋词等经典作品，包含详细赏析和创作背景。",
  keywords: ["中国诗词", "唐诗", "宋词", "古诗词", "诗歌鉴赏", "李白", "苏轼", "王维", "杜甫"],
  openGraph: {
    title: "中华诗词 - 按年代时间线品读古典之美",
    description: "穿越千年时光，品读诗词之美。探索李白、苏轼、王维、杜甫等诗人的经典作品。",
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200",
        width: 1200,
        height: 630,
        alt: "中华诗词",
      },
    ],
  },
};

export default function Home() {
  const contentPath = join(process.cwd(), "content");
  const indexData = JSON.parse(
    readFileSync(join(contentPath, "index.json"), "utf-8")
  ) as ContentIndex;

  const poetsByDynasty = indexData.poets.reduce((acc, poet) => {
    if (!acc[poet.dynasty]) {
      acc[poet.dynasty] = [];
    }
    acc[poet.dynasty].push(poet);
    return acc;
  }, {} as Record<string, Poet[]>);

  const sortedDynasties = [...indexData.dynasties].sort(
    (a, b) => a.order - b.order
  );

  const totalPoems = indexData.poets.reduce((sum, poet) => sum + poet.poems.length, 0);
  const totalPoets = indexData.poets.length;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "中华诗词",
            description: "按年代时间线品读中国古典诗词",
            url: "https://chinese-poetry.vercel.app",
          }),
        }}
      />

      {/* Header */}
      <header className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-stone-700 dark:from-black dark:via-stone-900 dark:to-stone-800 text-stone-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <UserNav />
          <ThemeToggle />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-wider">
              中华诗词
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <p className="text-stone-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8">
              穿越千年时光，品读诗词之美
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="flex justify-center gap-8 md:gap-16 text-sm md:text-base">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-stone-200">{totalPoets}</div>
                <div className="text-stone-400 mt-1">位诗人</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-stone-200">{totalPoems}</div>
                <div className="text-stone-400 mt-1">首诗词</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-stone-200">2</div>
                <div className="text-stone-400 mt-1">个朝代</div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-12 flex justify-center gap-2 md:gap-4 text-sm text-stone-500 flex-wrap">
              {sortedDynasties.map((dynasty, index) => (
                <span key={dynasty.name} className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-stone-800/50 rounded-full">{dynasty.name}</span>
                  {index < sortedDynasties.length - 1 && <span className="text-stone-600">→</span>}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </header>

      {/* Timeline Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {sortedDynasties.map((dynasty, dynastyIndex) => (
            <ScrollReveal key={dynasty.name} delay={dynastyIndex * 0.1}>
              <article className="mb-24 scroll-mt-24" id={dynasty.name}>
                {/* Dynasty Header */}
                <header className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-600 dark:from-stone-700 dark:to-stone-500 text-stone-50 flex items-center justify-center text-3xl font-bold shadow-xl">
                    {dynasty.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                      {dynasty.name}
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 text-lg">{dynasty.period}</p>
                  </div>
                  <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-stone-300 to-transparent dark:from-stone-700" />
                </header>

                {/* Poets in this dynasty */}
                <div className="space-y-16">
                  {poetsByDynasty[dynasty.name]
                    ?.sort((a, b) => {
                      const aFirstYear = a.poems[0]?.order || 0;
                      const bFirstYear = b.poems[0]?.order || 0;
                      return aFirstYear - bFirstYear;
                    })
                    .map((poet, poetIndex) => (
                      <ScrollReveal key={poet.name} delay={poetIndex * 0.1}>
                        <section className="bg-white dark:bg-stone-900 rounded-3xl shadow-lg overflow-hidden border border-stone-100 dark:border-stone-800 hover:shadow-2xl transition-shadow duration-500">
                          {/* Poet Header */}
                          <header className="bg-gradient-to-r from-stone-50 to-white dark:from-stone-800 dark:to-stone-900 px-8 py-6 border-b border-stone-100 dark:border-stone-800">
                            <div className="flex items-center gap-5">
                              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-3 ring-stone-200 dark:ring-stone-700 shadow-md">
                                <Image
                                  src={poet.avatar}
                                  alt={`${poet.name}头像`}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                  priority
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100">
                                  {poet.name}
                                </h3>
                                <p className="text-stone-500 dark:text-stone-400">
                                  {poet.lifePeriod} · {poet.poems.length}首作品
                                </p>
                              </div>
                              <div className="text-stone-300 dark:text-stone-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </header>

                          {/* Poems Timeline */}
                          <div className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                                <svg className="w-4 h-4 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-stone-600 dark:text-stone-400 font-medium">创作时间线</span>
                              <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
                            </div>

                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
                              {poet.poems
                                .sort((a, b) => a.order - b.order)
                                .map((poem) => (
                                  <StaggerItem key={poem.slug}>
                                    <Link
                                      href={`/poem/${encodeURIComponent(poet.name)}/${encodeURIComponent(poem.slug)}`}
                                      className="group block h-full"
                                    >
                                      <HoverScale className="h-full">
                                        <article className="bg-stone-50 dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-700 h-full flex flex-col">
                                          <div className="relative h-48 overflow-hidden">
                                            <Image
                                              src={poem.image}
                                              alt={poem.title}
                                              fill
                                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                            <time className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-stone-100 px-3 py-1 rounded-full text-xs font-medium">
                                              {poem.year}
                                            </time>
                                            <h4 className="absolute bottom-3 left-3 right-3 text-white text-xl font-bold leading-tight line-clamp-2">
                                              {poem.title}
                                            </h4>
                                          </div>
                                          <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 line-clamp-1">
                                              {poem.period}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                              {poem.tags.slice(0, 3).map((tag) => (
                                                <span
                                                  key={tag}
                                                  className="px-3 py-1 bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs rounded-full border border-stone-200 dark:border-stone-600"
                                                >
                                                  {tag}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        </article>
                                      </HoverScale>
                                    </Link>
                                  </StaggerItem>
                                ))}
                            </StaggerContainer>
                          </div>
                        </section>
                      </ScrollReveal>
                    ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <FadeIn>
        <footer className="bg-stone-900 dark:bg-black text-stone-400 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-stone-200 mb-2">中华诗词</h3>
                <p className="text-sm">按年代时间线品读古典之美</p>
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="hover:text-stone-200 transition-colors">首页</Link>
                <span className="text-stone-600">·</span>
                <a href="#唐代" className="hover:text-stone-200 transition-colors">唐代</a>
                <span className="text-stone-600">·</span>
                <a href="#宋代" className="hover:text-stone-200 transition-colors">宋代</a>
                <span className="text-stone-600">·</span>
                <Link href="/favorites" className="hover:text-stone-200 transition-colors">我的收藏</Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-stone-800 dark:border-stone-800 text-center text-sm">
              <p>中华诗词 © 2026 | 按年代时间线展示</p>
            </div>
          </div>
        </footer>
      </FadeIn>
    </main>
  );
}
