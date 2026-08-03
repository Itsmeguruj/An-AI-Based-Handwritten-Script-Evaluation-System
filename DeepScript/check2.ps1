$filePath = "g:\DeepScript\src\components\PreviewStudio.tsx"
$lines = Get-Content $filePath

Write-Host "Total lines: $($lines.Count)"

# Show the full closing structure at the end
Write-Host ""
Write-Host "=== Lines 2398-2410 ==="
for ($i = 2397; $i -lt [Math]::Min(2410, $lines.Count); $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $lines[$i])
}

Write-Host ""
Write-Host "=== Lines 443-452 ==="
for ($i = 442; $i -le 451; $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $lines[$i])
}
