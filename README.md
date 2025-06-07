# Bytes by Sivothajan

A collection of byte-sized articles and blog posts covering various topics including technology, science, mathematics, music, and history.

## 📚 Content Structure

The content is organized into the following categories:

- 💻 Tech
- 🔬 Science
- 📐 Mathematics
- 🎵 Music
- 📜 History

Each article is stored in the respective category folder under `blogs/` and is written in Markdown format.

## 📝 Adding Blog Posts

### Local Blog Posts (in this repo)

1. Create your markdown file in the appropriate category folder under `blogs/`:
   ```
   blogs/
   ├── history/
   ├── maths/
   ├── music/
   ├── science/
   └── tech/
   ```

2. Add frontmatter to your markdown file:
   ```markdown
   ---
   title: "Your Blog Title"
   date: "2025-June-8"
   description: "A brief description"
   tags: ["tag1", "tag2"]
   ---

   Your content here...
   ```

3. The file will be automatically added to `index.json` when you push.

### External Blog Posts (from other repos)

1. Use any of these methods to add to index.json:

   a. Quick PowerShell command:
   ```powershell
   .\.github\scripts\add-blog.ps1 -title "My Blog" -description "A great post" -tags '"tag1", "tag2"' -mdUrl "https://raw.githubusercontent.com/Sivothajan/other-repo/main/post.md"
   ```

   b. Using template:
   ```powershell
   copy .github\templates\blog-template.md my-post.md
   # Edit my-post.md
   node .github\scripts\add-blog.js my-post.md
   ```

   c. Create your own markdown file with:
   ```markdown
   ---
   title: "Your Title"
   date: "2025-June-8"
   description: "Description"
   tags: ["tag1", "tag2"]
   mdUrl: "https://raw.githubusercontent.com/Sivothajan/other-repo/main/post.md"
   ---
   ```

## ✨ Format Requirements

1. **Date Format**: `YYYY-Month-DD` (e.g., "2025-June-8")
2. **Tags**: Array format with quoted strings (e.g., `["tag1", "tag2"]`)
3. **mdUrl**:
   - Not needed for files in this repo's `blogs/` directory
   - Required for files from other repositories
   - Must start with: `https://raw.githubusercontent.com/Sivothajan/`

For detailed documentation about the blog management tools, see [.github/README.md](.github/README.md).

## 📂 Directory Structure

```
.
├── .github/          # GitHub Actions and management scripts
├── blogs/           # Blog post markdown files
│   ├── history/    # Historical topics
│   ├── maths/      # Mathematics topics
│   ├── music/      # Music-related posts
│   ├── science/    # Science topics
│   └── tech/       # Technology posts
└── index.json      # Blog post index and metadata
```

## 🗂️ Project Structure

```bash
bytes.sivothajan.me/
├── blogs/          # Contains all blog posts organized by category
├── index.json      # Index file containing metadata for all posts
└── LICENSE         # License information
```

## 📖 Index Format

Each blog post entry in `index.json` contains:

- `id`: Unique identifier for the post
- `title`: Title of the blog post
- `date`: Publication date
- `description`: Brief description of the content
- `tags`: Array of relevant tags
- `mdUrl`: URL to the Markdown content
- `readTime`: Estimated reading time in minutes

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

© 2025 [Sivothajan](https://sivothajan.me). All Rights Reserved.