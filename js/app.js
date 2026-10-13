/**
 * HACKINDIA HUB - MAIN APPLICATION CONTROLLER
 * Routing, Filtering, Real-time Countdown Deadlines, Card Rendering, and Details Modal.
 */

let activeView = "discover";
let currentViewMode = "list"; // "list" | "map"
let filteredHackathons = [];
let activeModalHackathon = null;

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initAuthUI();
  loadUserProfile();
  loadTeamPosts();
  loadPendingSubmissions();
  loadNotifications();

  initCounters();
  initDeadlineTicker();
  initSearchAndFilters();
  initIndiaMap();
  initAiAssistant();

  // Initial render
  applyFilters();

  // Listen to hash changes (deep linking like #hackathon=hack-01)
  handleHashNavigation();
  window.addEventListener("hashchange", handleHashNavigation);

  // Navbar scroll glass effect
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".navbar");
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    }
  });
});

/**
 * KPI Statistics Counter Animation
 */
function initCounters() {
  document.getElementById("statCountHackathons").textContent = "140+";
  document.getElementById("statCountCities").textContent = "45+";
  document.getElementById("statCountColleges").textContent = "350+";
  document.getElementById("statCountThisWeek").textContent = "18";
}

/**
 * Real-time Deadline Countdown Engine
 */
function getRegistrationStatus(deadlineIsoString) {
  if (!deadlineIsoString) {
    return {
      status: "open",
      cssClass: "status-open",
      label: "🟢 Open",
      timeText: "Registration Open",
      isClosed: false,
      diffMs: 864000000
    };
  }
  const deadline = new Date(deadlineIsoString).getTime();
  if (isNaN(deadline)) {
    return {
      status: "open",
      cssClass: "status-open",
      label: "🟢 Open",
      timeText: "Registration Open",
      isClosed: false,
      diffMs: 864000000
    };
  }
  const now = new Date().getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    return {
      status: "closed",
      cssClass: "status-closed",
      label: "🔴 Closed",
      timeText: "Registration Closed",
      isClosed: true,
      diffMs: diff
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let timeText = "";
  if (days > 0) {
    timeText = `${days}d ${hours}h ${minutes}m`;
  } else {
    timeText = `${hours}h ${minutes}m ${seconds}s`;
  }

  // Visual labels as specified: 🟢 Open, 🟡 Closing Soon (< 5 days)
  if (days < 5) {
    return {
      status: "closing-soon",
      cssClass: "status-closing-soon",
      label: "🟡 Closing Soon",
      timeText: `Closes in ${timeText}`,
      isClosed: false,
      diffMs: diff
    };
  } else {
    return {
      status: "open",
      cssClass: "status-open",
      label: "🟢 Open",
      timeText: `Closes in ${timeText}`,
      isClosed: false,
      diffMs: diff
    };
  }
}

function initDeadlineTicker() {
  // Update all live countdown spans on page every 1000ms
  setInterval(() => {
    document.querySelectorAll("[data-deadline]").forEach(el => {
      const deadlineIso = el.getAttribute("data-deadline");
      const statusObj = getRegistrationStatus(deadlineIso);
      el.textContent = statusObj.timeText;
    });
  }, 1000);
}

/**
 * Filter Engine & Real-time Search
 */
function initSearchAndFilters() {
  const searchInput = document.getElementById("heroSearchInput");
  const quickSearchInput = document.getElementById("quickSearchInput");
  const stateFilter = document.getElementById("filterLocationState");
  const modeFilter = document.getElementById("filterMode");
  const techFilter = document.getElementById("filterTech");
  const difficultyFilter = document.getElementById("filterDifficulty");
  const eligibilityFilter = document.getElementById("filterEligibility");
  const prizeFilter = document.getElementById("filterPrize");
  const sourceFilter = document.getElementById("filterDataSource");
  const sortSelect = document.getElementById("sortBySelect");

  const triggerFilter = () => {
    applyFilters();
  };

  [searchInput, quickSearchInput].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", (e) => {
        // Sync inputs
        if (inp === searchInput && quickSearchInput) quickSearchInput.value = e.target.value;
        if (inp === quickSearchInput && searchInput) searchInput.value = e.target.value;
        triggerFilter();
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          applyFilters();
          document.getElementById("discoveryResultsSection")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });

  [stateFilter, modeFilter, techFilter, difficultyFilter, eligibilityFilter, prizeFilter, sourceFilter, sortSelect].forEach(sel => {
    if (sel) sel.addEventListener("change", triggerFilter);
  });
}

