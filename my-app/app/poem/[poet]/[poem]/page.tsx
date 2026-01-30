import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PoemPageProps {
  params: Promise<{
    poet: string;
    poem: string;
  }>;
}

// Generate static params for all poems
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

// Simple markdown parser
function parseMarkdown(content: string) {
  const lines = content.split("\n");
  const sections: { type: string; content: string; level?: number }[] = [];

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

  const contentPath = join(
    process.cwd(),
    "content",
    decodedPoet,
    decodedPoem,
    "intro.md"
  );

  let content: string;
  try {
    content = readFileSync(contentPath, "utf-8");
  } catch {
    notFound();
  }

  const sections = parseMarkdown(content);
  const title = sections.find((s) => s.type === "h1")?.content || decodedPoem;
  const author = sections.find((s) => s.type === "paragraph" && s.content.includes("作者"))?.content || "";

  // Get image from index.json
  const indexData = JSON.parse(
    readFileSync(join(process.cwd(), "content", "index.json"), "utf-8")
  );
  const poetData = indexData.poets.find((p: { name: string }) => p.name === decodedPoet);
  const poemData = poetData?.poems.find((p: { slug: string }) => p.slug === decodedPoem);
  const imageUrl = poemData?.image || "";

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="bg-stone-900 text-stone-50 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="text-stone-300 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      {imageUrl && (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                {title}
              </h1>
              <p className="text-stone-300 text-lg">{author.replace(/\*\*/g, "")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <article className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-12">
          <div className="prose prose-stone max-w-none">
            {sections.map((section, index) => {
              switch (section.type) {
                case "h1":
                  return null; // Skip h1 as it's in hero
                case "h2":
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-stone-800 mt-8 mb-4 pb-2 border-b border-stone-200"
                    >
                      {section.content}
                    </h2>
                  );
                case "h3":
                  return (
                    <h3
                      key={index}
                      className="text-xl font-semibold text-stone-700 mt-6 mb-3"
                    >
                      {section.content}
                    </h3>
                  );
                case "blockquote":
                  return (
                    <blockquote
                      key={index}
                      className="border-l-4 border-stone-400 pl-4 my-6 text-stone-700 italic text-lg leading-relaxed"
                    >
                      {section.content}
                    </blockquote>
                  );
                case "bold":
                  return (
                    <p
                      key={index}
                      className="font-semibold text-stone-800 my-4 text-lg"
                    >
                      {section.content}
                    </p>
                  );
                case "hr":
                  return <hr key={index} className="my-8 border-stone-200" />;
                case "tags":
                  const tags = section.content.match(/#([^\s#]+)/g) || [];
                  return (
                    <div key={index} className="mt-8 pt-4 border-t border-stone-200">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-stone-100 text-stone-600 text-sm rounded-full"
                          >
                            {tag.replace("#", "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                default:
                  return (
                    <p
                      key={index}
                      className="text-stone-600 leading-relaxed my-4"
                    >
                      {section.content.replace(/\*\*/g, "")}
                    </p>
                  );
              }
            })}
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">中华诗词 © 2026</p>
        </div>
      </footer>
    </main>
  );
}
