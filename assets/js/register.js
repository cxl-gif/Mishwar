// Registration functionality

document.addEventListener('DOMContentLoaded', function() {
    // Handle user type change
    document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isCompany = this.value === 'COMPANY';
            document.getElementById('companyNameField').style.display = isCompany ? 'block' : 'none';
            document.getElementById('nameLabel').textContent = isCompany ? 'ou nom de l\'entreprise' : 'complet';
            if (!isCompany) {
                document.getElementById('companyName').value = '';
            }
        });
    });

    // Handle form submission
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            Mishwar.showAlert('Les mots de passe ne correspondent pas', 'danger');
            return;
        }

        if (password.length < 6) {
            Mishwar.showAlert('Le mot de passe doit contenir au moins 6 caractères', 'danger');
            return;
        }

        const userType = document.querySelector('input[name="userType"]:checked').value;
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: password,
            userType: userType,
            phone: document.getElementById('phone').value || null,
            location: document.getElementById('location').value || null,
        };

        if (userType === 'COMPANY') {
            formData.companyName = document.getElementById('companyName').value || formData.name;
        }

        try {
            const response = await fetch(`${Mishwar.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'حدث خطأ أثناء التسجيل');
            }

            Mishwar.showAlert('Compte créé avec succès ! Vous pouvez maintenant vous connecter', 'success');
            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 2000);
        } catch (error) {
            Mishwar.showAlert(error.message, 'danger');
        }
    });
});

