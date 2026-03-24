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

});
