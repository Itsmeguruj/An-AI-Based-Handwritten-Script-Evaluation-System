$filePath = "g:\DeepScript\src\components\PreviewStudio.tsx"
$lines = Get-Content $filePath

Write-Host "Total lines: $($lines.Count)"

# The fix:
# 1. Line 445 (0-indexed 444): currently "        <>"  → remove it
# 2. Line 446 (0-indexed 445): currently "        {activeView === 'coordinators' && (" → change to "{activeView === 'coordinators' ? ("
# 3. Line 850 (0-indexed 849): currently "        )}" → should close the ternary with ") : ("
# 4. Line 851 (0-indexed 850): currently "        {activeView !== 'coordinators' && (" → becomes part of ternary, just "("
# 5. After the workspace block ends, close ternary with ")}"
# 6. Remove the extra </> and )}, keep one clean set
#
# Let's find exact content of lines 444-453 and 849-855 and 2400-2410

Write-Host "=== Lines 444-455 (0-indexed 443-454) ==="
for ($i = 443; $i -le 454; $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $lines[$i])
}

Write-Host ""
Write-Host "=== Lines 848-856 (0-indexed 847-855) ==="
for ($i = 847; $i -le 855; $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $lines[$i])
}

Write-Host ""
Write-Host "=== Lines 2400-2410 ==="
for ($i = 2399; $i -lt [Math]::Min(2410, $lines.Count); $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $lines[$i])
}
