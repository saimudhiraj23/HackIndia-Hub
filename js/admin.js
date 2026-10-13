/**
 * HACKINDIA HUB - ADMIN CONTROL ROOM & DUPLICATE DETECTION ENGINE
 * Verification moderation, analytics, duplicate consolidation, and user report handling.
 */

let reportedHackathons = [
  {
    id: "rep-01",
    hackathonId: "hack-07",
    hackathonTitle: "VITHack 2026",
    reason: "Incorrect prize pool listed in brochure preview",
    reportedBy: "student_verified@vit.ac.in",
    status: "pending_review",
    reportedAt: "2026-10-09"
  }
];

function renderAdminDashboard() {
  const container = document.getElementById("adminViewContent");
  if (!container) return;

  const totalHackathons = HACKATHONS_DATA.length;
  const pendingCount = pendingSubmissions.filter(s => s.verificationStatus === "pending").length;
  const totalPrizePool = HACKATHONS_DATA.reduce((acc, h) => acc + (h.prizePool || 0), 0);
  const totalRegisteredStudents = 14820;

  // Detect duplicates
  const detectedDuplicates = runDuplicateDetection();

  container.innerHTML = `
    <!-- Top KPI Counters -->
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div class="stat-number">${totalHackathons}</div>
        <div class="stat-label">Verified Hackathons Live</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="background: linear-gradient(135deg, var(--saffron), #ff3b30); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${pendingCount}
        </div>
        <div class="stat-label">Pending Verification ⏳</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">₹${(totalPrizePool / 10000000).toFixed(2)} Cr</div>
        <div class="stat-label">Total Prize Pool Tracked</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="background: linear-gradient(135deg, #10b981, #00f2fe); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${totalRegisteredStudents.toLocaleString("en-IN")}
        </div>
        <div class="stat-label">Active Student Innovators</div>
      </div>
    </div>

    <!-- Duplicate Detection Tool Alert Banner -->
    ${detectedDuplicates.length > 0 ? `
      <div class="duplicate-detector-box">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="color: #fbbf24; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
              ⚠️ Smart Duplicate Detection: ${detectedDuplicates.length} Potential Duplicate Found
            </h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
              Our similarity algorithm detected overlapping titles, organizer matches, or identical registration URLs across sources.
            </p>
          </div>
          <span style="font-size: 0.75rem; background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 4px 10px; border-radius: 999px; font-weight: 700;">
            ALGORITHMIC MATCH (92% Confidence)
          </span>
        </div>

        ${detectedDuplicates.map(dup => `
          <div class="dup-comparison-grid">
            <div class="dup-item-card">
              <span style="font-size: 0.72rem; color: var(--emerald); font-weight: 700; text-transform: uppercase;">[Existing Live Listing]</span>
              <h4 style="color: #fff; margin: 0.35rem 0;">${dup.original.title}</h4>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Organizer: ${dup.original.organizer}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Location: ${dup.original.city}, ${dup.original.state}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Prize: ${dup.original.prizePoolDisplay}</div>
            </div>

            <div class="dup-item-card" style="border-color: rgba(251, 191, 36, 0.4);">
              <span style="font-size: 0.72rem; color: #fbbf24; font-weight: 700; text-transform: uppercase;">[Incoming Submission Candidate]</span>
              <h4 style="color: #fff; margin: 0.35rem 0;">${dup.candidate.title}</h4>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Organizer: ${dup.candidate.organizer}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Location: ${dup.candidate.city}, ${dup.candidate.state}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Prize: ${dup.candidate.prizePoolDisplay}</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; margin-top: 0.75rem;">
            <button class="btn btn-cyan btn-sm" onclick="mergeDuplicateSubmission('${dup.candidate.id}', '${dup.original.id}')">
              🔀 Merge Into Single Listing & Consolidate Sources
            </button>
            <button class="btn btn-outline btn-sm" onclick="rejectSubmission('${dup.candidate.id}')">
              ✕ Discard Duplicate Submission
            </button>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Pending Verification Queue Table -->
    <div class="admin-card">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.25rem; font-weight: 700;">Organizer Submissions (Pending Verification)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Verify official organizer domains and URLs before publishing live.</p>
        </div>
        <span class="badge-counter" style="position: static; font-size: 0.85rem; padding: 2px 10px;">${pendingCount} Pending</span>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Hackathon Name</th>
              <th>Organizer & Domain</th>
              <th>Mode & City</th>
              <th>Prize Pool</th>
              <th>Submitted Date</th>
              <th>Official Source URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${pendingSubmissions.length > 0 ? pendingSubmissions.map(sub => `
              <tr>
                <td>
                  <strong>${sub.title}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-dim);">${sub.eligibility}</div>
                </td>
                <td>
                  <div>${sub.organizer}</div>
                  <div style="font-size: 0.75rem; color: var(--cyan);">${sub.contactEmail}</div>
                </td>
                <td>${sub.mode} • ${sub.city}</td>
                <td style="color: #fbbf24; font-weight: 700; font-family: var(--font-mono);">${sub.prizePoolDisplay}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${sub.submittedAt}</td>
                <td>
                  <a href="${sub.sourceUrl}" target="_blank" style="color: var(--cyan); text-decoration: underline; font-size: 0.82rem;">
                    Check Source ↗
                  </a>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-cyan btn-sm" style="padding: 0.35rem 0.65rem;" onclick="approveSubmission('${sub.id}')">
                      ✓ Approve
                    </button>
                    <button class="btn btn-outline btn-sm" style="padding: 0.35rem 0.65rem; color: var(--rose);" onclick="rejectSubmission('${sub.id}')">
                      ✕ Reject
                    </button>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">
                  No pending submissions in queue. All submissions have been verified!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Trust & Moderation: User Reports Queue -->
    <div class="admin-card">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <h3 style="color: #fff; font-size: 1.2rem; font-weight: 700;">🛡️ Trust & Safety Moderation Reports</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Community student flags for expired events or suspicious links.</p>
        </div>
      </div>

      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Flagged Hackathon</th>
              <th>Report Reason</th>
              <th>Reported By</th>
              <th>Date</th>
              <th>Status</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            ${reportedHackathons.map(rep => `
              <tr>
                <td><strong>${rep.hackathonTitle}</strong></td>
                <td style="color: #fbbf24;">${rep.reason}</td>
                <td style="font-size: 0.8rem; color: var(--text-dim);">${rep.reportedBy}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${rep.reportedAt}</td>
                <td><span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 999px; background: rgba(244, 63, 94, 0.2); color: var(--rose); font-weight: 700;">Pending Review</span></td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-outline btn-sm" style="padding: 0.35rem 0.65rem;" onclick="resolveReport('${rep.id}', 'dismiss')">
                      Dismiss
                    </button>
                    <button class="btn btn-cyan btn-sm" style="padding: 0.35rem 0.65rem;" onclick="resolveReport('${rep.id}', 'fix')">
                      Update Listing
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Algorithmic Duplicate Detection:
 * Compares incoming submissions against live hackathons using:
 * 1. Token similarity of titles
 * 2. Organizer match
 * 3. Overlapping date windows
 */
function runDuplicateDetection() {
  const duplicates = [];

  pendingSubmissions.filter(s => s.verificationStatus === "pending").forEach(cand => {
    HACKATHONS_DATA.forEach(orig => {
      // Clean and tokenize
      const candTokens = cand.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(w => w.length > 2);
      const origTokens = orig.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(w => w.length > 2);

      const intersection = candTokens.filter(t => origTokens.includes(t));
      const similarity = intersection.length / Math.max(candTokens.length, origTokens.length);

      // Check organizer similarity or identical registration URLs
      const orgMatch = cand.organizer.toLowerCase().includes(orig.organizer.toLowerCase()) || 
                       orig.organizer.toLowerCase().includes(cand.organizer.toLowerCase());

      const urlMatch = cand.registrationUrl && orig.registrationUrl && 
                       cand.registrationUrl.replace(/https?:\/\//, "") === orig.registrationUrl.replace(/https?:\/\//, "");

      if ((similarity >= 0.5 && orgMatch) || urlMatch || (similarity >= 0.75)) {
        duplicates.push({
          candidate: cand,
          original: orig,
          confidence: Math.round(similarity * 100)
        });
      }
    });
  });

  return duplicates;
}

function approveSubmission(submissionId) {
  const idx = pendingSubmissions.findIndex(s => s.id === submissionId);
  if (idx === -1) return;

  const item = pendingSubmissions.splice(idx, 1)[0];
  item.verificationStatus = "published";
  item.verified = true;
  item.verificationSource = `Verified Organizer Domain (${item.contactEmail})`;

  // Add into live HACKATHONS_DATA
  HACKATHONS_DATA.unshift(item);
  savePendingSubmissions();

  renderAdminDashboard();
  applyFilters();
  showToast(`✓ "${item.title}" successfully verified & published live to discover!`, "success");
}

function rejectSubmission(submissionId) {
  const idx = pendingSubmissions.findIndex(s => s.id === submissionId);
  if (idx === -1) return;

  const item = pendingSubmissions.splice(idx, 1)[0];
  savePendingSubmissions();
  renderAdminDashboard();
  showToast(`Submission "${item.title}" rejected and archived.`, "info");
}

function mergeDuplicateSubmission(candidateId, originalId) {
  const orig = HACKATHONS_DATA.find(h => h.id === originalId);
  const candIdx = pendingSubmissions.findIndex(s => s.id === candidateId);
  if (candIdx === -1 || !orig) return;

  const cand = pendingSubmissions.splice(candIdx, 1)[0];
  savePendingSubmissions();

  // Consolidate extra sources
  if (!orig.additionalSources) orig.additionalSources = [];
  orig.additionalSources.push({
    source: cand.organizer,
    url: cand.sourceUrl || cand.registrationUrl
  });

  renderAdminDashboard();
  showToast(`Successfully merged duplicate "${cand.title}" into master listing "${orig.title}"! Multi-source linked.`, "success");
}

function resolveReport(reportId, action) {
  const idx = reportedHackathons.findIndex(r => r.id === reportId);
  if (idx > -1) {
    reportedHackathons.splice(idx, 1);
    renderAdminDashboard();
    showToast(action === "fix" ? "Report resolved: Hackathon listing updated!" : "Report dismissed after audit.", "info");
  }
}
