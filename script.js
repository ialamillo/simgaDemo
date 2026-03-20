document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginView = document.getElementById('login-view');
    const homeView = document.getElementById('home-view');
    const logoutBtn = document.getElementById('logout-btn');

    // Expected credentials
    const VALID_USER = 'admin';
    const VALID_PASS = 'password123';

    // Session Persistence
    if (localStorage.getItem('sigma_session_active') === 'true') {
        loginView.classList.remove('active');
        loginView.style.display = 'none';
        loginView.style.opacity = '0';
        homeView.style.display = 'flex';
        homeView.classList.add('active');
        homeView.style.opacity = '1';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset error message
        errorMessage.style.display = 'none';

        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        if (user === VALID_USER && pass === VALID_PASS) {
            // Successful login animation sequence
            loginView.style.opacity = '0';
            loginView.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                loginView.classList.remove('active');
                loginView.style.display = 'none';
                
                homeView.style.display = 'flex';
                // Small delay to ensure display:flex is applied before animating opacity
                setTimeout(() => {
                    homeView.classList.add('active');
                }, 50);
                
                // Save session
                localStorage.setItem('sigma_session_active', 'true');
                
                // Clear form
                loginForm.reset();
            }, 500);

        } else {
            // Failed login
            errorMessage.style.display = 'block';
            
            // Shake effect
            loginForm.parentElement.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 400,
                easing: 'ease-in-out'
            });
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        // Clear session
        localStorage.removeItem('sigma_session_active');

        homeView.style.opacity = '0';
        homeView.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            homeView.classList.remove('active');
            homeView.style.display = 'none';
            
            loginView.style.display = 'flex';
            setTimeout(() => {
                loginView.classList.add('active');
                loginView.style.opacity = '1';
                loginView.style.transform = 'translateY(0)';
            }, 50);
        }, 500);
    });

    // Auto-open SimplyAsk Widget
    // The widget injects its own elements using a Shadow DOM, so we must traverse the document
    // to find the exact button (botón de chat) and simulate a click.
    function findInShadow(selector) {
        let element = null;
        document.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                const found = el.shadowRoot.querySelector(selector);
                if (found) element = found;
            }
        });
        return element || document.querySelector(selector);
    }

    let attempts = 0;
    const autoOpenWidget = setInterval(() => {
        attempts++;
        // Attempt to find the specific chat button injected by SimplyAsk
        const chatBtn = findInShadow('button[aria-label="botón de chat"]') || findInShadow('.MuiButtonBase-root[type="button"]');
        
        if (chatBtn && chatBtn.getAttribute('aria-expanded') !== 'true') {
            try {
                chatBtn.click();
            } catch (e) {}
        }
        
        // Hide the minimize/close button by injecting styles into the Shadow DOM
        const widgetContainer = document.querySelector('.simplyask-agent-widget');
        if (widgetContainer && widgetContainer.shadowRoot) {
            // Find the chat header or close buttons and hide them
            let styleEl = widgetContainer.shadowRoot.querySelector('#hide-close-btn-style');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'hide-close-btn-style';
                // Most widgets use an svg for close, or specific aria-labels. Hiding buttons in the header
                // or specific minimize buttons.
                styleEl.innerHTML = `
                    button[aria-label*="errar"], 
                    button[aria-label*="lose"], 
                    button[aria-label*="inimiz"] { 
                        display: none !important; 
                        pointer-events: none !important; 
                        opacity: 0 !important;
                    }
                `;
                widgetContainer.shadowRoot.appendChild(styleEl);
            }
        }
        
        if (attempts > 40) { // Limit to 20 seconds
            clearInterval(autoOpenWidget);
        }
    }, 500);
});
