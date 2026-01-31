import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { UserNav } from "@/app/components/user-nav";
import { ShareButtonWrapper } from "./share-button-wrapper";
import { PoemReaderWrapper } from "./poem-reader-wrapper";
import { FavoriteButtonWrapper } from "./favorite-button-wrapper";
import { FadeIn, ScrollReveal, HoverScale } from "@/app/components/animations";

interface PoemPageProps {
  params: Promise<{
    poet: string;
    poem: string;
  }>;
}

export async function generateStaticParams() {
  const contentPath = join(process.cwd(), "content");
  const poets = readdirSync(contentPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.endsWith(".json"))
    .map((dirent) => dirent.name);

  const params: { poet: string; poem: string }[] = [];

  for (const poet of poets) {
    const poems = readdirSync(join(contentPath, poet), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const poem of poems) {
      params.push({ poet, poem });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const { poet, poem } = await params;
  const decodedPoet = decodeURIComponent(poet);
  const decodedPoem = decodeURIComponent(poem);

  const indexData = JSON.parse(
    readFileSync(join(process.cwd(), "content", "index.json"), "utf-8")
  );
  const poetData = indexData.poets.find((p: { name: string }) => p.name === decodedPoet);
  const poemData = poetData?.poems.find((p: { slug: string }) => p.slug === decodedPoem);

  if (!poemData) {
    return {
      title: "诗词未找到 - 中华诗词",
    };
  }

  const title = `${poemData.title} - ${decodedPoet} | 中华诗词`;
  const description = `${poemData.title}是${decodedPoet}创作于${poemData.year}年的经典诗词。${poemData.tags.join("。")}。`;

  return {
    title,
    description,
    keywords: [poemData.title, decodedPoet, ...poemData.tags, "古诗词", "诗词鉴赏"],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "zh_CN",
      authors: [decodedPoet],
      images: [{ url: poemData.image, width: 800, height: 600, alt: poemData.title }],
    },
  };
}

function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const sections: { type: string; content: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      sections.push({ type: "h1", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("## ")) {
      sections.push({ type: "h2", content: trimmed.slice(3) });
    } else if (trimmed.startsWith("### ")) {
      sections.push({ type: "h3", content: trimmed.slice(4) });
    } else if (trimmed.startsWith("> ")) {
      sections.push({ type: "blockquote", content: trimmed.slice(2) });
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      sections.push({ type: "bold", content: trimmed.slice(2, -2) });
    } else if (trimmed.startsWith("---")) {
      sections.push({ type: "hr", content: "" });
    } else if (trimmed.startsWith("**标签：**")) {
      const tags = trimmed.replace("**标签：**", "").trim();
      sections.push({ type: "tags", content: tags });
    } else {
      sections.push({ type: "paragraph", content: trimmed });
    }
  }

  return sections;
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { poet, poem } = await params;
  const decodedPoet = decodeURIComponent(poet);
  const decodedPoem = decodeURIComponent(poem);

  const contentPath = join(process.cwd(), "content", decodedPoet, decodedPoem, "intro.md");

  let content: string;
  try {
    content = readFileSync(contentPath, "utf-8");
  } catch {
    notFound();
  }

  const sections = parseMarkdown(content);
  const title = sections.find((s) => s.type === "h1")?.content || decodedPoem;
  const author = sections.find((s) => s.type === "paragraph" && s.content.includes("作者"))?.content || "";
  const poemLines = sections
    .filter((s) => s.type === "blockquote")
    .flatMap((s) => s.content.split(/[，。、]/).filter((line) => line.trim()));

  const indexData = JSON.parse(
    readFileSync(join(process.cwd(), "content", "index.json"), "utf-8")
  );
  const poetData = indexData.poets.find((p: { name: string }) => p.name === decodedPoet);
  const poemData = poetData?.poems.find((p: { slug: string }) => p.slug === decodedPoem);
  const imageUrl = poemData?.image || "";
  const tags = poemData?.tags || [];

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 dark:bg-black/95 backdrop-blur-sm text-stone-50 py-4 px-4 border-b border-stone-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-stone-300 hover:text-white transition-colors inline-flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <div className="text-sm text-stone-400">
            {decodedPoet} · {poemData?.year}
          </div>
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Image */}
      {imageUrl && (
        <FadeIn>
          <div className="relative h-80 md:h-[500px] w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent dark:from-black dark:via-black/50" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight">
                  {title}
                </h1>
                <p className="text-stone-300 text-lg md:text-xl">{author.replace(/\*\*/g, "")}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 朗读功能 */}
          <ScrollReveal className="mb-6">
            <PoemReaderWrapper
              content={poemLines}
              title={title}
              author={decodedPoet}
            />
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl p-6 md:p-12 border border-stone-100 dark:border-stone-800">
              <div className="prose prose-stone prose-lg dark:prose-invert max-w-none">
                {sections.map((section, index) => {
                  switch (section.type) {
                    case "h1":
                      return null;
                    case "h2":
                      return (
                        <ScrollReveal key={index} delay={index * 0.05}>
                          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mt-12 mb-6 pb-4 border-b-2 border-stone-100 dark:border-stone-800">
                            {section.content}
                          </h2>
                        </ScrollReveal>
                      );
                    case "h3":
                      return (
                        <h3 key={index} className="text-xl md:text-2xl font-semibold text-stone-700 dark:text-stone-300 mt-8 mb-4">
                          {section.content}
                        </h3>
                      );
                    case "blockquote":
                      return (
                        <HoverScale key={index} scale={1.01}>
                          <blockquote className="border-l-4 border-stone-400 dark:border-stone-600 pl-6 my-8 text-stone-700 dark:text-stone-300 italic text-xl leading-relaxed bg-stone-50 dark:bg-stone-800 py-4 pr-4 rounded-r-lg">
                            {section.content}
                          </blockquote>
                        </HoverScale>
                      );
                    case "bold":
                      return (
                        <p key={index} className="font-semibold text-stone-800 dark:text-stone-200 my-6 text-xl">
                          {section.content}
                        </p>
                      );
                    case "hr":
                      return <hr key={index} className="my-10 border-stone-200 dark:border-stone-800" />;
                    case "tags":
                      const tagList = section.content.match(/#([^\s#]+)/g) || [];
                      return (
                        <div key={index} className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800">
                          <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">标签</h4>
                          <div className="flex flex-wrap gap-2">
                            {tagList.map((tag, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                              >
                                {tag.replace("#", "")}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    default:
                      return (
                        <p key={index} className="text-stone-600 dark:text-stone-400 leading-relaxed my-4 text-lg">
                          {section.content.replace(/\*\*/g, "")}
                        </p>
                      );
                  }
                })}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
              <Link
                href={`/#${poetData?.dynasty}`}
                className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z" />
                </svg>
                返回{poetData?.dynasty}
              </Link>
              <div className="flex gap-3">
                <FavoriteButtonWrapper
                  poemSlug={decodedPoem}
                  poetName={decodedPoet}
                  poemTitle={title}
                />
                <ShareButtonWrapper
                  title={title}
                  author={decodedPoet}
                  dynasty={poetData?.dynasty || ""}
                  poemLines={poemLines.slice(0, 4)}
                  tags={tags}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </article>

      <FadeIn>
        <footer className="bg-stone-900 dark:bg-black text-stone-400 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm">中华诗词 © 2026</p>
          </div>
        </footer>
      </FadeIn>
    </main>
  );
}
