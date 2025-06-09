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
    // Convert Windows path separators to forward slashes
    return filePath.replace(/\\/g, '/');
}

try {
    // Read the template file
    const template = fs.readFileSync(templatePath, 'utf8');
    const { data, content } = matter(template);

    // Check required fields
    if (!data.title || !data.date || !data.description || !data.tags) {
        console.error('Template must include title, date, description, and tags in frontmatter');
        process.exit(1);
    }

    // Validate date format (YYYY-Month-DD)
    const dateRegex = /^\d{4}-(January|February|March|April|May|June|July|August|September|October|November|December)-\d{1,2}$/;
    if (!dateRegex.test(data.date)) {
        console.error('Date must be in format: YYYY-Month-DD (e.g., 2025-June-8)');
        process.exit(1);
    }

    // Handle mdUrl - generate for local files, validate for external
    let mdUrl = data.mdUrl;
    if (!mdUrl) {
        // Normalize the template path
        const normalizedPath = normalizePath(templatePath);
        
        // Check if file is in blogs directory
        if (normalizedPath.includes('/blogs/')) {
            // Get the path after 'blogs/'
            const relativePath = normalizedPath.split('/blogs/')[1];
            mdUrl = `https://raw.githubusercontent.com/Sivothajan/bytes.sivothajan.me/main/blogs/${relativePath}`;
            console.log('Generated mdUrl:', mdUrl); // Debug log
        } else {
            console.error('Files outside blogs/ directory must specify mdUrl in frontmatter');
            process.exit(1);
        }
    } else if (!mdUrl.startsWith('https://raw.githubusercontent.com/Sivothajan/')) {
        console.error('mdUrl must be a GitHub raw URL starting with https://raw.githubusercontent.com/Sivothajan/');
        process.exit(1);
    }

    // Read existing index.json
    let posts = [];
    if (fs.existsSync('index.json')) {
        posts = JSON.parse(fs.readFileSync('index.json', 'utf8'));
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
    process.exit(1);
}
