/**
 * HACKINDIA HUB - AUTH UI CONTROLLER
 * Handles auth modals, tab switching, form submission, and nav state.
 * Depends on: auth.js (authLogin, authRegister, authLogout, authIsLoggedIn,
 *   authGetCurrentUser, authUpdateAccount, authChangePassword, authDeleteAccount)
 * Depends on: dashboard.js (currentUserProfile, saveUserProfile, updateNavProfile,
 *   renderDashboardView, DEFAULT_USER_PROFILE)
 * All functions are globally scoped (no modules).
 */

// ---------------------------------------------------------------------------
// openAuthModal
// ---------------------------------------------------------------------------
function openAuthModal(tab) {
  tab = tab || 'login';
  var titleEl    = document.getElementById('authModalTitle');
  var subtitleEl = document.getElementById('authModalSubtitle');

  if (tab === 'login') {
    if (titleEl)    titleEl.textContent    = 'Welcome Back';
    if (subtitleEl) subtitleEl.textContent = 'Sign in to save hackathons, post listings, and build teams.';
  } else {
    if (titleEl)    titleEl.textContent    = 'Join HackIndia Hub';
    if (subtitleEl) subtitleEl.textContent = 'Create a free account to personalise recommendations and connect with builders.';
  }

  switchAuthTab(tab);

  // Clear all error divs
  ['authLoginError', 'authSignupError'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  var modal = document.getElementById('authModal');
  if (modal) modal.classList.add('active');
}

// ---------------------------------------------------------------------------
// switchAuthTab
// ---------------------------------------------------------------------------
function switchAuthTab(tab) {
  var loginBtn   = document.getElementById('authTabBtnLogin');
  var signupBtn  = document.getElementById('authTabBtnSignup');
  var loginPanel = document.getElementById('authTabLogin');
  var signupPanel = document.getElementById('authTabSignup');

  if (tab === 'login') {
    if (loginBtn)   { loginBtn.classList.add('active');    loginBtn.setAttribute('aria-selected', 'true'); }
    if (signupBtn)  { signupBtn.classList.remove('active'); signupBtn.setAttribute('aria-selected', 'false'); }
    if (loginPanel)  loginPanel.classList.add('active');
    if (signupPanel) signupPanel.classList.remove('active');
  } else {
    if (signupBtn)  { signupBtn.classList.add('active');   signupBtn.setAttribute('aria-selected', 'true'); }
    if (loginBtn)   { loginBtn.classList.remove('active');  loginBtn.setAttribute('aria-selected', 'false'); }
    if (signupPanel) signupPanel.classList.add('active');
    if (loginPanel)  loginPanel.classList.remove('active');
  }
}

// ---------------------------------------------------------------------------
// updatePasswordStrength
// ---------------------------------------------------------------------------
function updatePasswordStrength(value) {
  var fill  = document.getElementById('authPwStrengthFill');
  var label = document.getElementById('authPwStrengthLabel');
  if (!fill || !label) return;

  fill.className = 'auth-pw-strength-fill';

  if (!value || value.length === 0) {
    fill.style.width = '0';
    label.textContent = '';
    return;
  }

  var hasDigit = /\d/.test(value);
  var hasUpper = /[A-Z]/.test(value);
  var isLong   = value.length >= 8;

  if (!isLong) {
    fill.classList.add('weak');
    label.textContent = 'Weak — use at least 8 characters';
  } else if (!hasDigit || !hasUpper) {
    fill.classList.add('medium');
    label.textContent = 'Medium — add a number and an uppercase letter';
  } else {
    fill.classList.add('strong');
    label.textContent = 'Strong password ✓';
  }
}

// ---------------------------------------------------------------------------
// handleLogin
// ---------------------------------------------------------------------------
function handleLogin(event) {
  event.preventDefault();

  var emailEl    = document.getElementById('authLoginEmail');
  var passwordEl = document.getElementById('authLoginPassword');
  var errorEl    = document.getElementById('authLoginError');
  var submitBtn  = document.getElementById('authLoginSubmitBtn');

  var email    = emailEl    ? emailEl.value.trim()    : '';
  var password = passwordEl ? passwordEl.value        : '';

  if (errorEl) errorEl.textContent = '';
  if (submitBtn) {
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Signing in…';
  }

  authLogin({ email: email, password: password }).then(function (result) {
    if (result.ok) {
      closeModal('authModal');
      syncAuthToProfile();
      updateAuthNavState();
      showToast('Welcome back! 👋', 'success');
    } else {
      if (errorEl) errorEl.textContent = result.error || 'Login failed. Please check your credentials.';
    }
  }).catch(function (err) {
    if (errorEl) errorEl.textContent = 'An unexpected error occurred. Please try again.';
    console.error('Login error:', err);
  }).finally(function () {
    if (submitBtn) {
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Sign In';
    }
  });
}

// ---------------------------------------------------------------------------
// handleSignup
// ---------------------------------------------------------------------------
function handleSignup(event) {
  event.preventDefault();

  var nameEl     = document.getElementById('authSignupName');
  var emailEl    = document.getElementById('authSignupEmail');
  var passwordEl = document.getElementById('authSignupPassword');
  var confirmEl  = document.getElementById('authSignupConfirm');
  var collegeEl  = document.getElementById('authSignupCollege');
  var cityEl     = document.getElementById('authSignupCity');
  var stateEl    = document.getElementById('authSignupState');
  var errorEl    = document.getElementById('authSignupError');
  var submitBtn  = document.getElementById('authSignupSubmitBtn');

  var name     = nameEl    ? nameEl.value.trim()    : '';
  var email    = emailEl   ? emailEl.value.trim()   : '';
  var password = passwordEl ? passwordEl.value      : '';
  var confirm  = confirmEl  ? confirmEl.value       : '';
  var college  = collegeEl  ? collegeEl.value.trim() : '';
  var city     = cityEl     ? cityEl.value.trim()   : '';
  var state    = stateEl    ? stateEl.value         : '';

  if (errorEl) errorEl.textContent = '';

  // Client-side validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length < 2 || name.length > 80) {
    if (errorEl) errorEl.textContent = 'Full name must be between 2 and 80 characters.';
    return;
  }
  if (!emailRegex.test(email)) {
    if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
    return;
  }
  if (password.length < 8 || !/\d/.test(password)) {
    if (errorEl) errorEl.textContent = 'Password must be at least 8 characters and include a number.';
    return;
  }
  if (password !== confirm) {
    if (errorEl) errorEl.textContent = 'Passwords do not match.';
    return;
  }
  if (!college) {
    if (errorEl) errorEl.textContent = 'Please enter your college or university name.';
    return;
  }
  if (!city) {
    if (errorEl) errorEl.textContent = 'Please enter your city.';
    return;
  }
  if (!state) {
    if (errorEl) errorEl.textContent = 'Please select your state.';
    return;
  }

  if (submitBtn) {
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Creating account…';
  }

  authRegister({
    name: name,
    email: email,
    password: password,
    college: college,
    city: city,
    state: state,
    course: 'B.Tech',
    branch: 'Computer Science',
    year: '1st Year',
    preferredMode: 'Hybrid',
    experienceLevel: 'Beginner'
  }).then(function (result) {
    if (result.ok) {
      closeModal('authModal');
      syncAuthToProfile();
      updateAuthNavState();
      showToast('Welcome to HackIndia Hub! 🚀', 'success');
    } else {
      if (errorEl) errorEl.textContent = result.error || 'Registration failed. Please try again.';
    }
  }).catch(function (err) {
    if (errorEl) errorEl.textContent = 'An unexpected error occurred. Please try again.';
    console.error('Signup error:', err);
  }).finally(function () {
    if (submitBtn) {
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Create Account 🚀';
    }
  });
}

