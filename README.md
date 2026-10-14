# Saurabh Pandey — Portfolio

A static, responsive personal portfolio built from the résumé supplied in July 2026. It uses plain HTML, CSS, and browser JavaScript, with a small Node HTTP server for local preview. There are no application dependencies, database, server-side features, contact form, analytics, tracking scripts, or external APIs.

## Run locally

Requires Node.js 22 or newer. From the project root:

```sh
npm run dev
```

Open `http://localhost:3000`. The server binds to `0.0.0.0` and honors `PORT` when set.

## Checks and build

```sh
npm run check
npm run build
```

`check` validates source syntax, resume-backed portfolio content, in-page navigation targets, the Manus route manifest, public assets, and GitHub Pages SEO documents. `build` copies the static site to `dist/`.

## GitHub Pages

The separate public GitHub repository is `21cabbagee/21cabbagee.github.io`. GitHub Actions checks and builds the site, then deploys `dist/` to `https://21cabbagee.github.io/` on pushes to `main`. The public repository includes the site's source, image/font assets, and downloadable résumé PDF. Do not add credentials, secrets, private files, or internal planning documents to this public mirror.

Manus remains the canonical project. Changes made in Manus do not automatically sync to the public GitHub mirror; sync intentional site updates to the GitHub repository to publish them.

## Content and evidence

The supplied July 2026 résumé is the sole source for biographical, education, employment, project, skills, award, certification, and contact details. The PDF's embedded LinkedIn and GitHub destinations are used as supplied. Employment marked “Present” is not re-verified beyond the provided résumé. Selected outcome figures are attributed in-page to the résumé and named organizations; they are not independently verified by this site.

The optimized abstract hero illustration and original résumé PDF are bundled under `public/` for predictable static delivery. The portfolio is a static website, not an application with accounts, a contact form, analytics, or a live backend. Publishing it via GitHub Pages makes the site and its resume-listed contact information publicly accessible.
