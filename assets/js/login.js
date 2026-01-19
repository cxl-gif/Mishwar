// Login functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if redirected from registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        Mishwar.showAlert('Votre compte a été créé avec succès ! Veuillez vous connecter', 'success');
    }

    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${Mishwar.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Email ou mot de passe incorrect');
            }

            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            Mishwar.showAlert('Connexion réussie !', 'success');
            setTimeout(() => {
                window.location.href = '../dashboard.html';
            }, 1000);
        } catch (error) {
            Mishwar.showAlert(error.message, 'danger');
        }
    });
});

