// ========================================
// NAUKRIFORSURE - AUTHENTICATION MODULE
// Google OAuth Integration
// ========================================

const AUTH_CONFIG = {
    googleClientId: '337418366996-me3uaovtm3s07lf164d7fssd988rj42f.apps.googleusercontent.com'
};

// User state
let currentUser = null;

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
            loginTime: new Date().toISOString()
        };
        
        // Save user session
        saveUserSession(user);
        currentUser = user;
        
        // Trigger auth state change
        onAuthStateChanged(user);
        
        // Show success message
        showAuthNotification(`Welcome, ${user.name}!`, 'success');
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
    
    // Also save to referral system
    if (user.email) {
        localStorage.setItem('nfs_user_email', user.email);
    }
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
function logout() {
    // Clear session
    localStorage.removeItem('nfs_user');
    localStorage.removeItem('nfs_auth_token');
    currentUser = null;
    
    // Revoke Google session if available
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
    
    // Trigger auth state change
    onAuthStateChanged(null);
    
    showAuthNotification('You have been logged out', 'info');
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
    const userInfoElements = document.querySelectorAll('.auth-user-info');
    const userNameElements = document.querySelectorAll('.auth-user-name');
    const userAvatarElements = document.querySelectorAll('.auth-user-avatar');
    const guestElements = document.querySelectorAll('.auth-guest-only');
    const authElements = document.querySelectorAll('.auth-only');
    
    if (user) {
        // User is logged in
        loginButtons.forEach(btn => btn.style.display = 'none');
        logoutButtons.forEach(btn => btn.style.display = '');
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
    } else {
        // User is not logged in
        loginButtons.forEach(btn => btn.style.display = '');
        logoutButtons.forEach(btn => btn.style.display = 'none');
        guestElements.forEach(el => el.style.display = '');
        authElements.forEach(el => el.style.display = 'none');
        
        userNameElements.forEach(el => el.textContent = 'Guest');
        userAvatarElements.forEach(el => el.textContent = '?');
        userInfoElements.forEach(el => el.innerHTML = '');
    }
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
    closeLoginModal
};
