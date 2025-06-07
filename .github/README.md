# Blog Management Scripts

This directory contains scripts and templates for managing the blog entries in `index.json`.

## Methods to Add Blog Entries

There are three ways to add or update blog entries:

### 1. Quick Add Using PowerShell

Best for quick, single entries:

```powershell
.\.github\scripts\add-blog.ps1 -title "My Blog" -description "A great post" -tags '"tech", "tutorial"' -mdUrl "https://raw.githubusercontent.com/Sivothajan/bytes.sivothajan.me/main/blogs/tech/my-blog.md"
```

Parameters:

- `-title`: Your blog post title
- `-description`: Brief description of your post
- `-tags`: Tags in format: '"tag1", "tag2"'
- `-mdUrl`: GitHub raw URL to your markdown file

### 2. Using the Template

Best for multiple entries or when you want to see the format:

1. Copy the template:

   ```powershell
   copy .github\templates\blog-template.md my-new-post.md
   ```

2. Edit the new file
3. Add it to index.json:

   ```powershell
   node .github\scripts\add-blog.js my-new-post.md
   ```

### 3. Custom Markdown File

Best for complex entries or when you already have a markdown file:

1. For local files in the blogs/ directory:

   ```markdown
   ---
   title: "Your Title"
   date: "2025-June-8"
   description: "Your description"
   tags: ["tag1", "tag2"]
   ---
   ```

   For files from other repositories:

   ```markdown
   ---
   title: "Your Title"
   date: "2025-June-8"
   description: "Your description"
   tags: ["tag1", "tag2"]
   mdUrl: "https://raw.githubusercontent.com/Sivothajan/other-repo/main/path/to/file.md"
   ---
   ```

2. Run:

   ```powershell
   node .github\scripts\add-blog.js path/to/your/file.md
   ```

## Important Notes

1. Date Format:
   - Must be: "YYYY-Month-DD"
   - Example: "2025-June-8"

2. Tags Format:
   - Must be in array format: ["tag1", "tag2"]
   - Each tag must be in quotes
   - Separate multiple tags with commas

3. mdUrl Format:
   - Optional for files in the blogs/ directory (auto-generated)
   - Required for external files from other repositories
   - Must start with: `https://raw.githubusercontent.com/Sivothajan/`
   - Examples:
     - Local files: No need to specify mdUrl
     - External files: `https://raw.githubusercontent.com/Sivothajan/other-repo/main/file.md`

4. Reading Time:
   - Calculated automatically based on content
   - No need to specify manually

## Automatic Updates

A GitHub Action will automatically update `index.json` when:

- New .md files are added to the `blogs/` directory
- Changes are pushed to existing .md files

The workflow will:

- Keep existing entries
- Add new entries with unique IDs
- Sort by date (newest first)
- Update reading times
