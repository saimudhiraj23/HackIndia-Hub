/**
 * HACKINDIA HUB - INTERACTIVE INDIA MAP ENGINE
 * High-fidelity interactive SVG map of India with state density heatmaps,
 * pulsing tech hubs, tooltip previews, and instant state filters.
 */

const STATE_HACKATHON_STATS = {
  "Telangana": { count: 14, hub: "Hyderabad (T-Hub / HITEC City)", topHack: "AI Innovation Challenge 2026", color: "high" },
  "Karnataka": { count: 28, hub: "Bengaluru (Whitefield / Electronic City)", topHack: "ETHIndia Bengaluru 2026", color: "high" },
  "Maharashtra": { count: 32, hub: "Mumbai & Pune (Techfest / COEP)", topHack: "IIT Bombay Techfest Hack", color: "high" },
  "Delhi": { count: 19, hub: "New Delhi & NCR", topHack: "Smart India Hackathon (SIH) 2026", color: "high" },
  "Tamil Nadu": { count: 18, hub: "Chennai & Vellore (VIT / IIT Madras)", topHack: "VITHack 2026 Marathon", color: "med" },
  "Kerala": { count: 9, hub: "Kochi (Kerala Startup Mission / Cyberdome)", topHack: "CyberShield Kerala Conclave", color: "med" },
  "Andhra Pradesh": { count: 8, hub: "Visakhapatnam & Vijayawada (APIS)", topHack: "AP Citizen Tech Hackathon", color: "med" },
  "West Bengal": { count: 11, hub: "Kolkata (Salt Lake / Jadavpur)", topHack: "Bengal AI Vision Summit", color: "med" },
  "Uttar Pradesh": { count: 15, hub: "Noida, Lucknow & Kanpur (IITK)", topHack: "UP Open Innovation Sprint", color: "med" },
  "Gujarat": { count: 10, hub: "Gandhinagar & Ahmedabad (GIFT City)", topHack: "Gujarat FinTech Hackathon", color: "med" },
  "Rajasthan": { count: 7, hub: "Jaipur (MNIT & BITS Pilani)", topHack: "Desert Hack Jaipur 2026", color: "low" },
  "Madhya Pradesh": { count: 6, hub: "Indore (IIT Indore)", topHack: "Central India Tech Sprint", color: "low" },
  "Punjab": { count: 5, hub: "Chandigarh & Mohali", topHack: "Punjab Agri-Hack 2026", color: "low" },
  "Odisha": { count: 4, hub: "Bhubaneswar (Silicon Tech)", topHack: "Odisha Cyber Sprint", color: "low" }
};

let currentSelectedState = "Telangana";

function initIndiaMap() {
  const container = document.getElementById("indiaMapWrapper");
  if (!container) return;

  renderMapSvg(container);
  selectState(currentSelectedState);
}

