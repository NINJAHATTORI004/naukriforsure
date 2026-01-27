// ========================================
// NAUKRIFORSURE - AUTHENTICATION MODULE
// Enhanced Google OAuth Integration
// Version 2.0 - With improved UX
// ========================================

const AUTH_CONFIG = {
    googleClientId: '337418366996-me3uaovtm3s07lf164d7fssd988rj42f.apps.googleusercontent.com',
    sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
    activityCheckInterval: 5 * 60 * 1000 // 5 minutes
};

// User state
let currentUser = null;
let activityTimer = null;
let lastActivityTime = Date.now();

// Track user activity
function trackUserActivity() {
    lastActivityTime = Date.now();
    localStorage.setItem('nfs_last_activity', lastActivityTime.toString());
}

// Initialize activity tracking
function initActivityTracking() {
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
        document.addEventListener(event, trackUserActivity, { passive: true });
    });
    
    // Check session validity periodically
    activityTimer = setInterval(checkSessionValidity, AUTH_CONFIG.activityCheckInterval);
}

// Check if session is still valid
function checkSessionValidity() {
    const savedUser = localStorage.getItem('nfs_user');
    if (!savedUser) return;
    
    const lastActivity = parseInt(localStorage.getItem('nfs_last_activity') || '0');
    const loginTime = parseInt(localStorage.getItem('nfs_login_time') || '0');
    const now = Date.now();
    
    // Check if session has expired
    if (now - loginTime > AUTH_CONFIG.sessionTimeout) {
        showSessionExpiredModal();
        logout(true); // Silent logout
    }
}

// Initialize Google Sign-In
function initGoogleAuth() {
    // Load the Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
        google.accounts.id.initialize({
            client_id: AUTH_CONFIG.googleClientId,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true
        });
        
        // Check if user is already logged in
        checkExistingSession();
        
        // Initialize activity tracking
        initActivityTracking();
    };
    document.head.appendChild(script);
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
    // Decode the JWT token
    const payload = decodeJwtPayload(response.credential);
    
    if (payload) {
        const user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: 'google',
            loginTime: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        
        // Save user session
        saveUserSession(user);
        currentUser = user;
        
        // Close any open modals
        closeLoginModal();
        
        // Trigger auth state change
        onAuthStateChanged(user);
        
        // Show success message with animation
        showAuthNotification(`Welcome back, ${user.name.split(' ')[0]}! 🎉`, 'success');
        
        // Track login event
        trackAuthEvent('login', user.email);
    }
}

// Decode JWT payload (Google's ID token)
function decodeJwtPayload(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Error decoding JWT:', e);
        return null;
    }
}

// Save user session to localStorage
function saveUserSession(user) {
    localStorage.setItem('nfs_user', JSON.stringify(user));
    localStorage.setItem('nfs_auth_token', user.id);
    localStorage.setItem('nfs_login_time', Date.now().toString());
    localStorage.setItem('nfs_last_activity', Date.now().toString());
    
    // Also save to referral system
    if (user.email) {
        localStorage.setItem('nfs_user_email', user.email);
    }
    
    // Save login count for stats
    const loginCount = parseInt(localStorage.getItem('nfs_login_count') || '0') + 1;
    localStorage.setItem('nfs_login_count', loginCount.toString());
}

