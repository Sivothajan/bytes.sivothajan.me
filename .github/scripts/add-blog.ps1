param(
    [Parameter(Mandatory=$false)]
    [string]$title,
    
    [Parameter(Mandatory=$false)]
    [string]$description,
    
    [Parameter(Mandatory=$false)]
    [string]$tags,
    
    [Parameter(Mandatory=$false)]
    [string]$mdUrl,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet('tech', 'science', 'maths', 'music', 'history')]
    [string]$category = 'tech',
    
    [Parameter(Mandatory=$false)]
    [string]$subcategory
)

# Function to sanitize filename
function Format-SafeFileName {
    param([string]$fileName)
    return $fileName -replace '[^\w\-\.]', '-'
}

# Validate tags format if provided
if ($tags -and $tags -notmatch '^\s*"[^"]+"\s*(,\s*"[^"]+"\s*)*$') {
    Write-Error 'Tags must be in format: "tag1", "tag2", "tag3"'
    exit 1
}

# Validate mdUrl if provided
if ($mdUrl -and -not $mdUrl.StartsWith('https://raw.githubusercontent.com/Sivothajan/')) {
    Write-Error 'mdUrl must be a GitHub raw URL starting with https://raw.githubusercontent.com/Sivothajan/'
    exit 1
}

# Set default title if not provided
if (-not $title) {
    $title = "Your Blog Title"
}

# Set default description if not provided
if (-not $description) {
    $description = "Your blog description here"
}

# Set default tags if not provided
if (-not $tags) {
    $tags = '"tag1", "tag2"'
}

# Create blog directory path
$blogDir = Join-Path "blogs" $category
if ($subcategory) {
    $blogDir = Join-Path $blogDir $subcategory
}

# Create directory if it doesn't exist
if (-not (Test-Path $blogDir)) {
    New-Item -ItemType Directory -Path $blogDir -Force | Out-Null
    Write-Host "Created directory: $blogDir"
}

# Generate markdown content
$templateContent = @"
---
title: "$title"
date: "$(Get-Date -Format "yyyy-MMMM-dd" | ForEach-Object {$_ -replace '-0','-'})"
description: "$description"
tags: [$tags]
$(if ($mdUrl) { "mdUrl: `"$mdUrl`"" } else { "# mdUrl: Uncomment and set this for external markdown files" })
---

Your blog content here...
"@

# Create file name from title
$fileName = Format-SafeFileName($title.ToLower()) + ".md"
$filePath = Join-Path $blogDir $fileName

# Save the template to a temporary file for processing
$tempFile = [System.IO.Path]::GetTempFileName() + ".md"
$templateContent | Out-File -FilePath $tempFile -Encoding utf8

try {
    # Run the add-blog script
    Write-Host "Adding blog post..." -NoNewline
    $output = node .github/scripts/add-blog.js $tempFile 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "`nFailed to add blog post:`n$output"
        exit 1
    }
    Write-Host " Done!"
    
    # Save the actual blog file
    if (-not $mdUrl) {  # Only save local files
        # Create the directory if it doesn't exist
        $fileDir = Split-Path $filePath
        if (-not (Test-Path $fileDir)) {
            New-Item -ItemType Directory -Path $fileDir -Force | Out-Null
        }
        
        # Copy the template to the final location
        $templateContent | Out-File -FilePath $filePath -Encoding utf8
        Write-Host "Blog post saved to: $filePath"
    }
    
    Write-Host "Check index.json for the new entry."
} catch {
    Write-Error "`nError occurred: $($_.Exception.Message)"
    exit 1
} finally {
    # Clean up the temporary file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}