function renderMapSvg(container) {
  // SVG with stylized geometric state boundaries for India
  container.innerHTML = `
    <div class="map-layout-grid">
      <div class="map-svg-container">
        <svg viewBox="0 0 650 750" class="interactive-india-svg" id="indiaSvg">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#00f2fe" stop-opacity="0"/>
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Northern States (J&K, Ladakh, HP, Punjab, Uttarakhand) -->
          <path id="state-JK" class="state-path" data-state="Jammu & Kashmir" d="M220,50 L270,30 L320,60 L330,120 L270,140 L210,120 Z" />
          <path id="state-HP" class="state-path" data-state="Himachal Pradesh" d="M270,140 L330,120 L350,170 L300,190 L260,160 Z" />
          <path id="state-PB" class="state-path has-many" data-state="Punjab" d="M210,140 L260,160 L250,210 L190,190 Z" />
          <path id="state-UK" class="state-path" data-state="Uttarakhand" d="M300,190 L350,170 L380,220 L330,230 Z" />
          <path id="state-HR" class="state-path has-many" data-state="Haryana" d="M240,200 L290,200 L285,250 L230,240 Z" />
          
          <!-- Delhi Capital Region -->
          <circle id="state-DL" class="state-pulse-node" data-state="Delhi" cx="280" cy="235" r="7" filter="url(#glow)"/>

          <!-- Rajasthan -->
          <path id="state-RJ" class="state-path has-many" data-state="Rajasthan" d="M130,210 L230,200 L250,280 L230,360 L140,320 L110,240 Z" />

          <!-- Uttar Pradesh -->
          <path id="state-UP" class="state-path has-many" data-state="Uttar Pradesh" d="M290,210 L390,230 L450,280 L400,340 L310,320 L270,260 Z" />

          <!-- Bihar & Jharkhand & West Bengal -->
          <path id="state-BR" class="state-path" data-state="Bihar" d="M450,280 L520,290 L510,350 L440,340 Z" />
          <path id="state-JH" class="state-path" data-state="Jharkhand" d="M440,345 L510,355 L490,410 L430,400 Z" />
          <path id="state-WB" class="state-path has-many" data-state="West Bengal" d="M515,300 L550,280 L560,400 L510,430 L495,360 Z" />

          <!-- North East Region -->
          <path id="state-NE" class="state-path" data-state="Assam & North East" d="M565,270 L640,260 L630,340 L570,330 Z" />

          <!-- Gujarat -->
          <path id="state-GJ" class="state-path has-many" data-state="Gujarat" d="M90,325 L160,330 L180,410 L110,430 L60,380 Z" />

          <!-- Madhya Pradesh -->
          <path id="state-MP" class="state-path has-many" data-state="Madhya Pradesh" d="M190,340 L330,325 L400,380 L350,460 L220,440 L180,380 Z" />

          <!-- Chhattisgarh & Odisha -->
          <path id="state-CG" class="state-path" data-state="Chhattisgarh" d="M360,385 L415,385 L390,490 L340,480 Z" />
          <path id="state-OD" class="state-path has-many" data-state="Odisha" d="M420,390 L490,415 L460,500 L395,475 Z" />

          <!-- Maharashtra -->
          <path id="state-MH" class="state-path has-many" data-state="Maharashtra" d="M120,440 L240,435 L330,465 L300,560 L180,565 L140,510 Z" />

          <!-- Telangana -->
          <path id="state-TS" class="state-path has-many" data-state="Telangana" d="M270,495 L345,490 L360,560 L290,580 L260,535 Z" />

          <!-- Andhra Pradesh -->
          <path id="state-AP" class="state-path has-many" data-state="Andhra Pradesh" d="M350,560 L440,510 L410,640 L310,650 L345,590 Z" />

          <!-- Karnataka -->
          <path id="state-KA" class="state-path has-many" data-state="Karnataka" d="M185,570 L280,565 L295,670 L210,690 L170,610 Z" />

          <!-- Goa -->
          <circle id="state-GA" class="state-pulse-node" data-state="Goa" cx="175" cy="595" r="4" />

          <!-- Kerala -->
          <path id="state-KL" class="state-path has-many" data-state="Kerala" d="M210,690 L250,685 L235,745 L200,725 Z" />

          <!-- Tamil Nadu -->
          <path id="state-TN" class="state-path has-many" data-state="Tamil Nadu" d="M255,670 L330,645 L300,740 L240,745 Z" />

          <!-- Tech Hub City Nodes (Glowing Pulsing Pins) -->
          <!-- Hyderabad -->
          <g class="city-pin" data-state="Telangana" transform="translate(305, 535)">
            <circle r="12" fill="url(#hubGlow)" />
            <circle r="4.5" fill="#ff6a00" stroke="#fff" stroke-width="1.5" />
            <text x="8" y="4" font-size="9" fill="#00f2fe" font-weight="700">Hyderabad</text>
          </g>

          <!-- Bengaluru -->
          <g class="city-pin" data-state="Karnataka" transform="translate(245, 640)">
            <circle r="12" fill="url(#hubGlow)" />
            <circle r="4.5" fill="#00f2fe" stroke="#fff" stroke-width="1.5" />
            <text x="8" y="4" font-size="9" fill="#00f2fe" font-weight="700">Bengaluru</text>
          </g>

          <!-- Mumbai / Pune -->
          <g class="city-pin" data-state="Maharashtra" transform="translate(150, 490)">
            <circle r="12" fill="url(#hubGlow)" />
            <circle r="4.5" fill="#a855f7" stroke="#fff" stroke-width="1.5" />
            <text x="-48" y="4" font-size="9" fill="#fff" font-weight="700">Mumbai</text>
          </g>
          <g class="city-pin" data-state="Maharashtra" transform="translate(180, 520)">
            <circle r="4.5" fill="#ff6a00" stroke="#fff" stroke-width="1.5" />
            <text x="8" y="4" font-size="9" fill="#fff" font-weight="700">Pune</text>
          </g>

          <!-- Delhi NCR -->
          <g class="city-pin" data-state="Delhi" transform="translate(280, 235)">
            <circle r="12" fill="url(#hubGlow)" />
            <circle r="5" fill="#ff3b30" stroke="#fff" stroke-width="1.5" />
            <text x="9" y="4" font-size="9" fill="#ff8c33" font-weight="700">Delhi-NCR</text>
          </g>

          <!-- Chennai -->
          <g class="city-pin" data-state="Tamil Nadu" transform="translate(295, 670)">
            <circle r="4" fill="#00f2fe" stroke="#fff" stroke-width="1" />
            <text x="7" y="3" font-size="8.5" fill="#94a3b8">Chennai</text>
          </g>

          <!-- Kochi -->
          <g class="city-pin" data-state="Kerala" transform="translate(215, 715)">
            <circle r="4" fill="#10b981" stroke="#fff" stroke-width="1" />
            <text x="-32" y="3" font-size="8.5" fill="#34d399">Kochi</text>
          </g>

          <!-- Kolkata -->
          <g class="city-pin" data-state="West Bengal" transform="translate(525, 365)">
            <circle r="4" fill="#f59e0b" stroke="#fff" stroke-width="1" />
            <text x="7" y="3" font-size="8.5" fill="#f59e0b">Kolkata</text>
          </g>
        </svg>
      </div>

      <!-- State Hackathon Info Sidebar -->
      <div class="map-sidebar-info" id="mapStateDetailPanel">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  // Attach interactive listeners to state paths and pins
  const paths = container.querySelectorAll(".state-path, .state-pulse-node, .city-pin");
  paths.forEach(el => {
    el.addEventListener("mouseenter", (e) => {
      const stateName = el.getAttribute("data-state");
      showMapTooltip(e, stateName);
    });

    el.addEventListener("mousemove", (e) => {
      moveMapTooltip(e);
    });

    el.addEventListener("mouseleave", () => {
      hideMapTooltip();
    });

    el.addEventListener("click", () => {
      const stateName = el.getAttribute("data-state");
      if (stateName) {
        selectState(stateName);
      }
    });
  });
}

function selectState(stateName) {
  currentSelectedState = stateName;

  // Update SVG active state classes
  document.querySelectorAll(".state-path, .state-pulse-node").forEach(el => {
    if (el.getAttribute("data-state") === stateName) {
      el.classList.add("state-active");
    } else {
      el.classList.remove("state-active");
    }
  });

  const stateData = STATE_HACKATHON_STATS[stateName] || {
    count: 3,
    hub: `${stateName} Innovation Hub`,
    topHack: "National Student Challenge 2026",
    color: "low"
  };

  // Find hackathons in this state from HACKATHONS_DATA
  const matchedHacks = HACKATHONS_DATA.filter(h => 
    h.state.toLowerCase() === stateName.toLowerCase() ||
    (stateName === "Delhi" && (h.state === "Delhi" || h.city.includes("Delhi")))
  );

  const panel = document.getElementById("mapStateDetailPanel");
  if (!panel) return;

  panel.innerHTML = `
    <div class="state-detail-card">
      <div class="selected-state-banner">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--cyan); font-weight: 700; letter-spacing: 0.05em;">📍 Selected Region</span>
          <h3 class="selected-state-name">${stateName}</h3>
        </div>
        <span class="selected-state-count-badge">${stateData.count} Hackathons</span>
      </div>

      <div style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        <div><strong>Key Tech Hubs:</strong> ${stateData.hub}</div>
        <div style="margin-top: 0.35rem;"><strong>Flagship Event:</strong> <span style="color: var(--saffron-light); font-weight: 600;">${stateData.topHack}</span></div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
        <button class="btn btn-cyan btn-sm" onclick="filterByStateAndSwitchList('${stateName}')" style="flex: 1;">
          🔍 View All in ${stateName}
        </button>
      </div>

      <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-dim); margin-bottom: 0.65rem;">
        Offline & Hybrid Hackathons in ${stateName}:
      </h4>

      <div class="state-hackathons-mini-list">
        ${matchedHacks.length > 0 ? matchedHacks.map(h => `
          <div class="mini-hack-card" onclick="openHackathonModal('${h.id}')">
            <div>
              <div style="font-weight: 700; font-size: 0.88rem; color: #fff;">${h.title}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
                📍 ${h.city} • 💰 ${h.prizePoolDisplay} • ${h.mode}
              </div>
            </div>
            <button class="btn btn-outline btn-sm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">
              View →
            </button>
          </div>
        `).join('') : `
          <div style="padding: 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.85rem; background: rgba(255,255,255,0.02); border-radius: 8px;">
            More offline hackathons for ${stateName} are currently under organizer verification.
          </div>
        `}
      </div>
    </div>
  `;
}

function filterByStateAndSwitchList(stateName) {
  // Set location filter
  const stateFilterSelect = document.getElementById("filterLocationState");
  if (stateFilterSelect) {
    stateFilterSelect.value = stateName;
  }

  // Switch view back to list
  switchViewMode("list");

  // Re-run filter engine
  applyFilters();

  // Smooth scroll to results
  document.getElementById("discoveryResultsSection")?.scrollIntoView({ behavior: "smooth" });

  showToast(`Showing hackathons happening in ${stateName}`, "info");
}

/* Tooltip Helpers */
let mapTooltipEl = null;

function showMapTooltip(e, stateName) {
  if (!mapTooltipEl) {
    mapTooltipEl = document.createElement("div");
    mapTooltipEl.className = "map-tooltip";
    document.body.appendChild(mapTooltipEl);
  }

  const stat = STATE_HACKATHON_STATS[stateName] || { count: "3+", hub: "Active Centers" };
  mapTooltipEl.innerHTML = `
    <div style="font-weight: 800; color: #00f2fe; margin-bottom: 2px;">📍 ${stateName}</div>
    <div style="color: #cbd5e1; font-size: 0.75rem;"><strong>${stat.count}</strong> Active & Upcoming Hackathons</div>
    <div style="color: #94a3b8; font-size: 0.72rem; margin-top: 2px;">${stat.hub}</div>
    <div style="color: #ff8c33; font-size: 0.7rem; margin-top: 3px;">Click to inspect details</div>
  `;
  mapTooltipEl.style.opacity = "1";
  moveMapTooltip(e);
}

function moveMapTooltip(e) {
  if (!mapTooltipEl) return;
  mapTooltipEl.style.left = `${e.clientX + 16}px`;
  mapTooltipEl.style.top = `${e.clientY + 16}px`;
}

function hideMapTooltip() {
  if (mapTooltipEl) {
    mapTooltipEl.style.opacity = "0";
  }
}