// Track auth events for analytics
function trackAuthEvent(action, email) {
    const events = JSON.parse(localStorage.getItem('nfs_auth_events') || '[]');
    events.push({
        action,
        email: email ? email.substring(0, 3) + '***' : 'anonymous',
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 events
    if (events.length > 50) events.shift();
    localStorage.setItem('nfs_auth_events', JSON.stringify(events));
}

// Check for existing session
function checkExistingSession() {
    const savedUser = localStorage.getItem('nfs_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            onAuthStateChanged(currentUser);
        } catch (e) {
            console.error('Error parsing saved user:', e);
            logout();
        }
    } else {
        onAuthStateChanged(null);
    }
}

// Get current user
function getCurrentUser() {
    if (currentUser) return currentUser;
    
    const savedUser = localStorage.getItem('nfs_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            return currentUser;
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Logout function
function logout(silent = false) {
    // Clear session
    localStorage.removeItem('nfs_user');
    localStorage.removeItem('nfs_auth_token');
    localStorage.removeItem('nfs_login_time');
    currentUser = null;
    
    // Revoke Google session if available
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
    
    // Track logout event
    trackAuthEvent('logout', null);
    
    // Trigger auth state change
    onAuthStateChanged(null);
    
    if (!silent) {
        showAuthNotification('You have been logged out successfully', 'info');
    }
}

// Show logout confirmation modal
function showLogoutConfirmation() {
    let modal = document.getElementById('logoutConfirmModal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }
    
    modal = document.createElement('div');
    modal.id = 'logoutConfirmModal';
    modal.innerHTML = `
        <div class="logout-modal-overlay" onclick="closeLogoutModal()"></div>
        <div class="logout-modal-content">
            <div class="logout-modal-icon">
                <i class="fas fa-sign-out-alt"></i>
            </div>
            <h3>Sign Out?</h3>
            <p>Are you sure you want to sign out of your account?</p>
            <div class="logout-modal-buttons">
                <button class="logout-cancel-btn" onclick="closeLogoutModal()">Cancel</button>
                <button class="logout-confirm-btn" onclick="confirmLogout()">Sign Out</button>
            </div>
        </div>
    `;
    
    const styles = document.createElement('style');
    styles.textContent = `
        #logoutConfirmModal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .logout-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
        }
        .logout-modal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            padding: 35px;
            max-width: 360px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            animation: modalSlideIn 0.3s ease;
        }
        .logout-modal-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        .logout-modal-icon i {
            font-size: 1.8rem;
            color: white;
        }
        .logout-modal-content h3 {
            font-family: 'Cinzel', serif;
            color: #1e293b;
            margin-bottom: 10px;
            font-size: 1.4rem;
        }
        .logout-modal-content p {
            color: #64748b;
            margin-bottom: 25px;
        }
        .logout-modal-buttons {
            display: flex;
            gap: 12px;
        }
        .logout-cancel-btn, .logout-confirm-btn {
            flex: 1;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .logout-cancel-btn {
            background: #f1f5f9;
            border: none;
            color: #64748b;
        }
        .logout-cancel-btn:hover {
            background: #e2e8f0;
        }
        .logout-confirm-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: none;
            color: white;
        }
        .logout-confirm-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
    `;
    document.head.appendChild(styles);
    document.body.appendChild(modal);
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutConfirmModal');
    if (modal) modal.style.display = 'none';
}

function confirmLogout() {
    closeLogoutModal();
    logout();
}

// Show session expired modal
function showSessionExpiredModal() {
    showAuthNotification('Your session has expired. Please sign in again.', 'info');
}

// Auth state change handler - override this in pages
function onAuthStateChanged(user) {
    // Update UI elements
    updateAuthUI(user);
    
    // Dispatch custom event for pages to listen
    const event = new CustomEvent('authStateChanged', { detail: { user } });
    document.dispatchEvent(event);
}

// Update auth-related UI elements
function updateAuthUI(user) {
    const loginButtons = document.querySelectorAll('.auth-login-btn');
    const logoutButtons = document.querySelectorAll('.auth-logout-btn');
    const profileButtons = document.querySelectorAll('.auth-profile-btn');
    const userInfoElements = document.querySelectorAll('.auth-user-info');
    const userNameElements = document.querySelectorAll('.auth-user-name');
    const userAvatarElements = document.querySelectorAll('.auth-user-avatar');
    const guestElements = document.querySelectorAll('.auth-guest-only');
    const authElements = document.querySelectorAll('.auth-only');
    const navAuthContainer = document.querySelector('.nav-actions');
    
    if (user) {
        // User is logged in
        loginButtons.forEach(btn => btn.style.display = 'none');
        logoutButtons.forEach(btn => btn.style.display = '');
        profileButtons.forEach(btn => btn.style.display = '');
        guestElements.forEach(el => el.style.display = 'none');
        authElements.forEach(el => el.style.display = '');
        
        userNameElements.forEach(el => el.textContent = user.name);
        userAvatarElements.forEach(el => {
            if (user.picture) {
                el.innerHTML = `<img src="${user.picture}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                el.textContent = user.name.charAt(0).toUpperCase();
            }
        });
        
        userInfoElements.forEach(el => {
            el.innerHTML = `
                <img src="${user.picture || ''}" alt="" style="width: 32px; height: 32px; border-radius: 50%; ${!user.picture ? 'display: none;' : ''}">
                <span>${user.name}</span>
            `;
        });
        
        // Update navbar with user dropdown
        if (navAuthContainer && !document.querySelector('.user-dropdown')) {
            updateNavbarWithUserDropdown(navAuthContainer, user);
        }
    } else {
        // User is not logged in
        loginButtons.forEach(btn => btn.style.display = '');
        logoutButtons.forEach(btn => btn.style.display = 'none');
        profileButtons.forEach(btn => btn.style.display = 'none');
        guestElements.forEach(el => el.style.display = '');
        authElements.forEach(el => el.style.display = 'none');
        
        userNameElements.forEach(el => el.textContent = 'Guest');
        userAvatarElements.forEach(el => el.textContent = '?');
        userInfoElements.forEach(el => el.innerHTML = '');
        
        // Reset navbar
        if (navAuthContainer) {
            resetNavbar(navAuthContainer);
        }
    }
}

// Update navbar with user dropdown menu
function updateNavbarWithUserDropdown(container, user) {
    // Hide original login button
    const loginBtn = container.querySelector('a[href*="login"]');
    if (loginBtn) loginBtn.style.display = 'none';
    
    // Check if dropdown already exists
    if (container.querySelector('.user-dropdown')) return;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <button class="user-dropdown-trigger" onclick="toggleUserDropdown()">
            <div class="user-dropdown-avatar">
                ${user.picture 
                    ? `<img src="${user.picture}" alt="${user.name}">` 
                    : `<span>${user.name.charAt(0).toUpperCase()}</span>`
                }
            </div>
            <span class="user-dropdown-name">${user.name.split(' ')[0]}</span>
            <i class="fas fa-chevron-down"></i>
        </button>
        <div class="user-dropdown-menu" id="userDropdownMenu">
            <div class="dropdown-user-info">
                <div class="dropdown-avatar">
                    ${user.picture 
                        ? `<img src="${user.picture}" alt="${user.name}">` 
                        : `<span>${user.name.charAt(0).toUpperCase()}</span>`
                    }
                </div>
                <div class="dropdown-user-details">
                    <span class="dropdown-user-name">${user.name}</span>
                    <span class="dropdown-user-email">${user.email}</span>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="profile.html" class="dropdown-item">
                <i class="fas fa-user"></i> My Profile
            </a>
            <a href="referral-dashboard.html" class="dropdown-item">
                <i class="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="referral.html" class="dropdown-item">
                <i class="fas fa-gift"></i> Referrals
            </a>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item dropdown-logout" onclick="showLogoutConfirmation()">
                <i class="fas fa-sign-out-alt"></i> Sign Out
            </button>
        </div>
    `;
    
    container.insertBefore(dropdown, container.firstChild);
    
    // Add dropdown styles
    addDropdownStyles();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-dropdown')) {
            const menu = document.getElementById('userDropdownMenu');
            if (menu) menu.classList.remove('show');
        }
    });
}

function toggleUserDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) menu.classList.toggle('show');
}

function resetNavbar(container) {
    // Remove dropdown
    const dropdown = container.querySelector('.user-dropdown');
    if (dropdown) dropdown.remove();
    
    // Show login button
    const loginBtn = container.querySelector('a[href*="login"]');
    if (loginBtn) loginBtn.style.display = '';
}

function addDropdownStyles() {
    if (document.getElementById('user-dropdown-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'user-dropdown-styles';
    styles.textContent = `
        .user-dropdown {
            position: relative;
        }
        .user-dropdown-trigger {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 12px 6px 6px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(184,134,11,0.3);
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: inherit;
        }
        .user-dropdown-trigger:hover {
            background: rgba(255,255,255,0.15);
            border-color: #b8860b;
        }
        .user-dropdown-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #722f37, #b8860b);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
        }
        .user-dropdown-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .user-dropdown-name {
            font-weight: 600;
            font-size: 0.9rem;
        }
        .user-dropdown-trigger i {
            font-size: 0.7rem;
            transition: transform 0.3s ease;
        }
        .user-dropdown-menu {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            min-width: 260px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
            overflow: hidden;
        }
        .user-dropdown-menu.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .dropdown-user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: linear-gradient(135deg, #faf8f5, #f5f0e8);
        }
        .dropdown-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #722f37, #b8860b);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            font-weight: 600;
        }
        .dropdown-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .dropdown-user-details {
            display: flex;
            flex-direction: column;
        }
        .dropdown-user-name {
            font-weight: 600;
            color: #1e293b;
            font-size: 0.95rem;
        }
        .dropdown-user-email {
            font-size: 0.8rem;
            color: #64748b;
        }
        .dropdown-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 5px 0;
        }
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            color: #475569;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            border: none;
            background: none;
            width: 100%;
            cursor: pointer;
        }
        .dropdown-item:hover {
            background: #f8fafc;
            color: #722f37;
        }
        .dropdown-item i {
            width: 18px;
            text-align: center;
            color: #94a3b8;
        }
        .dropdown-item:hover i {
            color: #722f37;
        }
        .dropdown-logout {
            color: #ef4444;
        }
        .dropdown-logout:hover {
            background: #fef2f2;
            color: #dc2626;
        }
        .dropdown-logout i {
            color: #f87171;
        }
        @media (max-width: 768px) {
            .user-dropdown-name {
                display: none;
            }
            .user-dropdown-trigger {
                padding: 6px;
            }
            .user-dropdown-trigger i {
                display: none;
            }
        }
    `;
    document.head.appendChild(styles);
}

// Show Google Sign-In prompt
function showGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
                // Fallback: render button in modal
                showLoginModal();
            }
        });
    } else {
        showLoginModal();
    }
}

