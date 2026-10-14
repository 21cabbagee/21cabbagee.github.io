import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dataPath = resolve(root, "data/github-projects.json");
const templatePath = resolve(root, "templates/github-work.html");
const outputPath = resolve(root, "public/github-work.html");
const repositories = JSON.parse(await readFile(dataPath, "utf8"));
const template = await readFile(templatePath, "utf8");

if (!Array.isArray(repositories) || repositories.length !== 77) {
  throw new Error("Expected the 77-entry public repository snapshot.");
}

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

function repositoryCard(repository, index) {
  const url = new URL(repository.url);
  const path = url.pathname.split("/").filter(Boolean);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    path.length !== 2 ||
    path[0] !== "21cabbagee"
  ) {
    throw new Error(`Unapproved repository URL for ${repository.name}`);
  }

  const name = escapeHtml(repository.name);
  const description = escapeHtml(
    repository.description ||
      "No description is set for this repository on GitHub.",
  );
  const language = escapeHtml(repository.language || "Language not specified");
  const searchable = escapeHtml(
    `${repository.name} ${repository.description || ""} ${repository.language || ""}`.toLowerCase(),
  );
  const updated = new Date(repository.updated_at);
  if (Number.isNaN(updated.getTime())) {
    throw new Error(`Invalid GitHub update date for ${repository.name}`);
  }
  const updatedLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(updated);
  const repoUrl = escapeHtml(url.href);
  const number = String(index + 1).padStart(2, "0");
  const total = repositories.length;

  return `          <a class="repo-card" href="${repoUrl}" target="_blank" rel="noopener noreferrer" data-search="${searchable}" aria-label="Open ${name} repository on GitHub">
            <span class="repo-card-topline">
              <span class="repo-number">${number} / ${total}</span>
              <span class="repo-language">${language}</span>
            </span>
            <span class="repo-card-title">${name}</span>
            <span class="repo-card-description">${description}</span>
            <span class="repo-card-footer">
              <span class="repo-updated">Updated ${updatedLabel}</span>
              <span class="repo-open">Open on GitHub <span aria-hidden="true">↗</span></span>
            </span>
          </a>`;
}

const output = template
  .replaceAll("__REPO_COUNT__", String(repositories.length))
  .replace(
    "<!-- REPOSITORY_CARDS -->",
    repositories.map(repositoryCard).join("\n"),
  );
if (
  output.includes("__REPO_COUNT__") ||
  output.includes("<!-- REPOSITORY_CARDS -->")
) {
  throw new Error("Archive template contains an unresolved marker.");
}
await writeFile(outputPath, output, "utf8");
console.log(
  `Rendered ${repositories.length} public repository cards to public/github-work.html.`,
);
