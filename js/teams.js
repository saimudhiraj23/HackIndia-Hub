/**
 * HACKINDIA HUB - TEAM FORMATION HUB ("Find Teammates")
 * Helps students connect, recruit complementary skills, and form winning hackathon squads.
 */

let allTeamPosts = [];

function loadTeamPosts() {
  const saved = localStorage.getItem("hackindia_team_posts");
  if (saved) {
    try {
      allTeamPosts = JSON.parse(saved);
    } catch (e) {
      allTeamPosts = [...INITIAL_TEAM_POSTS];
    }
  } else {
    allTeamPosts = [...INITIAL_TEAM_POSTS];
    saveTeamPosts();
  }
}

function saveTeamPosts() {
  localStorage.setItem("hackindia_team_posts", JSON.stringify(allTeamPosts));
}

function renderTeamsView() {
  const container = document.getElementById("teamsGridContainer");
  if (!container) return;

  const roleFilter = document.getElementById("teamFilterRole")?.value || "all";
  const expFilter = document.getElementById("teamFilterExp")?.value || "all";

  let filtered = allTeamPosts.filter(post => {
    if (roleFilter !== "all" && !post.lookingForRole.toLowerCase().includes(roleFilter.toLowerCase())) {
      return false;
    }
    if (expFilter !== "all" && post.experienceLevel.toLowerCase() !== expFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 4rem 2rem; text-align: center; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px dashed var(--border-subtle);">
        <h3 style="color: #fff; font-size: 1.3rem;">No Teammate Posts Found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem; max-width: 500px; margin-inline: auto;">
          Be the first to post a team opening for this category! It only takes 30 seconds to connect with builders across India.
        </p>
        <button class="btn btn-primary" onclick="openPostTeamModal()" style="margin-top: 1.5rem;">
          ➕ Create Teammate Request
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <div class="team-card">
      <div class="team-target-hackathon">🎯 ${post.hackathonTitle}</div>
      <h3 class="team-looking-title">Looking for: <span style="color: var(--cyan);">${post.lookingForRole}</span></h3>

      <div class="team-creator-row">
        <div class="team-creator-avatar">${post.creatorAvatar || "IN"}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.88rem; color: #fff;">${post.creatorName}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${post.creatorCollege}</div>
        </div>
      </div>

      <p style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
        ${post.description}
      </p>

      <div style="font-size: 0.76rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 0.45rem;">
        Skills Needed:
      </div>
      <div class="team-skills-needed">
        ${(post.skillsNeeded || []).map(s => `<span class="team-skill-chip">${s}</span>`).join('')}
      </div>

      <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.85rem;">
        📍 <strong>Location:</strong> ${post.location} • ⚡ <strong>Level:</strong> ${post.experienceLevel}
      </div>

      <div class="team-card-footer">
        <span class="team-capacity-pill">
          👥 <strong>${post.currentMembers} / ${post.maxMembers}</strong> Members Joined
        </span>
        <button class="btn btn-cyan btn-sm" onclick="openJoinTeamModal('${post.id}')">
          🚀 Connect / Join
        </button>
      </div>
    </div>
  `).join('');
}

function openPostTeamModal() {
  // Auth gate: posting a teammate request requires a signed-in account
  if (typeof authIsLoggedIn === "function" && !authIsLoggedIn()) {
    if (typeof openAuthModal === "function") openAuthModal("login");
    showToast("Sign in to post a teammate request.", "warning");
    return;
  }

  const modal = document.getElementById("postTeamModal");
  if (!modal) return;

  // Populate hackathon options
  const hackSelect = document.getElementById("postTeamHackathon");
  if (hackSelect) {
    hackSelect.innerHTML = HACKATHONS_DATA.map(h => `
      <option value="${h.title}">${h.title} (${h.city})</option>
    `).join('');
  }

  modal.classList.add("active");
}

function submitNewTeamPost(e) {
  e.preventDefault();

  // Belt-and-suspenders auth gate
  if (typeof authIsLoggedIn === "function" && !authIsLoggedIn()) {
    closeModal("postTeamModal");
    if (typeof openAuthModal === "function") openAuthModal("login");
    showToast("Sign in to post a teammate request.", "warning");
    return;
  }

  const hackathonTitle = document.getElementById("postTeamHackathon").value;
  const role = document.getElementById("postTeamRole").value.trim();
  const desc = document.getElementById("postTeamDesc").value.trim();
  const skills = document.getElementById("postTeamSkills").value.split(",").map(s => s.trim()).filter(Boolean);
  const maxMembers = parseInt(document.getElementById("postTeamMaxMembers").value, 10) || 4;
  const discord = document.getElementById("postTeamDiscord").value.trim();
  const expLevel = document.getElementById("postTeamExp").value;

  const newPost = {
    id: `team-post-${Date.now()}`,
    hackathonTitle: hackathonTitle,
    creatorName: currentUserProfile ? currentUserProfile.name : "Student Builder",
    creatorCollege: currentUserProfile ? `${currentUserProfile.college} • ${currentUserProfile.year}` : "Engineering Student",
    creatorAvatar: currentUserProfile ? currentUserProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "ST",
    lookingForRole: role,
    description: desc,
    skillsNeeded: skills.length > 0 ? skills : ["Problem Solving", "Web Dev"],
    location: currentUserProfile ? `${currentUserProfile.city}, ${currentUserProfile.state}` : "Online / India",
    experienceLevel: expLevel,
    currentMembers: 1,
    maxMembers: maxMembers,
    contactDiscord: discord || "community_chat",
    createdAt: new Date().toISOString().split("T")[0]
  };

  allTeamPosts.unshift(newPost);
  saveTeamPosts();
  closeModal("postTeamModal");
  renderTeamsView();
  showToast("Teammate recruitment post published live! 🚀", "success");
}

let activeJoiningPost = null;

function openJoinTeamModal(postId) {
  const post = allTeamPosts.find(p => p.id === postId);
  if (!post) return;

  activeJoiningPost = post;
  const modal = document.getElementById("joinTeamModal");
  if (!modal) return;

  document.getElementById("joinTeamTargetTitle").textContent = post.hackathonTitle;
  document.getElementById("joinTeamRoleSpan").textContent = post.lookingForRole;
  document.getElementById("joinTeamCreatorSpan").textContent = post.creatorName;
  document.getElementById("joinTeamDiscordContact").textContent = post.contactDiscord || "Available upon connect";

  // Pre-fill intro message
  const introMsg = document.getElementById("joinTeamIntroMsg");
  if (introMsg && currentUserProfile) {
    introMsg.value = `Hey ${post.creatorName}! I saw your post looking for a ${post.lookingForRole}. I'm a ${currentUserProfile.year} student from ${currentUserProfile.college} skilled in ${currentUserProfile.skills.slice(0, 3).join(", ")}. Would love to team up!`;
  }

  modal.classList.add("active");
}

function sendJoinTeamRequest(e) {
  e.preventDefault();

  // Auth gate: connecting with team creators requires a signed-in account
  if (typeof authIsLoggedIn === "function" && !authIsLoggedIn()) {
    closeModal("joinTeamModal");
    if (typeof openAuthModal === "function") openAuthModal("login");
    showToast("Sign in to connect with team creators.", "warning");
    return;
  }

  closeModal("joinTeamModal");
  showToast(`Team join request sent to ${activeJoiningPost ? activeJoiningPost.creatorName : "team creator"}! Check your notifications. 💬`, "success");
}
