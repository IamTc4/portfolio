document.addEventListener('DOMContentLoaded', () => {
    const projectList = document.getElementById('project-list');
    const categoryFilter = document.getElementById('category-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchBar = document.getElementById('search-bar');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const previewContent = document.querySelector('.preview-content');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewTools = document.getElementById('preview-tools');
    const viewProjectBtn = document.getElementById('view-project-btn');
    const previewIframe = document.getElementById('preview-iframe');

    let projects = [];
    let categories = [];
    let types = [];

    // Fetch project data
    fetch('data/projects.json')
        .then(response => response.json())
        .then(data => {
            categories = data.categories;
            projects = categories.flatMap(category =>
                category.projects.map(project => ({ ...project, category: category.name }))
            );
            populateFilters();
            displayProjects(projects);
        });

    // Populate filters
    function populateFilters() {
        // Categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });

        // Types
        const projectTypes = [...new Set(projects.map(p => p.type).filter(Boolean))];
        projectTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }

    // Display projects
    function displayProjects(filteredProjects) {
        projectList.innerHTML = '';
        filteredProjects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.category}</p>
            `;
            projectItem.addEventListener('click', () => {
                showProjectPreview(project);
                // Highlight active project
                document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
                projectItem.classList.add('active');
            });
            projectList.appendChild(projectItem);
        });
    }

    // Show project preview
    function showProjectPreview(project) {
        previewPlaceholder.style.display = 'none';
        previewContent.style.display = 'flex';

        previewTitle.textContent = project.title;
        previewDescription.textContent = project.description;
        previewTools.textContent = project.tools.join(', ');

        // Generate a slug for the project page URL
        const projectSlug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        viewProjectBtn.href = `projects/${projectSlug}.html`;

        // Mock iframe content
        previewIframe.srcdoc = `<body style="background-color: #1a1a1a; color: white; display: flex; justify-content: center; align-items: center; height: 100%; font-size: 1.5rem; text-align: center;">Mockup for ${project.title}</body>`;
    }

    // Filter projects
    function filterProjects() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedType = typeFilter.value;

        const filteredProjects = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) || project.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || project.category === selectedCategory;
            const matchesType = !selectedType || project.type === selectedType;

            return matchesSearch && matchesCategory && matchesType;
        });

        displayProjects(filteredProjects);
    }

    searchBar.addEventListener('input', filterProjects);
    categoryFilter.addEventListener('change', filterProjects);
    typeFilter.addEventListener('change', filterProjects);
});
