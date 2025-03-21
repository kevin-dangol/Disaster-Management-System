//check if the user is logedin or not
async function checkSession() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const profileMenu = document.getElementById('profile-menu');
    const signupButton = document.getElementById('signup-button');
    const adminLink = document.getElementById('admin-link');
    const homeLink = document.querySelector('.home-link');

    if (!token) {
        
        if (loginLink) loginLink.style.display = 'inline-block';
        if (signupLink) signupLink.style.display = 'inline-block';
        if (profileMenu) profileMenu.style.display = 'none';
        if (signupButton) signupButton.style.display = 'inline-block';
        if (adminLink) adminLink.style.display = 'none';
        if (homeLink) homeLink.href = '/Disaster-Management-System/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/auth/check-session', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.logged_in) {
            
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            if (profileMenu) profileMenu.style.display = 'inline-block';
            if (signupButton) signupButton.style.display = 'none';
            if (adminLink) adminLink.style.display = result.is_admin ? 'block' : 'none';
            if (homeLink) homeLink.href = '/Disaster-Management-System/pages/home.html';

            
            if (adminLink && window.location.pathname.includes('admin.html')) {
                adminLink.classList.add('active');
            }
        } else {
            
            localStorage.removeItem('token');
            localStorage.removeItem('is_admin');
            if (loginLink) loginLink.style.display = 'inline-block';
            if (signupLink) signupLink.style.display = 'inline-block';
            if (profileMenu) profileMenu.style.display = 'none';
            if (signupButton) signupButton.style.display = 'inline-block';
            if (adminLink) adminLink.style.display = 'none';
            if (homeLink) homeLink.href = '/Disaster-Management-System/index.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        if (loginLink) loginLink.style.display = 'inline-block';
        if (signupLink) signupLink.style.display = 'inline-block';
        if (profileMenu) profileMenu.style.display = 'none';
        if (signupButton) signupButton.style.display = 'inline-block';
        if (adminLink) adminLink.style.display = 'none';
        if (homeLink) homeLink.href = '/Disaster-Management-System/index.html';
    }
}

//logout
async function logout() {
    try {
        const response = await fetch('http://localhost:3001/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('is_admin');
            window.location.href = '/Disaster-Management-System/index.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to log out. Please try again later.');
    }
}

//run the check on the page
document.addEventListener('DOMContentLoaded', checkSession);