function applyFilters() {
  const query = (document.getElementById("quickSearchInput")?.value || document.getElementById("heroSearchInput")?.value || "").toLowerCase().trim();
  const selectedState = document.getElementById("filterLocationState")?.value || "all";
  const selectedMode = document.getElementById("filterMode")?.value || "all";
  const selectedTech = document.getElementById("filterTech")?.value || "all";
  const selectedDifficulty = document.getElementById("filterDifficulty")?.value || "all";
  const selectedEligibility = document.getElementById("filterEligibility")?.value || "all";
  const selectedPrize = document.getElementById("filterPrize")?.value || "all";
  const selectedSource = document.getElementById("filterDataSource")?.value || "all";
  const sortBy = document.getElementById("sortBySelect")?.value || "deadline";

  filteredHackathons = HACKATHONS_DATA.filter(h => {
    // 1. Text Search across Title, Organizer, City, State, Technologies, Themes
    if (query) {
      const haystack = [
        h.title,
        h.organizer,
        h.city,
        h.state,
        ...(h.technologies || []),
        ...(h.themes || []),
        h.eligibility,
        h.difficulty
      ].join(" ").toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    // 2. State Filter
    if (selectedState !== "all") {
      if (selectedState === "Online") {
        if (h.mode !== "Online") return false;
      } else {
        if (h.state.toLowerCase() !== selectedState.toLowerCase() && h.mode !== "Online") {
          return false;
        }
      }
    }

    // 3. Mode Filter
    if (selectedMode !== "all" && h.mode.toLowerCase() !== selectedMode.toLowerCase()) {
      return false;
    }

    // 4. Technology Filter
    if (selectedTech !== "all") {
      const hasTech = h.technologies.some(t => t.toLowerCase().includes(selectedTech.toLowerCase()));
      if (!hasTech) return false;
    }

    // 5. Difficulty Filter
    if (selectedDifficulty !== "all" && h.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
      return false;
    }

    // 6. Eligibility Filter
    if (selectedEligibility !== "all") {
      if (selectedEligibility === "beginner" && h.difficulty !== "Beginner" && !h.eligibility.toLowerCase().includes("beginner")) {
        return false;
      }
      if (selectedEligibility === "college" && !h.eligibility.toLowerCase().includes("college")) {
        return false;
      }
    }

    // 7. Prize Pool Filter
    if (selectedPrize !== "all") {
      const minPrize = parseInt(selectedPrize, 10);
      if (h.prizePool < minPrize) return false;
    }

    // 8. Data Source Filter
    if (selectedSource !== "all") {
      if (selectedSource === "live-only" && !h.isLiveSynced) return false;
      if (selectedSource === "devfolio" && (h.sourcePlatform || "").toLowerCase() !== "devfolio") return false;
      if (selectedSource === "unstop" && (h.sourcePlatform || "").toLowerCase() !== "unstop") return false;
      if (selectedSource === "curated" && h.isLiveSynced) return false;
    }

    return true;
  });

  // Sorting
  filteredHackathons.sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
    }
    if (sortBy === "prize-high") {
      return b.prizePool - a.prizePool;
    }
    if (sortBy === "popular") {
      return (b.participantCount || 0) - (a.participantCount || 0);
    }
    if (sortBy === "newest") {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  renderHackathonsList();
}

function renderHackathonsList() {
  const container = document.getElementById("hackathonsGridList");
  const countEl = document.getElementById("discoveryResultCount");

  if (countEl) {
    countEl.textContent = `${filteredHackathons.length} Hackathon${filteredHackathons.length === 1 ? '' : 's'}`;
  }

  if (!container) return;

  if (filteredHackathons.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-subtle);">
        <h3 style="color: #fff; font-size: 1.4rem;">No Hackathons Found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem; max-width: 500px; margin-inline: auto;">
          We couldn't find any hackathons matching your exact filter criteria. Try resetting your filters or search query!
        </p>
        <button class="btn btn-cyan btn-sm" onclick="resetAllFilters()" style="margin-top: 1.5rem;">
          🔄 Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredHackathons.map(h => renderHackathonCard(h)).join('');
}

function renderHackathonCard(h, customRecommendationReason = null) {
  const statusObj = getRegistrationStatus(h.registrationDeadline);
  const isSaved = currentUserProfile && (currentUserProfile.savedHackathons || []).includes(h.id);

  return `
    <div class="hackathon-card" data-card-id="${h.id}">
      <div class="card-banner">
        <img src="${h.bannerImg || 'assets/hero_banner.jpg'}" alt="${h.title}" class="card-banner-img" loading="lazy" />
        <div class="card-banner-overlay"></div>

        <div class="card-badges-top">
          <span class="status-pill ${statusObj.cssClass}">
            ${statusObj.label}
          </span>
          ${h.isLiveSynced ? `
            <span class="live-synced-badge" title="Real-time daily auto-synced from ${h.sourcePlatform || 'Live Feed'}">
              ⚡ ${h.sourcePlatform || 'Live'}
            </span>
          ` : ''}
          ${h.verified ? `
            <span class="verified-badge" title="Verified official source: ${h.verificationSource}">
              Verified ✓
            </span>
          ` : ''}
        </div>

        <button class="card-save-btn ${isSaved ? 'saved' : ''}" data-id="${h.id}" onclick="toggleSaveHackathon('${h.id}', event)" title="Save Hackathon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      <div class="card-content">
        <div class="card-organizer-row">
          <div class="organizer-icon">${h.organizerInitials || h.organizer.slice(0, 2).toUpperCase()}</div>
          <span class="organizer-name" title="${h.organizer}">${h.organizer}</span>
        </div>

        <h3 class="card-title" onclick="openHackathonModal('${h.id}')" title="${h.title}">
          ${h.title}
        </h3>

        ${customRecommendationReason ? `
          <div class="card-recommend-badge">
            ${customRecommendationReason}
          </div>
        ` : ''}

        <div class="card-meta-grid">
          <div class="meta-item">
            <span class="meta-icon">📍</span>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Location</div>
              <div class="meta-val">${h.city} (${h.mode})</div>
            </div>
          </div>

          <div class="meta-item">
            <span class="meta-icon">💰</span>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Prize Pool</div>
              <div class="meta-val prize-highlight">${h.prizePoolDisplay}</div>
            </div>
          </div>

          <div class="meta-item">
            <span class="meta-icon">📅</span>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Dates</div>
              <div class="meta-val">${h.startDate ? h.startDate.slice(5) : "TBD"} to ${h.endDate ? h.endDate.slice(5) : "TBD"}</div>
            </div>
          </div>

          <div class="meta-item">
            <span class="meta-icon">👥</span>
            <div>
              <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Team Size</div>
              <div class="meta-val">${h.teamSizeDisplay || "2–4 Members"}</div>
            </div>
          </div>
        </div>

        <div class="card-tags">
          ${(h.technologies || []).slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('')}
          <span class="tech-tag" style="color: var(--cyan); border-color: rgba(0,242,254,0.3);">${h.difficulty || "Open"}</span>
        </div>

        <div class="card-countdown-box">
          <span class="countdown-label">Registration Deadline:</span>
          <span class="countdown-timer-digits" data-deadline="${h.registrationDeadline}">
            ${statusObj.timeText}
          </span>
        </div>

        <div class="card-actions-row">
          <button class="btn-card-register" onclick="window.open('${h.registrationUrl}', '_blank')">
            🚀 Register Now
          </button>
          <button class="btn-card-details" onclick="openHackathonModal('${h.id}')">
            Details
          </button>
          <button class="btn-card-share" onclick="openShareModal('${h.id}', event)" title="Share / WhatsApp Preview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

function resetAllFilters() {
  const ids = ["heroSearchInput", "quickSearchInput", "filterLocationState", "filterMode", "filterTech", "filterDifficulty", "filterEligibility", "filterPrize", "filterDataSource"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = el.tagName === "SELECT" ? "all" : "";
  });
  applyFilters();
  showToast("Filters reset to default view.", "info");
}

function quickHeroCategoryFilter(techOrCity) {
  if (techOrCity === "live-synced") {
    const srcSelect = document.getElementById("filterDataSource");
    if (srcSelect) srcSelect.value = "live-only";
  } else {
    const techSelect = document.getElementById("filterTech");
    if (techSelect) {
      techSelect.value = techOrCity;
    }
  }
  applyFilters();
  document.getElementById("discoveryResultsSection")?.scrollIntoView({ behavior: "smooth" });
}

/**
 * View Routing & Switching:
 * 'discover' | 'map' | 'teams' | 'dashboard' | 'admin'
 */
function navigateToView(viewName) {
  activeView = viewName;

  // Update navigation links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-view") === viewName);
  });

  // Hide all main view containers
  const views = ["discoverView", "mapViewSection", "teamsView", "dashboardView", "adminView"];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  if (viewName === "discover") {
    document.getElementById("discoverView").style.display = "block";
    switchViewMode(currentViewMode);
  } else if (viewName === "map") {
    document.getElementById("discoverView").style.display = "block";
    switchViewMode("map");
  } else if (viewName === "teams") {
    document.getElementById("teamsView").style.display = "block";
    renderTeamsView();
  } else if (viewName === "dashboard") {
    document.getElementById("dashboardView").style.display = "block";
    renderDashboardView();
  } else if (viewName === "admin") {
    document.getElementById("adminView").style.display = "block";
    renderAdminDashboard();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchViewMode(mode) {
  currentViewMode = mode;
  const listToggle = document.getElementById("toggleListView");
  const mapToggle = document.getElementById("toggleMapView");
  const listContainer = document.getElementById("discoveryResultsSection");
  const mapContainer = document.getElementById("mapViewSection");

  if (listToggle) listToggle.classList.toggle("active", mode === "list");
  if (mapToggle) mapToggle.classList.toggle("active", mode === "map");

  if (mode === "list") {
    if (listContainer) listContainer.style.display = "block";
    if (mapContainer) mapContainer.style.display = "none";
  } else {
    if (listContainer) listContainer.style.display = "none";
    if (mapContainer) mapContainer.style.display = "block";
    initIndiaMap();
  }
}

/**
 * Detailed Hackathon Modal
 */
function openHackathonModal(hackathonId) {
  const hack = HACKATHONS_DATA.find(h => h.id === hackathonId);
  if (!hack) return;

  activeModalHackathon = hack;
  const modal = document.getElementById("hackathonDetailsModal");
  if (!modal) return;

  const statusObj = getRegistrationStatus(hack.registrationDeadline);
  const isSaved = currentUserProfile && (currentUserProfile.savedHackathons || []).includes(hack.id);

  // Populate header
  document.getElementById("modalDetailImg").src = hack.bannerImg || "assets/hero_banner.jpg";
  document.getElementById("modalDetailTitle").textContent = hack.title;
  document.getElementById("modalDetailOrganizer").textContent = `Organized by ${hack.organizer} (${hack.organizerType})`;
  document.getElementById("modalDetailStatusBadge").textContent = statusObj.label;
  document.getElementById("modalDetailStatusBadge").className = `status-pill ${statusObj.cssClass}`;

  // Strip highlights
  document.getElementById("modalStripPrize").textContent = hack.prizePoolDisplay;
  document.getElementById("modalStripLocation").textContent = `${hack.city}, ${hack.state} (${hack.mode})`;
  document.getElementById("modalStripDates").textContent = `${hack.startDate} to ${hack.endDate}`;
  document.getElementById("modalStripTeam").textContent = hack.teamSizeDisplay;

  // Overview Tab
  document.getElementById("modalDetailFullDesc").textContent = hack.fullDescription || hack.shortDescription;
  document.getElementById("modalDetailVenue").textContent = hack.venueAddress || "Online Virtual Platform";
  document.getElementById("modalDetailEligibility").textContent = hack.eligibility;
  document.getElementById("modalDetailDifficulty").textContent = hack.difficulty;

  // Source Verification Box
  document.getElementById("modalDetailSourceBox").innerHTML = `
    <div>
      <strong>${hack.isLiveSynced ? '⚡ Real-Time Daily Auto-Synced' : '✓ Verified Hackathon'}</strong> — Authenticated Source:
      <br/>
      <a href="${hack.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--cyan); text-decoration: underline;">${hack.verificationSource || hack.sourceUrl} ↗</a>
      ${hack.syncedAt ? `<div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 3px;">Daily live refresh: ${new Date(hack.syncedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</div>` : ''}
    </div>
    <button class="btn btn-outline btn-sm" onclick="openReportModal('${hack.id}')" style="color: var(--text-muted); font-size: 0.75rem;">
      🚩 Report Event
    </button>
  `;

  // Tracks Tab
  const tracksContainer = document.getElementById("modalDetailTracks");
  if (tracksContainer) {
    tracksContainer.innerHTML = (hack.tracks || []).map(t => `
      <div class="track-card">
        <h4 class="track-name">⚡ ${t.name}</h4>
        <p class="track-desc">${t.description}</p>
      </div>
    `).join('') || '<p style="color: var(--text-dim);">Open Innovation track for all technology domains.</p>';
  }

  // Prizes Tab
  const prizesContainer = document.getElementById("modalDetailPrizes");
  if (prizesContainer) {
    prizesContainer.innerHTML = (hack.prizeBreakdown || []).map((p, idx) => `
      <div class="prize-tier-card ${idx === 0 ? 'winner' : ''}">
        <div class="prize-rank">${p.rank}</div>
        <div class="prize-amount">${p.amount}</div>
        <div class="prize-perks">${p.perks || 'Certificates & Swag'}</div>
      </div>
    `).join('') || `<div class="prize-tier-card"><div class="prize-amount">${hack.prizePoolDisplay}</div></div>`;
  }

  // Timeline Tab
  const timelineContainer = document.getElementById("modalDetailTimeline");
  if (timelineContainer) {
    timelineContainer.innerHTML = (hack.timeline || []).map(step => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-date">${step.date}</div>
        <div class="timeline-title">${step.phase}</div>
        <div class="timeline-desc">${step.desc}</div>
      </div>
    `).join('');
  }

  // FAQs Tab
  const faqsContainer = document.getElementById("modalDetailFaqs");
  if (faqsContainer) {
    faqsContainer.innerHTML = (hack.faqs || []).map(f => `
      <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
        <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.4rem;">❓ ${f.q}</h4>
        <p style="color: var(--text-muted); font-size: 0.86rem; line-height: 1.5;">${f.a}</p>
      </div>
    `).join('');
  }

  // Actions
  const regBtn = document.getElementById("modalActionRegister");
  if (regBtn) {
    regBtn.onclick = () => window.open(hack.registrationUrl, "_blank");
  }

  const saveBtn = document.getElementById("modalActionSave");
  if (saveBtn) {
    saveBtn.textContent = isSaved ? "❤️ Saved" : "🤍 Save Hackathon";
    saveBtn.onclick = () => {
      toggleSaveHackathon(hack.id);
      saveBtn.textContent = currentUserProfile.savedHackathons.includes(hack.id) ? "❤️ Saved" : "🤍 Save Hackathon";
    };
  }

  const shareBtn = document.getElementById("modalActionShare");
  if (shareBtn) {
    shareBtn.onclick = () => openShareModal(hack.id);
  }

  const calBtn = document.getElementById("modalActionCalendar");
  if (calBtn) {
    calBtn.onclick = () => openCalendarModal(hack.id);
  }

  // Default to overview tab
  switchModalTab("overview");
  modal.classList.add("active");

  // Update URL hash for sharing
  window.location.hash = `hackathon=${hack.id}`;
}