// ---------------------------------------------------------------------------
// handleLogout
// ---------------------------------------------------------------------------
function handleLogout() {
  authLogout();

  // Clear the server-side session cookie so the auth gate at the server
  // level also sees the user as logged out.
  fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
    .catch(function () { /* server endpoint is best-effort — not fatal */ });

  if (typeof DEFAULT_USER_PROFILE !== 'undefined') {
    currentUserProfile = Object.assign({}, DEFAULT_USER_PROFILE);
  } else {
    currentUserProfile = { name: '', savedHackathons: [] };
  }

  localStorage.removeItem('hackindia_user_profile');
  updateAuthNavState();
  if (typeof updateNavProfile === 'function') updateNavProfile();
  showToast('You have been signed out.', 'info');

  // Redirect to login page after a short delay so the toast is visible
  setTimeout(function () {
    window.location.replace('login.html');
  }, 1000);
}

// ---------------------------------------------------------------------------
// openAccountModal
// ---------------------------------------------------------------------------
function openAccountModal() {
  var user = authGetCurrentUser();
  if (!user) {
    openAuthModal('login');
    return;
  }

  // Populate fields from auth user, falling back to currentUserProfile
  var profile = currentUserProfile || {};

  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  setVal('acctName',     user.name    || profile.name    || '');
  setVal('acctCollege',  user.college || profile.college || '');
  setVal('acctCourse',   user.course  || profile.course  || '');
  setVal('acctBranch',   user.branch  || profile.branch  || '');
  setVal('acctYear',     user.year    || profile.year    || '');
  setVal('acctCity',     user.city    || profile.city    || '');
  setVal('acctState',    user.state   || profile.state   || '');
  setVal('acctSkills',   (profile.skills   || []).join(', '));
  setVal('acctInterests',(profile.interests|| []).join(', '));
  setVal('acctMode',     user.preferredMode   || profile.preferredMode   || 'Hybrid');
  setVal('acctExp',      user.experienceLevel || profile.experienceLevel || 'Beginner');

  // Clear error divs
  ['accountProfileError', 'accountPasswordError', 'accountDeleteError'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  var modal = document.getElementById('accountModal');
  if (modal) modal.classList.add('active');
}

// ---------------------------------------------------------------------------
// handleUpdateAccount
// ---------------------------------------------------------------------------
function handleUpdateAccount(event) {
  event.preventDefault();

  function getVal(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  var updates = {
    name:            getVal('acctName'),
    college:         getVal('acctCollege'),
    course:          getVal('acctCourse'),
    branch:          getVal('acctBranch'),
    year:            getVal('acctYear'),
    city:            getVal('acctCity'),
    state:           getVal('acctState'),
    preferredMode:   getVal('acctMode'),
    experienceLevel: getVal('acctExp')
  };

  var errorEl   = document.getElementById('accountProfileError');
  var submitBtn = document.querySelector('#accountProfileForm button[type="submit"]');

  if (errorEl) errorEl.textContent = '';
  if (submitBtn) {
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Saving…';
  }

  Promise.resolve(authUpdateAccount(updates)).then(function (result) {
    if (result.ok) {
      // Merge into currentUserProfile
      if (currentUserProfile) {
        Object.assign(currentUserProfile, updates);
        // Parse comma-separated skills / interests
        var skillsEl = document.getElementById('acctSkills');
        var interestsEl = document.getElementById('acctInterests');
        if (skillsEl)    currentUserProfile.skills    = skillsEl.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (interestsEl) currentUserProfile.interests = interestsEl.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        if (typeof saveUserProfile === 'function') saveUserProfile();
      }
      showToast('Profile updated.', 'success');
      closeModal('accountModal');
      if (typeof updateNavProfile === 'function') updateNavProfile();
      var dashView = document.getElementById('dashboardView');
      if (dashView && dashView.style.display !== 'none' && typeof renderDashboardView === 'function') {
        renderDashboardView();
      }
    } else {
      if (errorEl) errorEl.textContent = result.error || 'Update failed. Please try again.';
    }
  }).catch(function (err) {
    if (errorEl) errorEl.textContent = 'An unexpected error occurred. Please try again.';
    console.error('Update account error:', err);
  }).finally(function () {
    if (submitBtn) {
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Save Profile';
    }
  });
}

// ---------------------------------------------------------------------------
// handleChangePassword
// ---------------------------------------------------------------------------
function handleChangePassword(event) {
  event.preventDefault();

  var currentPwEl = document.getElementById('acctCurrentPw');
  var newPwEl     = document.getElementById('acctNewPw');
  var confirmPwEl = document.getElementById('acctConfirmPw');
  var errorEl     = document.getElementById('accountPasswordError');
  var submitBtn   = document.querySelector('#accountPasswordForm button[type="submit"]');

  var currentPassword = currentPwEl ? currentPwEl.value : '';
  var newPassword     = newPwEl     ? newPwEl.value     : '';
  var confirmPassword = confirmPwEl ? confirmPwEl.value : '';

  if (errorEl) errorEl.textContent = '';

  if (newPassword.length < 8 || !/\d/.test(newPassword)) {
    if (errorEl) errorEl.textContent = 'New password must be at least 8 characters and include a number.';
    return;
  }
  if (newPassword !== confirmPassword) {
    if (errorEl) errorEl.textContent = 'New passwords do not match.';
    return;
  }

  if (submitBtn) {
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Updating…';
  }

  authChangePassword({ currentPassword: currentPassword, newPassword: newPassword }).then(function (result) {
    if (result.ok) {
      if (currentPwEl) currentPwEl.value = '';
      if (newPwEl)     newPwEl.value = '';
      if (confirmPwEl) confirmPwEl.value = '';
      showToast('Password updated successfully.', 'success');
    } else {
      if (errorEl) errorEl.textContent = result.error || 'Password change failed. Check your current password.';
    }
  }).catch(function (err) {
    if (errorEl) errorEl.textContent = 'An unexpected error occurred. Please try again.';
    console.error('Change password error:', err);
  }).finally(function () {
    if (submitBtn) {
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Update Password';
    }
  });
}

// ---------------------------------------------------------------------------
// handleDeleteAccount
// ---------------------------------------------------------------------------
function handleDeleteAccount(event) {
  event.preventDefault();

  var passwordEl = document.getElementById('acctDeletePw');
  var errorEl    = document.getElementById('accountDeleteError');
  var submitBtn  = document.querySelector('#accountDeleteForm button[type="submit"]');

  var password = passwordEl ? passwordEl.value : '';

  if (errorEl) errorEl.textContent = '';

  if (submitBtn) {
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.textContent = 'Deleting…';
  }

  authDeleteAccount({ password: password }).then(function (result) {
    if (result.ok) {
      closeModal('accountModal');
      handleLogout();
      showToast('Your account has been deleted.', 'info');
    } else {
      if (errorEl) errorEl.textContent = result.error || 'Deletion failed. Please check your password.';
    }
  }).catch(function (err) {
    if (errorEl) errorEl.textContent = 'An unexpected error occurred. Please try again.';
    console.error('Delete account error:', err);
  }).finally(function () {
    if (submitBtn) {
      submitBtn.removeAttribute('data-loading');
      submitBtn.textContent = 'Delete My Account';
    }
  });
}

// ---------------------------------------------------------------------------
// syncAuthToProfile
// ---------------------------------------------------------------------------
function syncAuthToProfile() {
  var user = authGetCurrentUser();
  if (!user) return;

  // Preserve savedHackathons from existing localStorage profile
  var savedProfile = null;
  try {
    var raw = localStorage.getItem('hackindia_user_profile');
    if (raw) savedProfile = JSON.parse(raw);
  } catch (e) { /* ignore */ }

  var savedHackathons = (savedProfile && savedProfile.savedHackathons) ? savedProfile.savedHackathons : [];

  // Merge auth user fields into currentUserProfile
  if (typeof currentUserProfile === 'undefined' || !currentUserProfile) {
    currentUserProfile = {};
  }

  currentUserProfile.name            = user.name            || currentUserProfile.name            || '';
  currentUserProfile.college         = user.college         || currentUserProfile.college         || '';
  currentUserProfile.course          = user.course          || currentUserProfile.course          || '';
  currentUserProfile.branch          = user.branch          || currentUserProfile.branch          || '';
  currentUserProfile.year            = user.year            || currentUserProfile.year            || '';
  currentUserProfile.city            = user.city            || currentUserProfile.city            || '';
  currentUserProfile.state           = user.state           || currentUserProfile.state           || '';
  currentUserProfile.preferredMode   = user.preferredMode   || currentUserProfile.preferredMode   || 'Hybrid';
  currentUserProfile.experienceLevel = user.experienceLevel || currentUserProfile.experienceLevel || 'Beginner';
  currentUserProfile.skills          = currentUserProfile.skills    || [];
  currentUserProfile.interests       = currentUserProfile.interests || [];
  currentUserProfile.savedHackathons = savedHackathons;

  if (typeof saveUserProfile === 'function') saveUserProfile();
  if (typeof updateNavProfile === 'function') updateNavProfile();
}

// ---------------------------------------------------------------------------
// updateAuthNavState
// ---------------------------------------------------------------------------
function updateAuthNavState() {
  var logoutBtn  = document.getElementById('btnNavLogout');
  var profilePill = document.getElementById('navProfilePill');
  var loggedIn   = authIsLoggedIn();

  if (logoutBtn) {
    logoutBtn.style.display = loggedIn ? 'block' : 'none';
  }

  if (profilePill) {
    if (loggedIn) {
      profilePill.setAttribute('title', 'My Account');
      profilePill.onclick = function () { openAccountModal(); };
    } else {
      profilePill.setAttribute('title', 'Sign In / Create Account');
      profilePill.onclick = function () { openAuthModal('login'); };
    }
  }
}

// ---------------------------------------------------------------------------
// initAuthUI  — call this FIRST in DOMContentLoaded
// ---------------------------------------------------------------------------
function initAuthUI() {
  if (authIsLoggedIn()) {
    syncAuthToProfile();
    updateAuthNavState();
  } else {
    updateAuthNavState();
  }
}
