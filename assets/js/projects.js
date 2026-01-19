// Projects functionality

document.addEventListener('DOMContentLoaded', async function() {
    if (!Mishwar.checkAuth()) {
        window.location.href = 'auth/login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user.userType === 'COMPANY') {
        document.getElementById('newProjectBtn').style.display = 'block';
    }

    loadProjects();
});

async function loadProjects() {
    try {
        const data = await Mishwar.apiRequest('/projects');
        const projects = data.projects || [];
        
        if (projects.length === 0) {
            document.getElementById('noProjects').classList.remove('d-none');
            return;
        }

        document.getElementById('noProjects').classList.add('d-none');
            document.getElementById('projectsList').innerHTML = projects.map(project => `
            <div class="col-md-6">
                <div class="card shadow-md h-100">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0 fw-bold">${project.title}</h5>
                            <span class="badge bg-${getStatusColor(project.status)}">${getStatusText(project.status)}</span>
                        </div>
                        <p class="card-text text-muted mb-4">${project.description.substring(0, 150)}...</p>
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            ${project.budget ? `<span class="text-primary fw-bold fs-5">${project.budget} MAD</span>` : '<span></span>'}
                            <a href="project-detail.html?id=${project.id}" class="btn btn-sm btn-primary">
                                Voir les détails <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        Mishwar.showAlert('Erreur lors du chargement des projets', 'danger');
    }
}

function getStatusColor(status) {
    const colors = {
        'PENDING': 'warning',
        'IN_PROGRESS': 'info',
        'REVIEW': 'primary',
        'COMPLETED': 'success',
        'CANCELLED': 'danger'
    };
    return colors[status] || 'secondary';
}

function getStatusText(status) {
    const texts = {
        'PENDING': 'En attente',
        'IN_PROGRESS': 'En cours',
        'REVIEW': 'En révision',
        'COMPLETED': 'Terminé',
        'CANCELLED': 'Annulé'
    };
    return texts[status] || status;
}

function showNewProjectForm() {
    // Redirect to new project page or show modal
    window.location.href = 'new-project.html';
}

