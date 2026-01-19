// Resources functionality

document.addEventListener('DOMContentLoaded', function() {
    Mishwar.checkAuth();
    loadResources();

    // Handle filter change
    document.querySelectorAll('input[name="resourceType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            loadResources(this.value);
        });
    });
});

async function loadResources(type = 'all') {
    try {
        const params = type !== 'all' ? `?type=${type}` : '';
        const data = await Mishwar.apiRequest(`/resources${params}`);
        const resources = data.resources || [];

        if (resources.length === 0) {
            document.getElementById('noResources').classList.remove('d-none');
            document.getElementById('resourcesList').innerHTML = '';
            return;
        }

        document.getElementById('noResources').classList.add('d-none');
        document.getElementById('resourcesList').innerHTML = resources.map(resource => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge bg-primary">${resource.type}</span>
                            ${resource.category ? `<span class="badge bg-secondary me-2">${resource.category}</span>` : ''}
                        </div>
                        <h5 class="card-title">${resource.title}</h5>
                        <p class="card-text text-muted">${resource.description.substring(0, 100)}...</p>
                        <div class="d-flex justify-content-between align-items-center text-muted small">
                            <span><i class="bi bi-eye"></i> ${resource.views} vue(s)</span>
                            <span>${Mishwar.formatDate(resource.createdAt)}</span>
                        </div>
                        <a href="resource-detail.html?id=${resource.id}" class="btn btn-primary btn-sm mt-3 w-100">
                            Lire la suite
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading resources:', error);
    }
}

