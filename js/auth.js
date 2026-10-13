/**
 * HACKINDIA HUB - AUTHENTICATION ENGINE
 * Pure vanilla JS, no imports, no modules. Loaded via <script src="js/auth.js">.
 *
 * localStorage keys:
 *   hackindia_auth_users   — Array of user records
 *   hackindia_auth_session — Session object or absent
 *
 * All crypto uses Web Crypto API (PBKDF2 / SHA-256).
 * Requires HTTPS or localhost — file:// disables crypto.subtle in Chrome.
 */

// ---------------------------------------------------------------------------
// Early guard: warn if Web Crypto API is unavailable
// ---------------------------------------------------------------------------
(function () {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    console.warn(
      'Web Crypto API unavailable. Auth functions will return errors. ' +
      'Serve the app from localhost or HTTPS (not file://).'
    );
  }
})();

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------
var AUTH_USERS_KEY   = 'hackindia_auth_users';
var AUTH_SESSION_KEY = 'hackindia_auth_session';

var PBKDF2_ITERATIONS = 200000;
var PBKDF2_KEY_LENGTH  = 32;   // bytes → 256-bit key
var SALT_LENGTH        = 16;   // bytes

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Convert an ArrayBuffer to a lowercase hex string.
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function hexEncode(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(function (b) { return b.toString(16).padStart(2, '0'); })
    .join('');
}

/**
 * Convert a lowercase hex string back to a Uint8Array.
 * @param {string} hex
 * @returns {Uint8Array}
 */
