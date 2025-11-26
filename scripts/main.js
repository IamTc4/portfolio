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

    // --- TEMPLATES ---
    const templates = {
        default: (project) => `
            <style>
                body { font-family: sans-serif; margin: 0; background-color: #f0f2f5; color: #333; }
                .header { background: #fff; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
                .main { padding: 2rem; text-align: center; }
                h1 { font-size: 1.8rem; }
                p { color: #666; }
            </style>
            <div class="header"><b>${project.title}</b></div>
            <div class="main">
                <h1>${project.title}</h1>
                <p>${project.description}</p>
            </div>
        `,
        'Website': (project) => `
            <style>
                body { font-family: sans-serif; margin: 0; background-color: #fff; }
                .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee; }
                .logo { font-weight: bold; }
                .nav a { margin: 0 0.5rem; text-decoration: none; color: #555; }
                .hero { text-align: center; padding: 4rem 2rem; background: #f9f9f9; }
                h1 { font-size: 2.5rem; }
            </style>
            <div class="header">
                <div class="logo">${project.title}</div>
                <div class="nav"><a href="#">Home</a><a href="#">About</a><a href="#">Contact</a></div>
            </div>
            <div class="hero">
                <h1>Welcome to ${project.title}</h1>
                <p>${project.description}</p>
            </div>
        `,
        'E-commerce': (project) => `
            <style>
                body { font-family: sans-serif; margin: 0; background-color: #f9f9f9; }
                .header { padding: 1rem; background: #fff; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .product { display: flex; padding: 2rem; }
                .product-image { flex: 1; text-align: center; }
                .product-details { flex: 1; padding: 0 1rem; }
                .product-image div { width: 80%; height: 200px; background: #eee; margin: auto; }
                button { background: #007bff; color: #fff; padding: 0.8rem 1.5rem; border: none; cursor: pointer; }
            </style>
            <div class="header"><b>${project.title}</b></div>
            <div class="product">
                <div class="product-image"><div></div></div>
                <div class="product-details">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
        `,
        'App': (project) => `
             <style>
                body { font-family: sans-serif; margin: 0; background-color: #e9ebee; display: flex; justify-content: center; align-items: center; height: 100vh; }
                .phone-bezel { background: #111; padding: 2rem 0.5rem; border-radius: 2rem; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
                .screen { background: #fff; width: 220px; height: 400px; text-align: center; padding: 1rem; }
                h2 { font-size: 1.2rem; }
            </style>
            <div class="phone-bezel">
                <div class="screen">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                </div>
            </div>
        `,
        'Dynamic / Backend': (project) => `
            <style>
                body { font-family: monospace; margin: 0; background-color: #2d2d2d; color: #f1f1f1; }
                .header { background: #1a1a1a; padding: 1rem; }
                .main { padding: 1.5rem; }
                .code-block { background: #1a1a1a; border: 1px solid #444; padding: 1rem; border-radius: 4px; }
            </style>
            <div class="header"><b>API: ${project.title}</b></div>
            <div class="main">
                <p>> Status: <span style="color: #28a745;">OK</span></p>
                <div class="code-block">
                    {
                      "project": "${project.title}",
                      "description": "${project.description}"
                    }
                </div>
            </div>
        `
    };

    // Show project preview
    function showProjectPreview(project) {
        previewPlaceholder.style.display = 'none';
        previewContent.style.display = 'flex';

        previewTitle.textContent = project.title;
        previewDescription.textContent = project.description;
        previewTools.textContent = project.tools.join(', ');

        const projectSlug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        viewProjectBtn.href = `projects/${projectSlug}.html`;

        const template = templates[project.type] || templates.default;
        previewIframe.srcdoc = template(project);
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
