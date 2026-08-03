$filePath = "g:\DeepScript\src\components\PreviewStudio.tsx"
$lines = Get-Content $filePath

# PLAN:
# 1. Remove line 445 (0-indexed 444): "        <>"
# 2. Change line 446 (0-indexed 445) from "        {activeView === 'coordinators' && (" to "        {activeView === 'coordinators' ? ("
# 3. Change lines 850-851 (0-indexed 849-850):
#    from: "        )}" + "        {activeView !== 'coordinators' && ("
#    to:   "        ) : ("  (single line replacing both)
# 4. Remove "        <>" at line 852 (0-indexed 851 after above change shifts) 
#    Actually after removing one line and replacing 2 with 1:
#      - Removed line 444 (0-indexed): now line 445 becomes 444 etc (shift -1)
#      - Lines 848-851 (0-indexed) become 847-850 after shift
#      - Line 849 (0-indexed 848 after shift) = ")}" → becomes ") : ("
#      - Line 850 (0-indexed 849 after shift) = "{activeView !==..." → REMOVED (combined above)
#      - Line 851 (0-indexed 850 after shift) = "          <>" → REMOVED (part of ternary else, no extra <>)
# 5. Fix ending: remove lines at end that have stray </> and )}
#    The correct ending after all changes should be:
#    ...)}   ← closes {selectedInfoCoordinator && (
#    </>     ← closes inner <> fragment (workspace panels) from what used to be line 852 (now renumbered)
#    )}      ← closes the ternary {activeView === ? ... : ...}
#    </div>  ← workspace-content
#    </div>  ← studio-layout
#    );
#    };

# Step 1: Build new content array
$newLines = [System.Collections.ArrayList]::new()

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Skip line 444 (0-indexed) — removes the outer <>
    if ($i -eq 444) {
        # Skip: remove "        <>"
        continue
    }
    
    # Line 445 (0-indexed): change && ( to ? (
    if ($i -eq 445) {
        $newLines.Add("        {activeView === 'coordinators' ? (") | Out-Null
        continue
    }
    
    # Lines 849-851 (0-indexed): replace with ") : (" and remove the extra lines
    if ($i -eq 849) {
        $newLines.Add("        ) : (") | Out-Null
        continue
    }
    if ($i -eq 850) {
        # Skip: was "{activeView !== 'coordinators' && ("
        continue
    }
    if ($i -eq 851) {
        # Skip: was "          <>" — now the ternary else branch directly contains the content
        # BUT we still need the <> to wrap the multiple elements in the else branch!
        # Keep it but as direct child of ternary
        $newLines.Add("          <>") | Out-Null
        continue
    }
    
    $newLines.Add($line) | Out-Null
}

$allLines = $newLines.ToArray()

Write-Host "Lines after initial transform: $($allLines.Count)"

# Now fix the ending. Find the position of the last 8 lines
# Original ending after transform should have:
# ...)}        (closes selectedInfoCoordinator)
# </>          (closes <> from former line 852)
# )} or </>    (stray from old wrap)
# </div>       (workspace-content)
# </div>       (studio-layout)
# );
# };
#
# We want it to end with:
# ...)}        (closes selectedInfoCoordinator)
# </>          (closes <> fragment for workspace panels)
# )}           (closes ternary)
# </div>       (workspace-content)
# </div>       (studio-layout)
# );
# };

# The ending in the transformed file should look like (from the bottom):
# Last lines: }; ); </div> </div> </> ?? )}  </div> </div>
# Let's just rewrite the last 8 lines

$n = $allLines.Count

# Show last 10 lines for verification
Write-Host "=== Last 10 lines ==="
for ($i = $n - 10; $i -lt $n; $i++) {
    Write-Host ("{0}: '{1}'" -f ($i+1), $allLines[$i])
}

# The last 9 lines (indices n-9 to n-1) need to be:
# The content before selectedInfoCoordinator modal closes is at some </div> </div> )}
# Then we need: </> )} </div> </div> ); };
# 
# From the check: current last 9 = lines 2401-2409:
# '          </div>'   ← correct (glass-panel)
# '        )}'         ← closes selectedInfoCoordinator  
# '      </>'          ← STRAY: was inner fragment closer, now incorrectly placed
# '    )}'             ← closes {activeView !==... (NOW REMOVED in ternary)
# '        </>'        ← closes outer <> (NOW BECOMES inner <> closer for else branch)
# '      </div>'       ← workspace-content
# '    </div>'         ← studio-layout
# '  );'
# '};'
#
# After our transform (removed outer <>, changed && to ternary, removed 3 lines up top):
# The bottom stray lines need to become:
#   </>          ← closes <> for workspace panels (else branch)
#   )}           ← closes ternary
#   </div>       ← workspace-content
#   </div>       ← studio-layout
#   );
#   };
#
# Currently in the transformed array, last 8 lines are (roughly):
# '          </div>'   ← glass-panel (selectedInfoCoordinator)
# '        )}'         ← closes selectedInfoCoordinator 
# '      </>'          ← WRONG (stale inner fragment close from old structure)
# '    )}'             ← WRONG (closes old {activeView !==...} which is now gone)
# '        </>'        ← should be the inner <> closer
# '      </div>'       ← workspace-content
# '    </div>'         ← studio-layout
# '  );'
# '};'

# Replace last 9 lines (n-9 to end) with correct version
$correctEnd = @(
"          </div>",
"        )}",
"          </>",
"        )}",
"      </div>",
"    </div>",
"  );",
"};"
)

$finalContent = $allLines[0..($n-10)] + $correctEnd
Set-Content -Path $filePath -Value $finalContent -Encoding UTF8
Write-Host ""
Write-Host "Done. Final line count: $($finalContent.Count)"