function hexDecode(hex) {
  var bytes = new Uint8Array(hex.length / 2);
  for (var i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Load the users array from localStorage (returns [] if absent or corrupt).
 * @returns {Array}
 */
function loadUsers() {
  try {
    var raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Persist the users array to localStorage.
 * @param {Array} users
 */
function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

// ---------------------------------------------------------------------------
// Public API — Email normalization
// ---------------------------------------------------------------------------

/**
 * Normalize an email address: trim whitespace and convert to lowercase.
 * @param {string} email
 * @returns {string}
 */
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// Public API — Password hashing (async, uses Web Crypto PBKDF2)
// ---------------------------------------------------------------------------

/**
 * Hash a plaintext password using PBKDF2 (SHA-256, 200 000 iterations, 32-byte key).
 * Generates a fresh 16-byte random salt each time.
 *
 * @param {string} password
 * @returns {Promise<{hash: string, salt: string}>}  Both values are lowercase hex strings.
 */
async function hashPassword(password) {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error(
      'Your browser does not support secure password hashing. ' +
      'Please use a modern browser on localhost or HTTPS.'
    );
  }

  var saltBytes = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(saltBytes);

  var enc      = new TextEncoder();
  var keyMat   = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  var derived  = await crypto.subtle.deriveBits(
    {
      name:       'PBKDF2',
      hash:       'SHA-256',
      salt:       saltBytes,
      iterations: PBKDF2_ITERATIONS
    },
    keyMat,
    PBKDF2_KEY_LENGTH * 8   // bits
  );

  return {
    hash: hexEncode(derived),
    salt: hexEncode(saltBytes.buffer)
  };
}

/**
 * Verify a plaintext password against a stored PBKDF2 hash + salt.
 *
 * @param {string} password       Plaintext candidate password.
 * @param {string} storedHash     Hex-encoded PBKDF2 output from hashPassword.
 * @param {string} storedSalt     Hex-encoded salt from hashPassword.
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, storedHash, storedSalt) {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error(
      'Your browser does not support secure password hashing. ' +
      'Please use a modern browser on localhost or HTTPS.'
    );
  }

  var saltBytes = hexDecode(storedSalt);
  var enc       = new TextEncoder();
  var keyMat    = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  var derived   = await crypto.subtle.deriveBits(
    {
      name:       'PBKDF2',
      hash:       'SHA-256',
      salt:       saltBytes,
      iterations: PBKDF2_ITERATIONS
    },
    keyMat,
    PBKDF2_KEY_LENGTH * 8
  );

  return hexEncode(derived) === storedHash;
}

// ---------------------------------------------------------------------------
// Public API — Session management (sync)
// ---------------------------------------------------------------------------

/**
 * Return the current session object, or null if no session exists.
 * @returns {{userId: string, email: string, name: string, createdAt: string}|null}
 */
function authGetSession() {
  try {
    var raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Return true if a valid session with a userId is active.
 * @returns {boolean}
 */
function authIsLoggedIn() {
  var session = authGetSession();
  return !!(session && session.userId);
}

/**
 * Return the full user record for the current session, or null.
 * @returns {object|null}
 */
function authGetCurrentUser() {
  var session = authGetSession();
  if (!session || !session.userId) return null;

  var users = loadUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === session.userId) return users[i];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API — Registration
// ---------------------------------------------------------------------------

/**
 * Register a new user account.
 *
 * @param {{name: string, email: string, password: string, college: string,
 *          course: string, branch: string, year: string,
 *          city: string, state: string}} params
 * @returns {Promise<{ok: boolean, user?: object, error?: string}>}
 */
async function authRegister(params) {
  try {
    var name     = (params.name     || '').trim();
    var email    = normalizeEmail(params.email    || '');
    var password = params.password  || '';
    var college  = (params.college  || '').trim();
    var course   = (params.course   || '').trim();
    var branch   = (params.branch   || '').trim();
    var year     = (params.year     || '').trim();
    var city     = (params.city     || '').trim();
    var state    = (params.state    || '').trim();

    // Duplicate check
    var users = loadUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        return {
          ok: false,
          error: 'An account with this email already exists. Please log in.'
        };
      }
    }

    // Hash password
    var hashed;
    try {
      hashed = await hashPassword(password);
    } catch (cryptoErr) {
      return {
        ok: false,
        error: 'Your browser does not support secure password hashing. Please use a modern browser on localhost or HTTPS.'
      };
    }

    var now = new Date().toISOString();
    var newUser = {
      id:           'user-' + Date.now(),
      email:        email,
      name:         name,
      passwordHash: hashed.hash,
      salt:         hashed.salt,
      college:      college,
      course:       course,
      branch:       branch,
      year:         year,
      city:         city,
      state:        state,
      skills:       [],
      interests:    [],
      preferredMode:    '',
      experienceLevel:  '',
      createdAt:    now
    };

    users.push(newUser);
    saveUsers(users);

    // Save session (omit sensitive fields)
    var session = {
      userId:    newUser.id,
      email:     newUser.email,
      name:      newUser.name,
      createdAt: now
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

    // Return user without credential fields
    var safeUser = Object.assign({}, newUser);
    delete safeUser.passwordHash;
    delete safeUser.salt;

    return { ok: true, user: safeUser };

  } catch (err) {
    return { ok: false, error: 'Registration failed. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// Public API — Login
// ---------------------------------------------------------------------------

/**
 * Authenticate with email + password.
 *
 * @param {{email: string, password: string}} params
 * @returns {Promise<{ok: boolean, user?: object, error?: string}>}
 */
async function authLogin(params) {
  try {
    var email    = normalizeEmail(params.email    || '');
    var password = params.password || '';

    var users = loadUsers();
    var found  = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        found = users[i];
        break;
      }
    }

    // Generic error — do not reveal whether email exists
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    var match;
    try {
      match = await verifyPassword(password, found.passwordHash, found.salt);
    } catch (cryptoErr) {
      return {
        ok: false,
        error: 'Your browser does not support secure password hashing. Please use a modern browser on localhost or HTTPS.'
      };
    }

    if (!match) {
      return { ok: false, error: 'Invalid email or password.' };
    }

    // Save session
    var session = {
      userId:    found.id,
      email:     found.email,
      name:      found.name,
      createdAt: found.createdAt
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

    var safeUser = Object.assign({}, found);
    delete safeUser.passwordHash;
    delete safeUser.salt;

    return { ok: true, user: safeUser };

  } catch (err) {
    return { ok: false, error: 'Login failed. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// Public API — Logout
// ---------------------------------------------------------------------------

/**
 * Clear the current session from localStorage.
 */
function authLogout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

// ---------------------------------------------------------------------------
// Public API — Account update
// ---------------------------------------------------------------------------

/**
 * Update editable profile fields for the currently-logged-in user.
 * email, passwordHash, salt, id, and createdAt are never changed here.
 *
 * @param {{name?: string, college?: string, course?: string, branch?: string,
 *          year?: string, city?: string, state?: string, skills?: string[],
 *          interests?: string[], preferredMode?: string,
 *          experienceLevel?: string}} params
 * @returns {{ok: boolean, error?: string}}
 */
function authUpdateAccount(params) {
  var session = authGetSession();
  if (!session || !session.userId) {
    return { ok: false, error: 'Not logged in.' };
  }

  var users   = loadUsers();
  var updated = false;

  var editableFields = [
    'name', 'college', 'course', 'branch', 'year',
    'city', 'state', 'skills', 'interests',
    'preferredMode', 'experienceLevel'
  ];

  for (var i = 0; i < users.length; i++) {
    if (users[i].id === session.userId) {
      for (var f = 0; f < editableFields.length; f++) {
        var field = editableFields[f];
        if (params[field] !== undefined) {
          users[i][field] = params[field];
        }
      }
      // Keep session name in sync if name was updated
      if (params.name !== undefined) {
        session.name = params.name;
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      }
      updated = true;
      break;
    }
  }

  if (!updated) {
    return { ok: false, error: 'User record not found.' };
  }

  saveUsers(users);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Public API — Password change
// ---------------------------------------------------------------------------

/**
 * Change the password for the currently-logged-in user.
 *
 * @param {{currentPassword: string, newPassword: string}} params
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function authChangePassword(params) {
  try {
    var session = authGetSession();
    if (!session || !session.userId) {
      return { ok: false, error: 'Not logged in.' };
    }

    var users = loadUsers();
    var userIdx = -1;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === session.userId) {
        userIdx = i;
        break;
      }
    }

    if (userIdx === -1) {
      return { ok: false, error: 'User record not found.' };
    }

    var user = users[userIdx];

    var match;
    try {
      match = await verifyPassword(
        params.currentPassword || '',
        user.passwordHash,
        user.salt
      );
    } catch (cryptoErr) {
      return {
        ok: false,
        error: 'Your browser does not support secure password hashing. Please use a modern browser on localhost or HTTPS.'
      };
    }

    if (!match) {
      return { ok: false, error: 'Current password is incorrect.' };
    }

    var hashed;
    try {
      hashed = await hashPassword(params.newPassword || '');
    } catch (cryptoErr) {
      return {
        ok: false,
        error: 'Your browser does not support secure password hashing. Please use a modern browser on localhost or HTTPS.'
      };
    }

    users[userIdx].passwordHash = hashed.hash;
    users[userIdx].salt         = hashed.salt;
    saveUsers(users);

    return { ok: true };

  } catch (err) {
    return { ok: false, error: 'Password change failed. Please try again.' };
  }
}

// ---------------------------------------------------------------------------
// Public API — Account deletion
// ---------------------------------------------------------------------------

/**
 * Permanently delete the current user's account after password verification.
 * Also removes the legacy hackindia_user_profile key.
 *
 * @param {{password: string}} params
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
async function authDeleteAccount(params) {
  try {
    var session = authGetSession();
    if (!session || !session.userId) {
      return { ok: false, error: 'Not logged in.' };
    }

    var users   = loadUsers();
    var userIdx = -1;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === session.userId) {
        userIdx = i;
        break;
      }
    }

    if (userIdx === -1) {
      return { ok: false, error: 'User record not found.' };
    }

    var user = users[userIdx];

    var match;
    try {
      match = await verifyPassword(
        params.password || '',
        user.passwordHash,
        user.salt
      );
    } catch (cryptoErr) {
      return {
        ok: false,
        error: 'Your browser does not support secure password hashing. Please use a modern browser on localhost or HTTPS.'
      };
    }

    if (!match) {
      return { ok: false, error: 'Password is incorrect.' };
    }

    // Remove user record
    users.splice(userIdx, 1);
    saveUsers(users);

    // Clear session and legacy profile key
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem('hackindia_user_profile');

    return { ok: true };

  } catch (err) {
    return { ok: false, error: 'Account deletion failed. Please try again.' };
  }
}
