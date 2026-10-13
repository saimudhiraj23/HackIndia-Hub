/**
 * HACKINDIA HUB - PERSONALIZED STUDENT DASHBOARD & RECOMMENDATION ENGINE
 * Profile management, personalized recommendation scoring, and saved events.
 */

let currentUserProfile = null;

function loadUserProfile() {
  // Auth gate: if logged in, sync auth account data into the profile first
  if (typeof authIsLoggedIn === "function" && authIsLoggedIn()) {
    if (typeof syncAuthToProfile === "function") {
      syncAuthToProfile();
    }
    updateNavProfile();
    return;
  }

  const saved = localStorage.getItem("hackindia_user_profile");
  if (saved) {
    try {
      currentUserProfile = JSON.parse(saved);
    } catch (e) {
      currentUserProfile = { ...DEFAULT_USER_PROFILE };
    }
  } else {
    currentUserProfile = { ...DEFAULT_USER_PROFILE };
    saveUserProfile();
  }
  updateNavProfile();
}

function saveUserProfile() {
  localStorage.setItem("hackindia_user_profile", JSON.stringify(currentUserProfile));
  if (typeof authIsLoggedIn === "function" && authIsLoggedIn()) {
    // authUpdateAccount is synchronous — wrap in try/catch instead of .catch()
    try { authUpdateAccount(currentUserProfile); } catch (e) {}
  }
}

function updateNavProfile() {
  const navName = document.getElementById("navProfileName");
  const navAvatar = document.getElementById("navAvatar");
  if (navName && currentUserProfile) {
    navName.textContent = currentUserProfile.name.split(" ")[0];
  }
  if (navAvatar && currentUserProfile) {
    const initials = currentUserProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    navAvatar.textContent = initials;
  }
}

/**
 * Recommendation Algorithm:
 * Scores each hackathon based on skills, interests, year, location, and difficulty.
 */
function getPersonalizedRecommendations() {
  if (!currentUserProfile) return [];

  const userSkills = (currentUserProfile.skills || []).map(s => s.toLowerCase());
  const userInterests = (currentUserProfile.interests || []).map(i => i.toLowerCase());
  const userCity = (currentUserProfile.city || "").toLowerCase();
  const userState = (currentUserProfile.state || "").toLowerCase();
  const isBeginnerOrFirstYear = (currentUserProfile.year || "").includes("1st") || currentUserProfile.experienceLevel === "Beginner";

  return HACKATHONS_DATA.map(hack => {
    let score = 0;
    let reasons = [];

    // 1. Skill Match
    const matchedSkills = (hack.technologies || []).filter(tech => 
      userSkills.some(skill => tech.toLowerCase().includes(skill) || skill.includes(tech.toLowerCase()))
    );
    if (matchedSkills.length > 0) {
      score += matchedSkills.length * 25;
      reasons.push(`matches your skills in ${matchedSkills.slice(0, 2).join(" & ")}`);
    }

    // 2. Interest / Theme Match
    const matchedThemes = (hack.themes || []).filter(theme => 
      userInterests.some(interest => theme.toLowerCase().includes(interest) || interest.includes(theme.toLowerCase()))
    );
    if (matchedThemes.length > 0) {
      score += matchedThemes.length * 20;
    }

    // 3. Location Proximity (Near You)
    const hCity = (hack.city || "").toLowerCase();
    const hState = (hack.state || "").toLowerCase();
    if (userCity && hCity === userCity) {
      score += 40;
      reasons.push(`happening right in ${hack.city}`);
    } else if (userState && hState === userState) {
      score += 25;
      reasons.push(`in your home state (${hack.state})`);
    }

    // 4. Beginner / Year Fit
    if (isBeginnerOrFirstYear && (hack.difficulty === "Beginner" || (hack.eligibility || "").toLowerCase().includes("beginner") || (hack.eligibility || "").toLowerCase().includes("1st"))) {
      score += 35;
      reasons.push("is highly beginner & 1st-year friendly");
    }

    // 5. Preferred Mode
    if (currentUserProfile.preferredMode === "Online" && hack.mode === "Online") score += 15;
    if (currentUserProfile.preferredMode === "Offline" && hack.mode === "Offline") score += 15;
    if (currentUserProfile.preferredMode === "Hybrid") score += 10;

    let recommendationReason = "";
    if (reasons.length > 0) {
      recommendationReason = `⭐ Recommended because it ${reasons.join(" and ")}.`;
    } else {
      recommendationReason = `⭐ Popular national hackathon open to ${currentUserProfile.branch} students.`;
    }

    return {
      hackathon: hack,
      score: score,
      reason: recommendationReason
    };
  }).sort((a, b) => b.score - a.score);
}