function switchModalTab(tabName) {
  document.querySelectorAll(".details-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });
  document.querySelectorAll(".details-tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `modalTab-${tabName}`);
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    if (modalId === "hackathonDetailsModal") {
      history.replaceState(null, null, ' ');
    }
  }
}

// Close modal on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.active").forEach(m => closeModal(m.id));
  }
});

// Close modal when clicking outside on backdrop
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop") && e.target.classList.contains("active")) {
    closeModal(e.target.id);
  }
});

function handleHashNavigation() {
  const hash = window.location.hash;
  if (hash.startsWith("#hackathon=")) {
    const hackId = hash.replace("#hackathon=", "");
    openHackathonModal(hackId);
  }
}

/**
 * Report Hackathon Workflow
 */
let reportingHackathonId = null;

function openReportModal(hackathonId) {
  reportingHackathonId = hackathonId;
  const hack = HACKATHONS_DATA.find(h => h.id === hackathonId);
  const title = hack ? hack.title : "Hackathon";

  document.getElementById("reportModalHackTitle").textContent = title;
  const modal = document.getElementById("reportHackathonModal");
  if (modal) modal.classList.add("active");
}

function submitReport(e) {
  e.preventDefault();
  const reason = document.getElementById("reportReason").value;
  const details = document.getElementById("reportDetails").value;

  const hack = HACKATHONS_DATA.find(h => h.id === reportingHackathonId);

  reportedHackathons.push({
    id: `rep-${Date.now()}`,
    hackathonId: reportingHackathonId,
    hackathonTitle: hack ? hack.title : "Reported Event",
    reason: `${reason}: ${details}`,
    reportedBy: currentUserProfile ? currentUserProfile.name : "Anonymous Student",
    status: "pending_review",
    reportedAt: new Date().toISOString().split("T")[0]
  });

  closeModal("reportHackathonModal");
  showToast("Thank you for protecting our community! Admin trust team will investigate this listing within 2 hours. 🛡️", "info");
}

/**
 * Toast Notification System
 */
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Mobile Filter Drawer Toggle
 */
function toggleMobileFilters() {
  const sidebar = document.getElementById("filtersSidebar");
  const chevron = document.getElementById("mobileFilterChevron");
  if (!sidebar) return;
  sidebar.classList.toggle("mobile-open");
  if (chevron) {
    chevron.textContent = sidebar.classList.contains("mobile-open") ? "▴" : "▾";
  }
}
