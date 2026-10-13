/**
 * HACKINDIA HUB - HACKATHON ALERTS & NOTIFICATIONS SYSTEM
 * Deadline warnings, personalized interest matches, new hackathon discoveries,
 * and WhatsApp/email alert preference management.
 */

let notificationsList = [];

function loadNotifications() {
  const saved = localStorage.getItem("hackindia_notifications");
  if (saved) {
    try {
      notificationsList = JSON.parse(saved);
    } catch (e) {
      notificationsList = [...INITIAL_NOTIFICATIONS];
    }
  } else {
    notificationsList = [...INITIAL_NOTIFICATIONS];
    saveNotifications();
  }
  updateNotificationBadges();
}

function saveNotifications() {
  localStorage.setItem("hackindia_notifications", JSON.stringify(notificationsList));
}

function updateNotificationBadges() {
  const unreadCount = notificationsList.filter(n => !n.read).length;
  const badges = document.querySelectorAll(".notif-badge-count");
  badges.forEach(b => {
    b.textContent = unreadCount;
    b.style.display = unreadCount > 0 ? "flex" : "none";
  });
}

function toggleNotificationDrawer() {
  const drawer = document.getElementById("notificationDrawer");
  if (!drawer) return;
  drawer.classList.toggle("active");
  if (drawer.classList.contains("active")) {
    renderNotificationList();
  }
}

function renderNotificationList() {
  const container = document.getElementById("notificationItemsList");
  if (!container) return;

  if (notificationsList.length === 0) {
    container.innerHTML = `
      <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">
        No active notifications. You are all caught up! 🔔
      </div>
    `;
    return;
  }

  container.innerHTML = notificationsList.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" onclick="clickNotificationItem('${n.id}', '${n.hackathonId}')">
      <div class="notif-icon ${n.type}">
        ${n.type === 'hot' ? '🔥' : n.type === 'urgent' ? '⏰' : '⭐'}
      </div>
      <div style="flex: 1;">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.timestamp}</div>
      </div>
    </div>
  `).join('');
}

function clickNotificationItem(notifId, hackathonId) {
  const notif = notificationsList.find(n => n.id === notifId);
  if (notif) {
    notif.read = true;
    saveNotifications();
    updateNotificationBadges();
  }

  toggleNotificationDrawer();

  if (hackathonId) {
    openHackathonModal(hackathonId);
  }
}

function markAllNotificationsAsRead() {
  notificationsList.forEach(n => n.read = true);
  saveNotifications();
  updateNotificationBadges();
  renderNotificationList();
  showToast("All notifications marked as read ✓", "info");
}

function openAlertPreferencesModal() {
  const modal = document.getElementById("alertPreferencesModal");
  if (modal) {
    modal.classList.add("active");
  }
}

function saveAlertPreferences(e) {
  e.preventDefault();
  closeModal("alertPreferencesModal");
  showToast("Alert preferences saved! You'll receive instant WhatsApp & browser alerts for matching hackathons. 🔔", "success");
}
