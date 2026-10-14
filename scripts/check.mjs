import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const html = await readFile(
  new URL("../public/index.html", import.meta.url),
  "utf8",
);
const routes = JSON.parse(
  await readFile(
    new URL("../public/manus-routes.json", import.meta.url),
    "utf8",
  ),
);
const robots = await readFile(
  new URL("../public/robots.txt", import.meta.url),
  "utf8",
);
const sitemap = await readFile(
  new URL("../public/sitemap.xml", import.meta.url),
  "utf8",
);
const ids = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
const fragments = [...html.matchAll(/\bhref="#([^"]+)"/g)].map(
  (match) => match[1],
);
for (const fragment of fragments)
  assert(ids.has(fragment), `Missing in-page target: #${fragment}`);
assert.equal(
  new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])).size,
  ids.size,
  "Duplicate HTML id",
);
assert.equal(
  (html.match(/class="experience-item"/g) ?? []).length,
  7,
  "All seven resume roles should appear",
);
assert.equal(
  (html.match(/class="project-card(?: |\")/g) ?? []).length,
  3,
  "All three resume projects should appear",
);
for (const fact of [
  "70%",
  "20%",
  "70+",
  "9.52",
  "Washington, DC, United States",
  "cyborgsessions@gmail.com",
  "+91 92633 14467",
  "saurabbh-pandeey",
  "21cabbagee",
  "July 2026",
]) {
  assert(html.includes(fact), `Missing resume-backed content: ${fact}`);
}
assert(
  html.includes("https://www.linkedin.com/in/saurabbh-pandeey/"),
  "LinkedIn URL must match the PDF link target",
);
assert(
  html.includes("https://github.com/21cabbagee"),
  "GitHub URL must match the PDF link target",
);
const siteUrl = "https://21cabbagee.github.io/";
assert(
  html.includes(`<link rel="canonical" href="${siteUrl}" />`),
  "Canonical URL must match the Pages origin",
);
assert(
  html.includes(`<meta property="og:url" content="${siteUrl}" />`),
  "Open Graph URL must match the Pages origin",
);
assert(
  html.includes(`content="${siteUrl}images/hero.webp"`),
  "Social preview image must use the Pages origin",
);
assert(
  html.includes('href="./styles.css"') && html.includes('src="./app.js"'),
  "Main assets must use repository-relative paths",
);
assert(
  robots.includes(`Sitemap: ${siteUrl}sitemap.xml`),
  "Robots document must point to the site sitemap",
);
assert(
  sitemap.includes(`<loc>${siteUrl}</loc>`),
  "Sitemap must list the canonical page",
);
assert(!/href="#"/.test(html), "No empty placeholder anchors");
assert(
  !/lorem ipsum|replace this|coming soon/i.test(html),
  "No placeholder copy",
);
assert.deepEqual(routes, {
  routes: [{ path: "/", title: "Saurabh Pandey — Portfolio" }],
});
for (const path of [
  "public/index.html",
  "public/styles.css",
  "public/app.js",
  "public/mark.svg",
  "public/images/hero.webp",
  "public/resumejuly2026.pdf",
  "public/robots.txt",
  "public/sitemap.xml",
]) {
  await access(new URL(`../${path}`, import.meta.url));
}
console.log(
  `Portfolio checks passed (${fragments.length} internal links, 7 roles, 3 projects).`,
);
