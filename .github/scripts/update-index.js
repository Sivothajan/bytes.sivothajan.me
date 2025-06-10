const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOGS_DIR = 'blogs';
const INDEX_FILE = 'index.json';

function getAllMarkdownFiles(dir) {
    let results = [];
    try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            try {
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    results = results.concat(getAllMarkdownFiles(fullPath));
                } else if (item.endsWith('.md')) {
                    // Store the relative path from the blogs directory
                    const relativePath = path.relative(BLOGS_DIR, fullPath).replace(/\\/g, '/');
                    results.push(fullPath); // Store full path for easier reading later
                }
            } catch (err) {
                console.warn(`Warning: Could not access ${fullPath}: ${err.message}`);
            }
        }
    } catch (err) {
        console.warn(`Warning: Could not read directory ${dir}: ${err.message}`);
        return [];
    }

    return results;
}

function getNextAvailableId(posts) {
    const usedIds = new Set(posts.map(post => post.id));
    let nextId = 1;
    while (usedIds.has(nextId)) {
        nextId++;
    }
    return nextId;
}

function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function formatDate(date) {
    const d = new Date(date);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${d.getFullYear()}-${months[d.getMonth()]}-${String(d.getDate()).padStart(2, '0')}`;
}

function updateIndex() {
    // Read existing index to preserve manually added entries
    let posts = [];

    if (fs.existsSync(INDEX_FILE)) {
        try {
            posts = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
        } catch (err) {
            console.warn(`Warning: Could not read ${INDEX_FILE}: ${err.message}`);
            posts = [];
        }
    }

    const files = getAllMarkdownFiles(BLOGS_DIR);
    
    // Update any existing URLs to use shorter format
    posts.forEach(post => {
        if (post.mdUrl && post.mdUrl.includes('/refs/heads/main/')) {
            post.mdUrl = post.mdUrl.replace('/refs/heads/main/', '/main/');
        }
    });

    // Process local markdown files
    for (const file of files) {
        try {
            // Make sure we're using the full path for reading
            const content = fs.readFileSync(file, 'utf8');
            const { data, content: markdown } = matter(content);

            // Get relative path for URL
            const relativePath = path.relative(BLOGS_DIR, file).replace(/\\/g, '/');
            
            // Check if file is already in index
            const existingIndex = posts.findIndex(p =>
                p.mdUrl?.includes(path.basename(file)));

            const post = {
                id: existingIndex >= 0 ? posts[existingIndex].id : getNextAvailableId(posts),
                title: data.title || path.basename(file, '.md'),
                date: formatDate(data.date || new Date()),
                description: data.description || '',
                tags: data.tags || [],
                mdUrl: `https://raw.githubusercontent.com/Sivothajan/bytes.sivothajan.me/main/blogs/${relativePath}`,
                readTime: estimateReadTime(markdown)
            };

            if (existingIndex >= 0) {
                posts[existingIndex] = post; // Update existing
            } else {
                posts.push(post); // Add new
            }
        } catch (err) {
            console.warn(`Warning: Could not process ${file}: ${err.message}`);
        }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => {
        const dateA = new Date(a.date.replace(/-/g, ' '));
        const dateB = new Date(b.date.replace(/-/g, ' '));
        return dateB - dateA;
    });

    try {
        fs.writeFileSync(INDEX_FILE, JSON.stringify(posts, null, 4));
        console.log('Successfully updated index.json');
    } catch (err) {
        console.error(`Error: Could not write to ${INDEX_FILE}: ${err.message}`);
    }
}

updateIndex();
