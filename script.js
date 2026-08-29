document.addEventListener("DOMContentLoaded", () => {
  /* ================= MOBILE SIDEBAR ================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const mobileToggle = document.getElementById("mobileToggle");

  function openSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
  }
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      sidebar && sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });
  }
  if (overlay) overlay.addEventListener("click", closeSidebar);

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
    document.querySelectorAll(`.nav-link[data-target="${id}"]`).forEach(a => a.classList.add("active"));
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
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

  sections.forEach(sec => observer.observe(sec));

  /* ================= DARK / LIGHT MODE ================= */
  const themeToggleBtn = document.getElementById("themeToggle");
  const darkModeSwitch = document.getElementById("darkModeSwitch");
  const body = document.body;

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.remove("dark");
      body.classList.add("light");
      if (darkModeSwitch) darkModeSwitch.checked = false;
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      if (darkModeSwitch) darkModeSwitch.checked = true;
    }
    localStorage.setItem("portfolio-theme", theme);
  }

  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      applyTheme(body.classList.contains("dark") ? "light" : "dark");
    });
  }
  if (darkModeSwitch) {
    darkModeSwitch.addEventListener("change", () => {
      applyTheme(darkModeSwitch.checked ? "dark" : "light");
    });
  }

  /* ================= SKILL BAR ANIMATION & CATEGORY FILTERING ================= */
  const skillsCard = document.getElementById("skills");
  const animateSkillFills = () => {
    document.querySelectorAll(".skill-row").forEach(row => {
      const level = row.getAttribute("data-level");
      const fill = row.querySelector(".skill-fill");
      if (fill && level) {
        fill.style.width = level + "%";
      }
    });
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillFills();
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (skillsCard) skillObserver.observe(skillsCard);

  // Skill category filter buttons
  const skillTabButtons = document.querySelectorAll(".skill-tab-btn");
  const skillCategoryCards = document.querySelectorAll(".skill-category-card");

  skillTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetCategory = btn.getAttribute("data-category");

      // Update active state on tab buttons
      skillTabButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Show/Hide category cards
      skillCategoryCards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        if (targetCategory === "all" || cardCategory === targetCategory) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });

      // Ensure skill bars inside newly shown categories are animated
      setTimeout(animateSkillFills, 50);
    });
  });

  /* ================= TERMINAL COMMAND SWITCHER ================= */
  const termButtons = document.querySelectorAll(".term-btn");
  const terminalOutput = document.getElementById("terminalOutput");
  const terminalTitle = document.getElementById("terminalTitle");

  const terminalScripts = {
    health: {
      title: "pwsh — endpoint-automation.ps1",
      html: `<p><span class="prompt">PS&gt;</span> Connect-MgGraph -Scopes "DeviceManagementManagedDevices.ReadWrite.All"</p>
<p class="term-line"><span class="term-green">✓</span> Connected to Microsoft Graph (Tenant: Enterprise Managed)</p>
<p><span class="prompt">PS&gt;</span> Get-EndpointCompliance -Status "All"</p>
<p class="term-line">Target: <span class="term-blue">Windows 11 / macOS</span> | Compliance: <span class="term-green">99.4%</span> | State: <span class="term-purple">Optimal</span></p>
<p><span class="prompt">PS&gt;</span> Invoke-ProactiveRemediation -Policy "ZeroTrustBaselines"</p>
<p class="term-line"><span class="term-green">✓ Execution completed</span> (0 errors, 42 remediated)<span class="cursor">_</span></p>`
    },
    graph: {
      title: "pwsh — query-graph-devices.ps1",
      html: `<p><span class="prompt">PS&gt;</span> $Uri = "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices"</p>
<p><span class="prompt">PS&gt;</span> $Devices = (Invoke-MgGraphRequest -Method GET -Uri $Uri).value</p>
<p class="term-line"><span class="term-green">✓ Retrieved:</span> 4,850 Endpoints | Windows: 3,200 | Mac: 950 | iOS/Android: 700</p>
<p><span class="prompt">PS&gt;</span> $Stale = $Devices | Where-Object { $_.lastSyncDateTime -lt (Get-Date).AddDays(-30) }</p>
<p class="term-line"><span class="term-purple">ℹ Hygiene check:</span> 0 stale records detected across enterprise tenant<span class="cursor">_</span></p>`
    },
    autopilot: {
      title: "pwsh — autopilot-deployment.ps1",
      html: `<p><span class="prompt">PS&gt;</span> Get-AutopilotDeviceProfile -Tenant "CloudEnterprise"</p>
<p class="term-line">Profile: <span class="term-blue">Global-Corporate-ZeroTouch</span> | Mode: <span class="term-green">User-Driven Entra Join</span></p>
<p><span class="prompt">PS&gt;</span> Test-AutopilotEnrollmentStatus -Batch "Q3-Refresh"</p>
<p class="term-line">Enrolled: <span class="term-green">100%</span> (350/350 devices) | ESP Completion Avg: <span class="term-blue">14.2 min</span></p>
<p class="term-line"><span class="term-green">✓ Device readiness verified.</span> Hardware hash auto-assigned.<span class="cursor">_</span></p>`
    }
  };

  termButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      termButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cmd = btn.getAttribute("data-cmd");
      if (terminalScripts[cmd]) {
        if (terminalTitle) terminalTitle.textContent = terminalScripts[cmd].title;
        if (terminalOutput) terminalOutput.innerHTML = terminalScripts[cmd].html;
      }
    });
  });

  /* ================= TOAST NOTIFICATION & COPY HELPER ================= */
  const toastNotification = document.getElementById("toastNotification");
  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toastNotification.classList.add("show");
    setTimeout(() => {
      toastNotification.classList.remove("show");
    }, 2800);
  }

  const emailContactCard = document.getElementById("emailContactCard");
  const profileEmailPill = document.getElementById("profileEmailPill");
  const emailToCopy = "Abhijith.mohanan@hotmail.com";

  function handleEmailCopy(e) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        showToast(`Copied ${emailToCopy} to clipboard!`);
      });
    }
  }

  if (emailContactCard) {
    emailContactCard.addEventListener("click", handleEmailCopy);
  }
  if (profileEmailPill) {
    profileEmailPill.addEventListener("click", handleEmailCopy);
  }

  /* ================= SEARCH & COMMAND PALETTE ================= */
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  const searchIndex = [
    { title: "Dashboard", id: "dashboard", keywords: "home welcome hero intro fleet health telemetry" },
    { title: "What I Build", id: "what-i-build", keywords: "tenant engineering zero touch deployment autopilot endpoint security automation mdm client enablement" },
    { title: "Engineering Lifecycle", id: "lifecycle", keywords: "lifecycle assess architect build deploy secure automate operate optimize methodology" },
    { title: "Endpoint Capabilities Matrix", id: "overview", keywords: "endpoint engineering automation deployment security euc operations modern workplace" },
    { title: "Featured Projects", id: "projects", keywords: "wallpaper win32 automation framework autopilot endpoint automation graph api" },
    { title: "Experience Timeline", id: "experience", keywords: "principal infrastructure engineer it analyst support engineer hardware career history" },
    { title: "Professional Profile & Strengths", id: "about", keywords: "experience background summary who am i strengths achievements" },
    { title: "Toolstack & Technologies", id: "tools", keywords: "jira servicenow nexthink github enterprise win32 endpoint analytics intune powershell graph api" },
    { title: "Automation Console", id: "automation", keywords: "powershell terminal script get-endpointautomation autopilot graph api" },
    { title: "Technical Insights", id: "blog", keywords: "articles intune powershell endpoint management insights lifecycle packaging" },
    { title: "Let's Connect / Contact", id: "contact", keywords: "email linkedin github reach out message" },
    { title: "Technical Proficiency", id: "skills", keywords: "proficiency intune powershell windows graph api azure ad packaging mdm" },
    { title: "Verified Certifications", id: "certifications", keywords: "microsoft certified nexthink expert administrator endpoint security cnsp" },
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

  if (searchInput && searchResults) {
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
  }
});