// Render Google Sign-In button
function renderGoogleButton(elementId) {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.renderButton(
            document.getElementById(elementId),
            { 
                theme: 'outline', 
                size: 'large',
                type: 'standard',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
                width: 280
            }
        );
    }
}

// Show login modal
function showLoginModal() {
    // Check if modal already exists
    let modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'flex';
        return;
    }
    
    // Create modal
    modal = document.createElement('div');
    modal.id = 'authModal';
    modal.innerHTML = `
        <div class="auth-modal-overlay" onclick="closeLoginModal()"></div>
        <div class="auth-modal-content">
            <button class="auth-modal-close" onclick="closeLoginModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="auth-modal-header">
                <h2>Welcome to NaukriForSure</h2>
                <p>Sign in to track your referrals and rewards</p>
            </div>
            <div class="auth-modal-body">
                <div id="googleSignInButton" style="display: flex; justify-content: center; margin-bottom: 20px;"></div>
                <div class="auth-divider">
                    <span>or</span>
                </div>
                <button class="auth-guest-btn" onclick="continueAsGuest()">
                    <i class="fas fa-user"></i> Continue as Guest
                </button>
            </div>
            <div class="auth-modal-footer">
                <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    const styles = document.createElement('style');
    styles.textContent = `
        #authModal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .auth-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
        }
        .auth-modal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 420px;
            width: 100%;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .auth-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 35px;
            height: 35px;
            border: none;
            background: #f1f5f9;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            color: #64748b;
            transition: all 0.3s ease;
        }
        .auth-modal-close:hover {
            background: #e2e8f0;
            color: #1e293b;
        }
        .auth-modal-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .auth-modal-header h2 {
            font-family: 'Cinzel', serif;
            color: #722f37;
            margin-bottom: 10px;
            font-size: 1.5rem;
        }
        .auth-modal-header p {
            color: #64748b;
            font-size: 0.95rem;
        }
        .auth-modal-body {
            margin-bottom: 20px;
        }
        .auth-divider {
            display: flex;
            align-items: center;
            margin: 20px 0;
        }
        .auth-divider::before,
        .auth-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #e2e8f0;
        }
        .auth-divider span {
            padding: 0 15px;
            color: #94a3b8;
            font-size: 0.85rem;
        }
        .auth-guest-btn {
            width: 100%;
            padding: 14px 20px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            font-size: 1rem;
            color: #475569;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        .auth-guest-btn:hover {
            border-color: #722f37;
            color: #722f37;
        }
        .auth-modal-footer {
            text-align: center;
        }
        .auth-modal-footer p {
            font-size: 0.75rem;
            color: #94a3b8;
        }
    `;
    document.head.appendChild(styles);
    document.body.appendChild(modal);
    
    // Render Google button
    setTimeout(() => {
        renderGoogleButton('googleSignInButton');
    }, 100);
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Continue as guest
function continueAsGuest() {
    closeLoginModal();
    showAuthNotification('Continuing as guest. Sign in anytime to save your progress!', 'info');
}

// Show auth notification
function showAuthNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.auth-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not present
    if (!document.querySelector('#auth-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'auth-notification-styles';
        styles.textContent = `
            .auth-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 500;
                z-index: 10001;
                animation: notificationSlideIn 0.3s ease;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            }
            @keyframes notificationSlideIn {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .auth-notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            .auth-notification-info {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
            }
            .auth-notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'notificationSlideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Initialize auth on DOM load
document.addEventListener('DOMContentLoaded', initGoogleAuth);

// Export functions for use in other scripts
window.NaukriAuth = {
    getCurrentUser,
    isLoggedIn,
    logout,
    showGoogleSignIn,
    showLoginModal,
    closeLoginModal,
    showLogoutConfirmation,
    toggleUserDropdown,
    trackAuthEvent,
    getLoginStats: () => ({
        loginCount: parseInt(localStorage.getItem('nfs_login_count') || '0'),
        lastLogin: localStorage.getItem('nfs_login_time'),
        lastActivity: localStorage.getItem('nfs_last_activity')
    })
};
