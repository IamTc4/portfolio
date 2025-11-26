const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
const projectsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to generate placeholder data
const generateProjectDetails = (project) => {
    // Generate features based on project title
    const features = [
        `Feature A for ${project.title}`,
        `Feature B for ${project.title}`,
        `Feature C for ${project.title}`
    ];

    // Generate a simple timeline
    const timeline = [
        { phase: 'Phase 1', description: 'Project kickoff, research, and planning.' },
        { phase: 'Phase 2', description: 'Design mockups, development, and testing.' },
        { phase: 'Phase 3', description: 'Deployment, launch, and post-launch support.' }
    ];

    // Generate a "what we did" description
    const what_we_did = `For the ${project.title} project, we provided a comprehensive solution from start to finish. Our process included initial consultation, strategic planning, design and development, and final deployment. We ensured the final product met all the project's goals and exceeded expectations.`;

    // Generate a placeholder preview image
    const previewImage = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(project.title)}`;

    return { ...project, features, timeline, what_we_did, previewImage };
};

// Add details to each project
const expandedData = {
    ...projectsData,
    categories: projectsData.categories.map(category => ({
        ...category,
        projects: category.projects.map(generateProjectDetails)
    }))
};

// Write the updated data back to the file
fs.writeFileSync(dataPath, JSON.stringify(expandedData, null, 2), 'utf8');

console.log('Successfully expanded the project dataset.');
