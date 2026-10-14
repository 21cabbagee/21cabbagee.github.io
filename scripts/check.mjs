import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const html = await read("public/index.html");
const archive = await read("public/github-work.html");
const app = await read("public/app.js");
const routes = JSON.parse(await read("public/manus-routes.json"));
const repositories = JSON.parse(await read("data/github-projects.json"));
const robots = await read("public/robots.txt");
const sitemap = await read("public/sitemap.xml");
const builtHome = await read("dist/index.html");
const builtArchive = await read("dist/github-work.html");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function checkFragments(page, label) {
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const idSet = new Set(ids);
  const fragments = [...page.matchAll(/\bhref="#([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(ids.length, idSet.size, `${label}: duplicate HTML id`);
  for (const fragment of fragments) {
    assert(
      idSet.has(fragment),
      `${label}: missing in-page target #${fragment}`,
    );
  }
  return fragments.length;
}

const homeFragments = checkFragments(html, "Homepage");
const archiveFragments = checkFragments(archive, "GitHub archive");
assert.equal((html.match(/class="experience-item"/g) ?? []).length, 7);
assert.equal((html.match(/class="project-card(?: |\")/g) ?? []).length, 3);

for (const fact of [
  "70%",
  "20%",
  "70+",
  "9.52",
  "Washington, DC, United States",
  "cyborgsessions@gmail.com",
  "+91 92633 14467",
  "July 2026",
]) {
  assert(
    html.includes(fact),
    `Homepage is missing resume-backed content: ${fact}`,
  );
}

const socialUrls = [
  "https://www.linkedin.com/in/saurabbh-pandeey/",
  "https://x.com/21ccabbage",
  "https://github.com/21cabbagee",
];
for (const url of socialUrls) {
  assert(html.includes(url), `Homepage is missing social profile ${url}`);
  assert(archive.includes(url), `Archive is missing social profile ${url}`);
}

const featuredProjects = [
  "https://github.com/21cabbagee/CareerCompassAI",
  "https://github.com/21cabbagee/TatkalEasy",
  "https://github.com/21cabbagee/ComposioAssignment",
];
for (const url of featuredProjects) {
  assert(html.includes(url), `Homepage is missing featured source link ${url}`);
}
assert(
  html.includes('href="./github-work.html"'),
  "Homepage must link the full archive",
);

const siteUrl = "https://21cabbagee.github.io/";
const archiveUrl = `${siteUrl}github-work.html`;
assert(
  html.includes(`<link rel="canonical" href="${siteUrl}" />`),
  "Homepage canonical must match the Pages origin",
);
assert(
  archive.includes(archiveUrl),
  "Archive canonical/share metadata must use the archive URL",
);
assert(
  html.includes(`<meta property="og:url" content="${siteUrl}" />`),
  "Homepage Open Graph URL must match the Pages origin",
);
assert(
  archive.includes('property="og:url"') &&
    archive.includes(`content="${archiveUrl}"`),
  "Archive Open Graph URL must match the archive URL",
);
for (const page of [html, archive]) {
  assert(page.includes('href="./styles.css"'));
  assert(page.includes('src="./app.js"'));
  assert(page.includes("https://21cabbagee.github.io/images/hero.webp"));
}
assert(robots.includes(`Sitemap: ${siteUrl}sitemap.xml`));
assert(sitemap.includes(`<loc>${siteUrl}</loc>`));
assert(sitemap.includes(`<loc>${archiveUrl}</loc>`));
assert.deepEqual(routes, {
  routes: [
    { path: "/", title: "Saurabh Pandey — Portfolio" },
    {
      path: "/github-work.html",
      title: "GitHub work archive — Saurabh Pandey",
    },
  ],
});

assert.equal(
  repositories.length,
  77,
  "Expected all 77 original public repositories",
);
assert.equal(new Set(repositories.map((repo) => repo.url)).size, 77);
assert(!repositories.some((repo) => repo.url.endsWith("/21cabbagee")));
assert.equal((archive.match(/class="repo-card"/g) ?? []).length, 77);
for (const repository of repositories) {
  assert(
    /^https:\/\/github\.com\/21cabbagee\/[^/?#]+$/.test(repository.url),
    `Repository URL must target the owner's public GitHub repository: ${repository.url}`,
  );
  assert(
    archive.includes(`href="${repository.url}"`),
    `Archive is missing ${repository.url}`,
  );
  assert(
    archive.includes(escapeHtml(repository.name)),
    `Archive is missing ${repository.name}`,
  );
}
for (const searchFeature of [
  'id="repo-search"',
  'id="repo-grid"',
  'id="repo-status"',
  'aria-live="polite"',
  'type="search"',
]) {
  assert(
    archive.includes(searchFeature),
    `Archive is missing search feature ${searchFeature}`,
  );
}
assert(app.includes("updateRepositoryResults"));
assert(app.includes("card.dataset.search"));
assert(app.includes("repoStatus.textContent"));
assert(app.includes("repoEmpty.hidden"));
assert(!/href="#"/.test(html), "Homepage has an empty placeholder anchor");
assert(!/href="#"/.test(archive), "Archive has an empty placeholder anchor");
assert(
  !/lorem ipsum|replace this|coming soon/i.test(`${html}\n${archive}`),
  "No placeholder copy should remain",
);

for (const path of [
  "public/index.html",
  "public/github-work.html",
  "public/styles.css",
  "public/app.js",
  "public/mark.svg",
  "public/images/hero.webp",
  "public/images/github-avatar.webp",
  "public/resumejuly2026.pdf",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/manus-routes.json",
  "data/github-projects.json",
  "templates/github-work.html",
  "scripts/render-github-work.mjs",
  "dist/index.html",
  "dist/github-work.html",
]) {
  await access(new URL(`../${path}`, import.meta.url));
}
assert(builtHome.includes("./images/github-avatar.webp"));
assert.equal((builtArchive.match(/class="repo-card"/g) ?? []).length, 77);
console.log(
  `Portfolio checks passed (${homeFragments + archiveFragments} internal links, 7 roles, 3 featured projects, 3 social profiles, 77 repositories, 2 routes).`,
);
