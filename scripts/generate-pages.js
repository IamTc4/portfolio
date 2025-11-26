const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
const templatePath = path.join(__dirname, '..', 'project-template.html');
const outputDir = path.join(__dirname, '..', 'projects');

// Read the project data and template
const projectsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Generate a page for each project
projectsData.categories.forEach(category => {
    category.projects.forEach(project => {
        // Create a slug for the filename
        const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const outputPath = path.join(outputDir, `${slug}.html`);

        // Generate HTML for features
        const featuresHtml = project.features.map(feature => `<li>${feature}</li>`).join('');

        // Generate HTML for timeline
        const timelineHtml = project.timeline.map(item => `
            <div class="timeline-item">
                <h3>${item.phase}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');

        // Generate HTML for the preview image
        const previewHtml = `<img src="${project.previewImage}" alt="${project.title}">`;

        // Replace placeholders with project data
        let pageContent = template
            .replace(/{{PROJECT_TITLE}}/g, project.title)
            .replace(/{{PROJECT_DESCRIPTION}}/g, project.description)
            .replace(/{{PROJECT_TOOLS}}/g, project.tools.map(tool => `<li>${tool}</li>`).join(''))
            .replace(/{{PROJECT_FEATURES}}/g, featuresHtml)
            .replace(/{{PROJECT_PREVIEW}}/g, previewHtml)
            .replace(/{{PROJECT_TIMELINE}}/g, timelineHtml)
            .replace(/{{PROJECT_WHAT_WE_DID}}/g, project.what_we_did);

        // Write the generated page to a file
        fs.writeFileSync(outputPath, pageContent, 'utf8');
        console.log(`Generated page for ${project.title} at ${outputPath}`);
    });
});

console.log('All project pages have been generated successfully!');