function renderDashboardView() {
  const container = document.getElementById("dashboardContentWrapper");
  if (!container || !currentUserProfile) return;

  const recommendations = getPersonalizedRecommendations();
  const topRecommendations = recommendations.slice(0, 6);

  // Closing soon (< 6 days)
  const closingSoon = HACKATHONS_DATA.filter(h => {
    const status = getRegistrationStatus(h.registrationDeadline);
    return status.status === "closing-soon";
  });

  // Near student
  const nearStudent = HACKATHONS_DATA.filter(h => 
    h.city.toLowerCase() === currentUserProfile.city.toLowerCase() ||
    h.state.toLowerCase() === currentUserProfile.state.toLowerCase()
  );

  // Beginner friendly
  const beginnerFriendly = HACKATHONS_DATA.filter(h => 
    h.difficulty === "Beginner" || h.eligibility.toLowerCase().includes("beginner")
  );

  // High prize pool (>= 500k)
  const highPrize = HACKATHONS_DATA.filter(h => h.prizePool >= 500000);

  // Saved hackathons
  const savedHacks = HACKATHONS_DATA.filter(h => 
    (currentUserProfile.savedHackathons || []).includes(h.id)
  );

  container.innerHTML = `
    <!-- Top Profile Summary Banner -->
    <div class="dashboard-header-card">
      <div class="profile-top-summary">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div class="profile-avatar-large">
            ${currentUserProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div class="profile-details-text">
            <h2>Welcome back, ${currentUserProfile.name}! 👋</h2>
            <p>
              ${currentUserProfile.year} • ${currentUserProfile.course} in ${currentUserProfile.branch}
              <br/>
              <span style="color: var(--cyan);">🏫 ${currentUserProfile.college}</span> • 📍 ${currentUserProfile.city}, ${currentUserProfile.state}
            </p>
          </div>
        </div>

        <button class="btn btn-outline btn-sm" onclick="openEditProfileModal()">
          ✏️ Edit Profile & Skills
        </button>
      </div>

      <div class="profile-chips-row">
        ${currentUserProfile.skills.map(s => `<span class="profile-badge-chip">💻 ${s}</span>`).join('')}
        ${currentUserProfile.interests.map(i => `<span class="profile-badge-chip" style="color: var(--saffron-light);">🎯 ${i}</span>`).join('')}
        <span class="profile-badge-chip" style="color: var(--emerald);">⚡ Level: ${currentUserProfile.experienceLevel}</span>
        <span class="profile-badge-chip" style="color: #c084fc;">🌐 Preferred Mode: ${currentUserProfile.preferredMode}</span>
      </div>

      <div style="margin-top: 1.5rem; padding: 1rem 1.25rem; border-radius: var(--radius-md); background: rgba(0, 242, 254, 0.06); border: 1px solid rgba(0, 242, 254, 0.2); font-size: 0.92rem; color: #e2e8f0; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap: 1rem;">
        <div>
          🚀 <strong>AI Matcher Active:</strong> Based on your profile (${currentUserProfile.year}, ${currentUserProfile.skills.slice(0, 3).join(", ")}, ${currentUserProfile.city}), we curated <strong>${topRecommendations.length} high-match hackathons</strong> for you.
        </div>
        <button class="btn btn-glow-outline btn-sm" onclick="openAiMatcherWithProfile()">
          🤖 Ask AI Matcher
        </button>
      </div>
    </div>

    <!-- Dashboard Sub-Tabs -->
    <div class="dashboard-sections-nav">
      <button class="dash-nav-btn active" onclick="switchDashTab(event, 'dash-recommended')">
        🌟 Recommended for You (${topRecommendations.length})
      </button>
      <button class="dash-nav-btn" onclick="switchDashTab(event, 'dash-closing')">
        ⏳ Closing Soon (${closingSoon.length})
      </button>
      <button class="dash-nav-btn" onclick="switchDashTab(event, 'dash-near')">
        📍 Near You (${nearStudent.length})
      </button>
      <button class="dash-nav-btn" onclick="switchDashTab(event, 'dash-beginner')">
        🐣 Beginner Friendly (${beginnerFriendly.length})
      </button>
      <button class="dash-nav-btn" onclick="switchDashTab(event, 'dash-highprize')">
        🏆 High Prize Pool (${highPrize.length})
      </button>
      <button class="dash-nav-btn" onclick="switchDashTab(event, 'dash-saved')">
        ❤️ Saved Hackathons (${savedHacks.length})
      </button>
    </div>

    <!-- Tab Panels -->
    <div id="dash-recommended" class="dash-panel active">
      <div class="hackathons-grid">
        ${topRecommendations.map(item => renderHackathonCard(item.hackathon, item.reason)).join('')}
      </div>
    </div>

    <div id="dash-closing" class="dash-panel" style="display: none;">
      <div class="hackathons-grid">
        ${closingSoon.map(h => renderHackathonCard(h)).join('')}
      </div>
    </div>

    <div id="dash-near" class="dash-panel" style="display: none;">
      <div class="hackathons-grid">
        ${nearStudent.length > 0 ? nearStudent.map(h => renderHackathonCard(h)).join('') : `
          <div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-dim);">
            No offline hackathons currently listed in ${currentUserProfile.city}. Check the map view for nearby regional hubs!
          </div>
        `}
      </div>
    </div>

    <div id="dash-beginner" class="dash-panel" style="display: none;">
      <div class="hackathons-grid">
        ${beginnerFriendly.map(h => renderHackathonCard(h)).join('')}
      </div>
    </div>

    <div id="dash-highprize" class="dash-panel" style="display: none;">
      <div class="hackathons-grid">
        ${highPrize.map(h => renderHackathonCard(h)).join('')}
      </div>
    </div>

    <div id="dash-saved" class="dash-panel" style="display: none;">
      <div class="hackathons-grid">
        ${savedHacks.length > 0 ? savedHacks.map(h => renderHackathonCard(h)).join('') : `
          <div style="grid-column: 1/-1; padding: 3rem; text-align: center; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
            <h3>No Saved Hackathons Yet</h3>
            <p style="margin-top: 0.5rem;">Click the ❤️ button on any hackathon card to save it for quick access!</p>
            <button class="btn btn-cyan btn-sm" onclick="navigateToView('discover')" style="margin-top: 1rem;">
              Browse Hackathons
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function switchDashTab(e, tabId) {
  document.querySelectorAll(".dash-nav-btn").forEach(btn => btn.classList.remove("active"));
  e.currentTarget.classList.add("active");

  document.querySelectorAll(".dash-panel").forEach(p => p.style.display = "none");
  const target = document.getElementById(tabId);
  if (target) target.style.display = "block";
}

