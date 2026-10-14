const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.removeAttribute("data-open");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    if (isOpen) navigation.removeAttribute("data-open");
    else navigation.setAttribute("data-open", "true");
  });

  navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && trackedSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${visible.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.25, 0.6] },
  );
  trackedSections.forEach((section) => observer.observe(section));
}

const searchInput = document.querySelector("#repo-search");
const repoCards = [...document.querySelectorAll(".repo-card")];
const repoStatus = document.querySelector("#repo-status");
const repoEmpty = document.querySelector("#repo-empty");

if (searchInput && repoCards.length && repoStatus && repoEmpty) {
  const total = repoCards.length;
  const updateRepositoryResults = () => {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visible = 0;

    for (const card of repoCards) {
      const matches = !query || (card.dataset.search ?? "").includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    }

    repoStatus.textContent = `Showing ${visible} of ${total} public repositories`;
    repoEmpty.hidden = visible !== 0;
  };

  searchInput.addEventListener("input", updateRepositoryResults);
  updateRepositoryResults();
}
