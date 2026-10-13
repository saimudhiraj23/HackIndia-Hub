/**
 * HACKINDIA HUB - ORGANIZER PORTAL & VERIFICATION WORKFLOW
 * Organizers submit events into a strict verification state pipeline:
 * Pending Verification -> Approved -> Published.
 */

let pendingSubmissions = [];

function loadPendingSubmissions() {
  const saved = localStorage.getItem("hackindia_pending_submissions");
  if (saved) {
    try {
      pendingSubmissions = JSON.parse(saved);
    } catch (e) {
      pendingSubmissions = getInitialPendingSubmissions();
    }
  } else {
    pendingSubmissions = getInitialPendingSubmissions();
    savePendingSubmissions();
  }
}

function savePendingSubmissions() {
  localStorage.setItem("hackindia_pending_submissions", JSON.stringify(pendingSubmissions));
}

function getInitialPendingSubmissions() {
  return [
    {
      id: "sub-101",
      title: "Telangana Cybersecurity Grand Challenge 2026",
      organizer: "Telangana Cyber Security Bureau (TGCSB)",
      organizerType: "Government Bureau",
      city: "Hyderabad",
      state: "Telangana",
      mode: "Offline",
      venueAddress: "Gachibowli Stadium IT Conclave, Hyderabad",
      startDate: "2026-11-25",
      endDate: "2026-11-27",
      registrationDeadline: "2026-11-10T23:59:59+05:30",
      prizePool: 700000,
      prizePoolDisplay: "₹7,00,000",
      teamSizeDisplay: "2–4 Members",
      eligibility: "Engineering & Cybersecurity Undergrads",
      difficulty: "Advanced",
      technologies: ["Cybersecurity", "Network Security", "AI/ML", "Digital Forensics"],
      registrationUrl: "https://tgcsb.telangana.gov.in/hackathon-2026",
      sourceUrl: "https://tgcsb.telangana.gov.in/announcements",
      verificationStatus: "pending",
      submittedAt: "2026-10-08",
      contactEmail: "convener@tgcsb.telangana.gov.in",
      rules: "Strict ethical disclosure protocol. Zero production malware testing.",
      shortDescription: "Official cyber defense hackathon organized by Telangana State Police to engineer automated financial fraud intervention bots."
    },
    {
      id: "sub-102",
      title: "SIH 2026 - Hardware Innovation Edition",
      organizer: "Ministry of Education & AICTE",
      organizerType: "Government of India",
      city: "New Delhi",
      state: "Delhi",
      mode: "Offline",
      venueAddress: "IIT Delhi & Various Nodal Centers",
      startDate: "2026-11-18",
      endDate: "2026-11-21",
      registrationDeadline: "2026-10-15T23:59:59+05:30",
      prizePool: 10000000,
      prizePoolDisplay: "₹1,00,00,000",
      teamSizeDisplay: "6 Members (Min 1 Female)",
      eligibility: "AICTE Approved Engineering Students",
      difficulty: "Intermediate",
      technologies: ["IoT", "Robotics", "Clean Energy", "Embedded C"],
      registrationUrl: "https://sih.gov.in",
      sourceUrl: "https://sih.gov.in/hardware",
      verificationStatus: "pending",
      submittedAt: "2026-10-09",
      contactEmail: "hackathon@aicte-india.org",
      rules: "College internal SPOC authorization letter required.",
      shortDescription: "Hardware edition of Smart India Hackathon solving clean energy, electric mobility, and drone defense bottlenecks."
    }
  ];
}

function handleOrganizerSubmit(e) {
  e.preventDefault();

  // Auth gate: only signed-in users may submit hackathon listings
  if (typeof authIsLoggedIn === "function" && !authIsLoggedIn()) {
    closeModal("postHackathonModal");
    if (typeof openAuthModal === "function") openAuthModal("login");
    showToast("Please sign in to post a hackathon listing.", "warning");
    return;
  }

  const title = document.getElementById("orgEventTitle").value.trim();
  const organizer = document.getElementById("orgOrganizerName").value.trim();
  const orgType = document.getElementById("orgType").value;
  const mode = document.getElementById("orgMode").value;
  const city = document.getElementById("orgCity").value.trim();
  const state = document.getElementById("orgState").value;
  const venue = document.getElementById("orgVenue").value.trim();
  const startDate = document.getElementById("orgStartDate").value;
  const endDate = document.getElementById("orgEndDate").value;
  const deadline = document.getElementById("orgDeadline").value;
  const prizeNum = parseInt(document.getElementById("orgPrizePool").value, 10) || 100000;
  const prizeDisplay = "₹" + prizeNum.toLocaleString("en-IN");
  const teamSize = document.getElementById("orgTeamSize").value.trim() || "2–4 Members";
  const eligibility = document.getElementById("orgEligibility").value.trim() || "Open to College Students";
  const difficulty = document.getElementById("orgDifficulty").value;
  const techRaw = document.getElementById("orgTechnologies").value;
  const technologies = techRaw.split(",").map(t => t.trim()).filter(Boolean);
  const regUrl = document.getElementById("orgRegUrl").value.trim();
  const sourceUrl = document.getElementById("orgSourceUrl").value.trim();
  const contactEmail = document.getElementById("orgContactEmail").value.trim();
  const desc = document.getElementById("orgDescription").value.trim();

  // Create submission object
  const newSubmission = {
    id: `sub-${Date.now()}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title,
    organizer,
    organizerType: orgType,
    mode,
    city: mode === "Online" ? "All India" : city,
    state: mode === "Online" ? "All India" : state,
    venueAddress: venue || "Virtual / Online",
    startDate,
    endDate,
    registrationDeadline: `${deadline}T23:59:59+05:30`,
    prizePool: prizeNum,
    prizePoolDisplay: prizeDisplay,
    teamSizeDisplay: teamSize,
    eligibility,
    difficulty,
    technologies: technologies.length > 0 ? technologies : ["Web Development", "AI/ML"],
    themes: [technologies[0] || "Innovation"],
    registrationUrl: regUrl,
    sourceUrl: sourceUrl,
    verificationStatus: "pending", // Pending Verification -> Approved -> Published
    submittedAt: new Date().toISOString().split("T")[0],
    submittedBy: (typeof authGetCurrentUser === "function" && authGetCurrentUser()?.email) || "anonymous",
    contactEmail,
    shortDescription: desc,
    fullDescription: desc,
    verified: false,
    participantCount: 120
  };

  pendingSubmissions.unshift(newSubmission);
  savePendingSubmissions();

  // Reset form
  document.getElementById("postHackathonForm")?.reset();

  // Show status feedback
  closeModal("postHackathonModal");
  showToast("Hackathon submitted! Currently marked as 'Pending Verification ⏳' to prevent fake events. Admins will review the official source.", "info");

  // If Admin panel is open, refresh it
  if (typeof renderAdminDashboard === "function") {
    renderAdminDashboard();
  }
}
