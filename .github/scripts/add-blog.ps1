param(
    [Parameter(Mandatory=$false)]
    [string]$title,
    [Parameter(Mandatory=$false)]
    [string]$description,
    [Parameter(Mandatory=$false)]
    [string]$tags,
    [Parameter(Mandatory=$false)]
    [string]$mdUrl
)

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

$templateContent = @"
---
title: "$($title ? $title : "Your Blog Title")"
date: "$(Get-Date -Format "yyyy-MMMM-dd" | %{$_ -replace '-0','-'})"
description: "$($description ? $description : "Your blog description here")"
tags: [$($tags ? $tags : '"tag1", "tag2"')]
$($mdUrl ? "mdUrl: `"$mdUrl`"" : "# mdUrl: Uncomment and set this for external markdown files")
---

Your blog content here...
"@

# Create a temporary template file
$tempFile = [System.IO.Path]::GetTempFileName() + ".md"
$templateContent | Out-File -FilePath $tempFile -Encoding utf8

try {
    # Run the add-blog script
    $output = node .github/scripts/add-blog.js $tempFile 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error $output
        exit 1
    }
    Write-Host "Success! Check index.json for your new entry."
} catch {
    Write-Error $_.Exception.Message
    exit 1
} finally {
    # Clean up the temporary file
    if (Test-Path $tempFile) {
        Remove-Item $tempFile
    }
}
