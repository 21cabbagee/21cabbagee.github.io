# Saurabh Pandey — Portfolio

A static, responsive personal portfolio based on the résumé supplied in July 2026. The homepage keeps the résumé-backed experience and three selected projects; the separate GitHub archive provides direct links to 77 public, non-fork repositories. The site uses plain HTML, CSS and browser JavaScript, with a small Node HTTP server for local preview. It has no application dependencies, database, login, contact form, analytics, tracking scripts or runtime GitHub API calls.

## Run locally

Requires Node.js 22 or newer. From the project root:

```sh
npm run dev
```

Open `http://localhost:3000`. The preview server binds to `0.0.0.0` and honors `PORT` when set.

## Checks and build

```sh
npm run build
npm run check
```

The build renders `public/github-work.html` from `data/github-projects.json`, then copies the static site to `dist/`. Checks cover source syntax, résumé-backed content, the two-page route manifest and sitemap, canonical/social metadata, the selected-project links, all archive entries, contact profile URLs, and bundled assets.

## GitHub archive and profile links

`data/github-projects.json` is a public GitHub account snapshot from 14 October 2026. It contains 77 public, non-fork repositories owned by `21cabbagee`, including the portfolio source repository. It excludes the five forks and the profile/config repository `21cabbagee/21cabbagee`. Descriptions, primary languages and update dates come from public GitHub metadata; repositories with no description are labeled as such. The site's local search filters the generated archive without making browser requests to GitHub. Refresh the JSON snapshot and update its expected count/date in the renderer, checks and template when adding later repositories.

The selected résumé projects link to their matching GitHub source repositories. LinkedIn, X/Twitter and GitHub controls link to the public profiles only; the portfolio does not import their feeds or timelines. The illustrated profile avatar is copied from the public GitHub account and is labeled as an avatar, not a photograph.

## GitHub Pages

The public repository is `21cabbagee/21cabbagee.github.io`; the website is hosted at <https://21cabbagee.github.io/>. GitHub Actions builds and checks the static site, then deploys `dist/` on pushes to `main`. The public repository includes the site source, project snapshot, artwork, fonts and résumé PDF. Do not add credentials, private files or internal planning notes to that repository.

Manus remains the canonical project. Changes made there do not automatically sync to the public GitHub mirror; sync intentional site updates to GitHub to publish them.

## Content and evidence

The provided July 2026 résumé is the factual source for biography, education, employment, selected-project descriptions, skills, awards, certifications and contact details. The PDF's embedded LinkedIn and GitHub destinations are preserved as public share links. Employment marked “Present” is not re-verified beyond the supplied résumé. Outcome figures are attributed on-page to the résumé and named organizations; they are not independently verified by the site.

The abstract hero illustration, linked public profile avatar, self-hosted fonts and original résumé PDF are bundled for predictable static delivery. Publishing the website and public repository makes the résumé-listed contact information and résumé PDF accessible publicly.
