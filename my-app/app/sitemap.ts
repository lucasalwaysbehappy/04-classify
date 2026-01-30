import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://chinese-poetry.vercel.app";
  
  const contentPath = join(process.cwd(), "content");
  const poets = readdirSync(contentPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.endsWith(".json"))
    .map((dirent) => dirent.name);

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Add poem pages
  for (const poet of poets) {
    const poems = readdirSync(join(contentPath, poet), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const poem of poems) {
      routes.push({
        url: `${baseUrl}/poem/${encodeURIComponent(poet)}/${encodeURIComponent(poem)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return routes;
}
