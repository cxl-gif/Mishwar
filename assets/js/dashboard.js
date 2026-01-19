// Dashboard functionality

document.addEventListener('DOMContentLoaded', async function() {
    if (!Mishwar.checkAuth()) {
        window.location.href = 'auth/login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userNameDisplay').textContent = user.name;

    // Show/hide actions based on user type
    if (user.userType === 'COMPANY') {
        document.getElementById('searchAction').style.display = 'block';
        document.getElementById('newProjectAction').style.display = 'block';
    } else {
        document.getElementById('portfolioAction').style.display = 'block';
        document.getElementById('portfolioCard').style.display = 'block';
        document.getElementById('reviewsCard').style.display = 'block';
    }

    // Load stats
    try {
        const stats = await Mishwar.apiRequest('/dashboard/stats');
        document.getElementById('projectsCount').textContent = stats.projects || 0;
        if (user.userType === 'FREELANCE') {
            document.getElementById('portfolioCount').textContent = stats.portfolio || 0;
            document.getElementById('reviewsCount').textContent = stats.reviews || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
});

