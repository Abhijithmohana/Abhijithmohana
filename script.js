document.addEventListener("DOMContentLoaded", () => {
  /* ================= MOBILE SIDEBAR ================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const mobileToggle = document.getElementById("mobileToggle");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }
  mobileToggle.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener("click", closeSidebar);

  /* ================= NAV LINKS / SMOOTH SCROLL ================= */
  const navLinks = document.querySelectorAll(".nav-link[data-target]");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("data-target");
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveLink(targetId);
      }
      closeSidebar();
    });
  });

  function setActiveLink(id) {
    navLinks.forEach(l => l.classList.remove("active"));
    const active = document.querySelector(`.nav-link[data-target="${id}"]`);
    if (active) active.classList.add("active");
  }

  /* ================= SCROLL SPY ================= */
  const sections = Array.from(navLinks)
    .map(l => document.getElementById(l.getAttribute("data-target")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

  sections.forEach(sec => observer.observe(sec));

  /* ================= DARK / LIGHT MODE ================= */
  const themeToggleBtn = document.getElementById("themeToggle");
  const darkModeSwitch = document.getElementById("darkModeSwitch");
  const body = document.body;

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark");
      body.classList.add("light");
      darkModeSwitch.checked = false;
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      darkModeSwitch.checked = true;
    }
    localStorage.setItem("portfolio-theme", theme);
  }

  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(body.classList.contains("dark") ? "light" : "dark");
  });
  darkModeSwitch.addEventListener("change", () => {
    applyTheme(darkModeSwitch.checked ? "dark" : "light");
  });

  /* ================= SKILL BAR ANIMATION ================= */
  const skillsCard = document.getElementById("skills");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".skill-row").forEach(row => {
          const level = row.getAttribute("data-level");
          const fill = row.querySelector(".skill-fill");
          fill.style.width = level + "%";
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  if (skillsCard) skillObserver.observe(skillsCard);

  /* ================= SEARCH ================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const searchIndex = [
    { title: "Dashboard", id: "dashboard", keywords: "home welcome hero intro" },
    { title: "Endpoint Overview", id: "overview", keywords: "endpoint engineering automation deployment security euc operations" },
    { title: "Featured Projects", id: "projects", keywords: "wallpaper win32 automation framework autopilot endpoint automation" },
    { title: "Experience", id: "experience", keywords: "principal infrastructure engineer it analyst support engineer hardware career" },
    { title: "About Me", id: "about", keywords: "experience background summary who am i" },
    { title: "Core Strengths / Achievements", id: "achievements", keywords: "strengths core strengths capabilities" },
    { title: "Tools & Technologies", id: "tools", keywords: "jira servicenow nexthink github enterprise win32 endpoint analytics intune powershell" },
    { title: "Automation Scripts", id: "automation", keywords: "powershell terminal script get-endpointautomation" },
    { title: "Blog / Insights", id: "blog", keywords: "articles intune powershell endpoint management insights" },
    { title: "Contact", id: "contact", keywords: "email linkedin github reach out message" },
    { title: "Technical Skills", id: "skills", keywords: "proficiency intune powershell windows graph api azure ad" },
    { title: "Certifications", id: "certifications", keywords: "microsoft certified certifications" },
  ];

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.classList.remove("active");
      searchResults.innerHTML = "";
      return;
    }
    const matches = searchIndex.filter(item =>
      item.title.toLowerCase().includes(q) || item.keywords.includes(q)
    );
    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-no-result">No results for "${query}"</div>`;
    } else {
      searchResults.innerHTML = matches
        .map(m => `<div class="search-result-item" data-id="${m.id}">${m.title}</div>`)
        .join("");
    }
    searchResults.classList.add("active");
  }

  searchInput.addEventListener("input", (e) => renderResults(e.target.value));
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) searchResults.classList.add("active");
  });

  searchResults.addEventListener("click", (e) => {
    const item = e.target.closest(".search-result-item");
    if (!item) return;
    const id = item.getAttribute("data-id");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLink(id);
    }
    searchInput.value = "";
    searchResults.classList.remove("active");
    searchInput.blur();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      searchResults.classList.remove("active");
    }
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (e.key === "Escape") {
      searchResults.classList.remove("active");
      searchInput.blur();
    }
  });
});
