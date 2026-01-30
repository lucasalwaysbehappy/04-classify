import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";

interface Poem {
  slug: string;
  title: string;
  image: string;
  tags: string[];
}

interface Poet {
  name: string;
  dynasty: string;
  avatar: string;
  poems: Poem[];
}

interface ContentIndex {
  poets: Poet[];
}

export default function Home() {
  const contentPath = join(process.cwd(), "content");
  const indexData = JSON.parse(
    readFileSync(join(contentPath, "index.json"), "utf-8")
  ) as ContentIndex;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-b from-stone-900 to-stone-800 text-stone-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
            中华诗词
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            品味千年文化，感受古典之美
          </p>
        </div>
      </header>

      {/* Poets Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {indexData.poets.map((poet) => (
            <div key={poet.name} className="mb-16">
              {/* Poet Header */}
              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-stone-200">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-stone-300">
                  <Image
                    src={poet.avatar}
                    alt={poet.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
                    {poet.name}
                  </h2>
                  <span className="text-stone-500 text-sm">{poet.dynasty}</span>
                </div>
              </div>

              {/* Poems Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {poet.poems.map((poem) => (
                  <Link
                    key={poem.slug}
                    href={`/poem/${poet.name}/${poem.slug}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={poem.image}
                          alt={poem.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                          {poem.title}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {poem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
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
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">中华诗词 © 2026</p>
        </div>
      </footer>
    </main>
  );
}
