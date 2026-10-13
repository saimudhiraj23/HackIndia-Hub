/**
 * HACKINDIA HUB - CALENDAR & WHATSAPP-FRIENDLY SHARING SYSTEM
 * Google Calendar, Outlook, .ics download, and WhatsApp link preview card simulator.
 */

let activeShareHackathon = null;

function openShareModal(hackathonId, event) {
  if (event) event.stopPropagation();

  const hack = HACKATHONS_DATA.find(h => h.id === hackathonId);
  if (!hack) return;

  activeShareHackathon = hack;
  const modal = document.getElementById("shareModal");
  if (!modal) return;

  // Populate preview elements
  const currentUrl = `${window.location.origin}/#hackathon=${hack.id}`;
  document.getElementById("shareModalTitle").textContent = `Share "${hack.title}"`;

  // WhatsApp formatted text
  const shareText = `🚀 Found an awesome hackathon on HackIndia Hub!

${hack.title}
💰 ${hack.prizePoolDisplay} Prize Pool
📍 ${hack.city}, ${hack.state} (${hack.mode})
🗓️ ${hack.startDate} to ${hack.endDate}
⏳ Registration Closes: ${hack.registrationDeadline ? new Date(hack.registrationDeadline).toLocaleDateString("en-IN") : "TBD"}

Register here: ${hack.registrationUrl || currentUrl}`;

  document.getElementById("shareMessagePreviewText").value = shareText;

  // Render WhatsApp Open Graph Preview Simulator Card
  const waCard = document.getElementById("waPreviewCardContainer");
  if (waCard) {
    waCard.innerHTML = `
      <div class="whatsapp-preview-card">
        <img src="${hack.bannerImg || 'assets/hero_banner.jpg'}" alt="${hack.title}" class="wa-preview-img" />
        <div class="wa-preview-body">
          <div class="wa-preview-domain">hackindiahub.in • HACKATHON DISCOVERY</div>
          <div class="wa-preview-title">${hack.title}</div>
          <div class="wa-preview-desc">
            💰 ${hack.prizePoolDisplay} Prize Pool • 📍 ${hack.city} • Organized by ${hack.organizer}. Verified official student competition.
          </div>
        </div>
      </div>
    `;
  }

  modal.classList.add("active");
}

function shareToWhatsApp() {
  if (!activeShareHackathon) return;
  const text = document.getElementById("shareMessagePreviewText").value;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");
  showToast("Opening WhatsApp... 💬", "success");
}

function shareToLinkedIn() {
  if (!activeShareHackathon) return;
  const url = encodeURIComponent(activeShareHackathon.registrationUrl || window.location.href);
  const title = encodeURIComponent(`Discovering ${activeShareHackathon.title} on HackIndia Hub`);
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`;
  window.open(liUrl, "_blank");
}

function shareToTwitter() {
  if (!activeShareHackathon) return;
  const text = encodeURIComponent(`Excited to build at ${activeShareHackathon.title}! 🚀 Prize pool: ${activeShareHackathon.prizePoolDisplay}. Check it out on @HackIndiaHub`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
}

function copyShareLink() {
  if (!activeShareHackathon) return;
  const currentUrl = `${window.location.origin}/#hackathon=${activeShareHackathon.id}`;
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast("Link copied to clipboard! 📋 Ready to paste on WhatsApp or Discord.", "success");
  }).catch(() => {
    // Fallback
    const input = document.createElement("input");
    input.value = currentUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showToast("Link copied to clipboard! 📋", "success");
  });
}

/**
 * Calendar Integrations: Google Calendar, Outlook, and Apple .ICS
 */
function openCalendarModal(hackathonId, event) {
  if (event) event.stopPropagation();

  const hack = HACKATHONS_DATA.find(h => h.id === hackathonId);
  if (!hack) return;

  activeShareHackathon = hack;
  const modal = document.getElementById("calendarModal");
  if (!modal) return;

  document.getElementById("calEventName").textContent = hack.title;
  document.getElementById("calEventDates").textContent = `${hack.startDate || "TBD"} to ${hack.endDate || "TBD"} (Deadline: ${hack.registrationDeadline ? new Date(hack.registrationDeadline).toLocaleDateString("en-IN") : "TBD"})`;
  document.getElementById("calEventLocation").textContent = `${hack.venueAddress || (hack.city ? hack.city + ', ' + hack.state : "Online")}`;

  modal.classList.add("active");
}

function addToGoogleCalendar() {
  if (!activeShareHackathon) return;
  const h = activeShareHackathon;

  // Format dates YYYYMMDDTHHMMSSZ
  const startStr = h.startDate.replace(/-/g, "") + "T090000Z";
  const endStr = h.endDate.replace(/-/g, "") + "T180000Z";

  const title = encodeURIComponent(`Hackathon: ${h.title}`);
  const details = encodeURIComponent(`${h.shortDescription}\n\nPrize Pool: ${h.prizePoolDisplay}\nOrganizer: ${h.organizer}\nRegister: ${h.registrationUrl}`);
  const location = encodeURIComponent(h.venueAddress || h.city);

  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  window.open(gCalUrl, "_blank");
  showToast("Opening Google Calendar... 📅", "success");
}

function addToOutlookCalendar() {
  if (!activeShareHackathon) return;
  const h = activeShareHackathon;
  const title = encodeURIComponent(`Hackathon: ${h.title}`);
  const details = encodeURIComponent(`${h.shortDescription}\n\nPrize Pool: ${h.prizePoolDisplay}\nRegister: ${h.registrationUrl}`);
  const location = encodeURIComponent(h.venueAddress || h.city);

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${location}&startdt=${h.startDate}T09:00:00&enddt=${h.endDate}T18:00:00`;
  window.open(outlookUrl, "_blank");
  showToast("Opening Outlook Calendar... 📅", "success");
}

function downloadIcsFile() {
  if (!activeShareHackathon) return;
  const h = activeShareHackathon;
  const startClean = h.startDate.replace(/-/g, "");
  const endClean = h.endDate.replace(/-/g, "");

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HackIndia Hub//Hackathon Calendar//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Hackathon: ${h.title}
DESCRIPTION:${h.shortDescription} | Prize: ${h.prizePoolDisplay} | Register: ${h.registrationUrl}
LOCATION:${h.venueAddress || h.city}
DTSTART;VALUE=DATE:${startClean}
DTEND;VALUE=DATE:${endClean}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${h.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Downloaded .ics file for Apple & native calendar! 📅", "success");
}
