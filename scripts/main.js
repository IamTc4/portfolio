
document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const projectPreview = document.getElementById('project-preview');
    const previewPlaceholder = projectPreview.querySelector('.preview-placeholder');
    const previewContent = projectPreview.querySelector('.preview-content');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewTools = document.getElementById('preview-tools');
    const viewProjectBtn = document.getElementById('view-project-btn');
    const previewIframe = document.getElementById('preview-iframe');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');

    let allProjects = [];

    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                category.projects.forEach(project => {
                    allProjects.push({ ...project, category: category.name });
                });
            });

            const categories = [...new Set(data.categories.map(cat => cat.name))];
            const types = [...new Set(allProjects.map(proj => proj.type).filter(t => t))];

            populateDropdown(categoryFilter, categories);
            populateDropdown(typeFilter, types);

            displayProjects(allProjects);

            searchBar.addEventListener('input', filterProjects);
            categoryFilter.addEventListener('change', filterProjects);
            typeFilter.addEventListener('change', filterProjects);
        });

    function populateDropdown(selectElement, options) {
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    function displayProjects(projects) {
        projectList.innerHTML = '';
        projects.forEach(project => {
            const projectLink = document.createElement('a');
            projectLink.href = '#';
            projectLink.classList.add('project-item');
            projectLink.textContent = project.title;
            projectLink.addEventListener('click', (e) => {
                e.preventDefault();
                showProjectPreview(project);
            });
            projectList.appendChild(projectLink);
        });
    }

    function filterProjects() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedType = typeFilter.value;

        const filteredProjects = allProjects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) || project.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || project.category === selectedCategory;
            const matchesType = !selectedType || project.type === selectedType;
            return matchesSearch && matchesCategory && matchesType;
        });

        displayProjects(filteredProjects);
    }

    function showProjectPreview(project) {
        const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const projectUrl = `projects/${slug}.html`;

        previewPlaceholder.style.display = 'none';
        previewContent.style.display = 'block';

        previewTitle.textContent = project.title;
        previewDescription.textContent = project.description;
        previewTools.textContent = project.tools.join(', ');
        viewProjectBtn.href = projectUrl;
        previewIframe.src = projectUrl;
    }
});
