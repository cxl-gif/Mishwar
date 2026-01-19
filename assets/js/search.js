// Search functionality

let freelances = [];

// Load freelances on page load
document.addEventListener('DOMContentLoaded', function() {
    Mishwar.checkAuth();
    loadFreelances();
});

// Load all freelances
async function loadFreelances() {
    try {
        document.getElementById('loading').classList.remove('d-none');
        const data = await Mishwar.apiRequest('/freelances');
        freelances = data.freelances || [];
        displayResults(freelances);
    } catch (error) {
        Mishwar.showAlert('Erreur lors du chargement des talents', 'danger');
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

// Search freelances
async function searchFreelances() {
    const contentType = document.getElementById('contentType').value;
    const location = document.getElementById('location').value;
    const minRating = document.getElementById('minRating').value;
    const maxRate = document.getElementById('maxRate').value;
    const searchQuery = document.getElementById('searchQuery').value;

    try {
        document.getElementById('loading').classList.remove('d-none');
        
        const params = new URLSearchParams();
        if (contentType) params.append('contentType', contentType);
        if (location) params.append('location', location);
        if (minRating) params.append('minRating', minRating);
        if (maxRate) params.append('maxRate', maxRate);
        if (searchQuery) params.append('search', searchQuery);

        const data = await Mishwar.apiRequest(`/freelances/search?${params}`);
        freelances = data.freelances || [];
        displayResults(freelances);
    } catch (error) {
        Mishwar.showAlert('Erreur lors de la recherche', 'danger');
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

// Display results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    const noResults = document.getElementById('noResults');

    if (results.length === 0) {
        resultsDiv.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');
    resultsDiv.innerHTML = results.map(freelance => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm profile-card">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${freelance.user.avatar || 'https://via.placeholder.com/80'}" 
                             alt="${freelance.user.name}" 
                             class="profile-avatar me-3">
                        <div>
                            <h5 class="card-title mb-1">${freelance.user.name}</h5>
                            <p class="text-muted small mb-0">
                                <i class="bi bi-geo-alt"></i> ${freelance.user.location || 'Non spécifié'}
                            </p>
                        </div>
                    </div>
                    ${freelance.user.bio ? `<p class="card-text text-muted small">${freelance.user.bio.substring(0, 100)}...</p>` : ''}
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span class="rating">${'⭐'.repeat(Math.floor(freelance.rating))}</span>
                            <span class="ms-2">${freelance.rating.toFixed(1)}</span>
                            <small class="text-muted">(${freelance.totalReviews})</small>
                        </div>
                        ${freelance.hourlyRate ? `<span class="text-primary fw-bold">${freelance.hourlyRate} MAD/h</span>` : ''}
                    </div>
                    <div class="mb-3">
                        ${freelance.specialties.slice(0, 3).map(s => 
                            `<span class="badge bg-primary me-1">${s}</span>`
                        ).join('')}
                    </div>
                    <div class="d-flex justify-content-between text-muted small mb-3">
                        <span><i class="bi bi-folder"></i> ${freelance._count?.portfolio || 0} projet(s)</span>
                        <span><i class="bi bi-check-circle"></i> ${freelance._count?.projects || 0} terminé(s)</span>
                    </div>
                    <a href="freelance-profile.html?id=${freelance.id}" class="btn btn-primary w-100">
                        Voir le profil
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Search on Enter key
document.getElementById('searchQuery').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchFreelances();
    }
});