function openEditProfileModal() {
  // Auth gate: editing profile preferences requires a signed-in account
  if (typeof authIsLoggedIn === "function" && !authIsLoggedIn()) {
    showToast("Sign in to save your profile preferences.", "warning");
    if (typeof openAuthModal === "function") openAuthModal("login");
    return;
  }

  const modal = document.getElementById("profileEditModal");
  if (!modal) return;

  document.getElementById("editProfileName").value = currentUserProfile.name;
  document.getElementById("editProfileCollege").value = currentUserProfile.college;
  document.getElementById("editProfileCourse").value = currentUserProfile.course;
  document.getElementById("editProfileBranch").value = currentUserProfile.branch;
  document.getElementById("editProfileYear").value = currentUserProfile.year;
  document.getElementById("editProfileCity").value = currentUserProfile.city;
  document.getElementById("editProfileState").value = currentUserProfile.state;
  document.getElementById("editProfileSkills").value = currentUserProfile.skills.join(", ");
  document.getElementById("editProfileInterests").value = currentUserProfile.interests.join(", ");
  document.getElementById("editProfileMode").value = currentUserProfile.preferredMode;
  document.getElementById("editProfileExp").value = currentUserProfile.experienceLevel;

  modal.classList.add("active");
}

function saveEditedProfile(e) {
  e.preventDefault();
  currentUserProfile.name = document.getElementById("editProfileName").value.trim() || currentUserProfile.name;
  currentUserProfile.college = document.getElementById("editProfileCollege").value.trim();
  currentUserProfile.course = document.getElementById("editProfileCourse").value.trim();
  currentUserProfile.branch = document.getElementById("editProfileBranch").value.trim();
  currentUserProfile.year = document.getElementById("editProfileYear").value;
  currentUserProfile.city = document.getElementById("editProfileCity").value.trim();
  currentUserProfile.state = document.getElementById("editProfileState").value;
  currentUserProfile.preferredMode = document.getElementById("editProfileMode").value;
  currentUserProfile.experienceLevel = document.getElementById("editProfileExp").value;

  const rawSkills = document.getElementById("editProfileSkills").value;
  currentUserProfile.skills = rawSkills.split(",").map(s => s.trim()).filter(Boolean);

  const rawInterests = document.getElementById("editProfileInterests").value;
  currentUserProfile.interests = rawInterests.split(",").map(i => i.trim()).filter(Boolean);

  saveUserProfile();
  closeModal("profileEditModal");
  updateNavProfile();
  renderDashboardView();
  showToast("Profile & recommendation preferences updated successfully! ⭐", "success");
}

function toggleSaveHackathon(hackathonId, event) {
  if (event) event.stopPropagation();

  if (!currentUserProfile.savedHackathons) {
    currentUserProfile.savedHackathons = [];
  }

  const idx = currentUserProfile.savedHackathons.indexOf(hackathonId);
  const hack = HACKATHONS_DATA.find(h => h.id === hackathonId);
  const title = hack ? hack.title : "Hackathon";

  if (idx > -1) {
    currentUserProfile.savedHackathons.splice(idx, 1);
    showToast(`Removed "${title}" from saved list`, "info");
  } else {
    currentUserProfile.savedHackathons.push(hackathonId);
    showToast(`Saved "${title}" to your bookmarks ❤️`, "success");
  }

  saveUserProfile();

  // Update button visual states everywhere
  document.querySelectorAll(`.card-save-btn[data-id="${hackathonId}"]`).forEach(btn => {
    btn.classList.toggle("saved", idx === -1);
  });

  // Re-render dashboard if currently on it
  if (document.getElementById("dashboardView")?.style.display === "block") {
    renderDashboardView();
  }
}
