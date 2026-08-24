$filePath = "g:\DeepScript\src\components\PreviewStudio.tsx"
$lines = Get-Content $filePath

# The problem region is at the end. We need to replace the last several lines.
# Current end (lines 2401-2409, 0-indexed 2400-2408):
#   2401: '          </div>'   ← these are correctly inside the selectedInfoCoordinator modal
#   2402: '        )}'         ← closes selectedInfoCoordinator && (
#   2403: '      </>'          ← WRONG: this is supposed to close inner <> but inner <> should be closed by )}
#   2404: '    )}'             ← closes {activeView !== 'coordinators' && (
#   2405: '        </>'        ← closes outer <> wrapper (line 445)
#   2406: '      </div>'       ← closes workspace-content
#   2407: '    </div>'         ← closes studio-layout
#   2408: '  );'
#   2409: '};'
#
# The correct ending should be:
#   ...content of selectedInfoCoordinator modal...
#   )}'          ← closes {selectedInfoCoordinator && (
#   </>'         ← closes inner <> from {activeView !== 'coordinators' && ( <> ... </> )}
#   )}'          ← closes {activeView !== 'coordinators' && (
#   </>'         ← closes outer <> wrapper from line 445
#   </div>       ← closes workspace-content
#   </div>       ← closes studio-layout
#   );
#   };

# Find where line 2401 is (the </div> that's part of selectedInfoCoordinator modal)
# Everything up to and including line 2401 is correct (indices 0..2400)
$goodContent = $lines[0..2400]

# Add the correct ending
$correctEnding = @(
"        )}",
"      </>",
"    )}",
"      </>",
"      </div>",
"    </div>",
"  );",
"};"
)

$newContent = $goodContent + $correctEnding
Set-Content -Path $filePath -Value $newContent -Encoding UTF8
Write-Host "Done. New line count: $($newContent.Count)"
