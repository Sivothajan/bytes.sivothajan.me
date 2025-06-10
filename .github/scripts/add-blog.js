const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

// Read the template file path from command line
const templatePath = process.argv[2];
if (!templatePath) {
    console.error('Please provide a template file path');
    console.error('Usage: node add-blog.js <template-file>');
    process.exit(1);
}

// Validate template file exists
if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found: ${templatePath}`);
    process.exit(1);
}

function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function getNextAvailableId(posts) {
    const usedIds = new Set(posts.map(post => post.id));
    let nextId = 1;
    while (usedIds.has(nextId)) {
        nextId++;
    }
    return nextId;
}

function normalizePath(filePath) {
    // Convert Windows path separators to forward slashes and resolve relative paths
    return path.resolve(filePath).replace(/\\/g, '/');
}

try {
    // Read the template file
    const template = fs.readFileSync(templatePath, 'utf8');
    const { data, content } = matter(template);

    // Check required fields with more descriptive errors
    const requiredFields = ['title', 'date', 'description', 'tags'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        console.error('Missing required frontmatter fields:');
        missingFields.forEach(field => console.error(`- ${field}`));
        console.error('\nTemplate frontmatter should look like:\n---\ntitle: "Your Title"\ndate: "2025-June-10"\ndescription: "Your description"\ntags: ["tag1", "tag2"]\n---');
        process.exit(1);
    }

    // Validate tags format
    if (!Array.isArray(data.tags)) {
        console.error('Tags must be an array in frontmatter, e.g.:\ntags: ["tag1", "tag2"]');
        process.exit(1);
    }

    // Handle mdUrl - generate for local files, validate for external
    let mdUrl = data.mdUrl;
    if (!mdUrl) {
        // Normalize the template path
        const normalizedPath = normalizePath(templatePath);
        
        // Check if file is in blogs directory
        if (!normalizedPath.includes('/blogs/')) {
            console.error('Error: File must be in a subdirectory of blogs/ or specify mdUrl in frontmatter');
            console.error('Valid directories: blogs/tech/, blogs/science/, blogs/maths/, blogs/music/, blogs/history/');
            process.exit(1);
        }

        // Get the path after 'blogs/'
        const relativePath = normalizedPath.split('/blogs/')[1];
        mdUrl = `https://raw.githubusercontent.com/Sivothajan/bytes.sivothajan.me/main/blogs/${relativePath}`;
        console.log('Generated mdUrl:', mdUrl); // Debug log
    } else if (!mdUrl.startsWith('https://raw.githubusercontent.com/Sivothajan/')) {
        console.error('mdUrl must be a GitHub raw URL starting with https://raw.githubusercontent.com/Sivothajan/');
        process.exit(1);
    }

    // Read existing index.json
    let posts = [];
    if (fs.existsSync('index.json')) {
        posts = JSON.parse(fs.readFileSync('index.json', 'utf8'));
    } else {
        console.log('Creating new index.json file');
    }

    // Check if entry with same mdUrl exists
    const existingIndex = posts.findIndex(p => p.mdUrl === mdUrl);
    
    const post = {
        id: existingIndex >= 0 ? posts[existingIndex].id : getNextAvailableId(posts),
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags,
        mdUrl: mdUrl.replace('/refs/heads/main/', '/main/'),
        readTime: estimateReadTime(content)
    };

    if (existingIndex >= 0) {
        posts[existingIndex] = post; // Update existing
        console.log(`Updated existing entry: ${post.title}`);
    } else {
        posts.push(post); // Add new
        console.log(`Added new entry: ${post.title}`);
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
        const dateA = new Date(a.date.replace(/-/g, ' '));
        const dateB = new Date(b.date.replace(/-/g, ' '));
        return dateB - dateA;
    });

    // Write back to index.json
    fs.writeFileSync('index.json', JSON.stringify(posts, null, 4));

} catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ENOENT') {
        console.error('Make sure you are running the script from the repository root directory');
    }
    process.exit(1);
}
