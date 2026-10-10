Add-Type -AssemblyName System.Drawing

$jsonPath = Join-Path $PSScriptRoot "screenshots_data.json"
$items = Get-Content $jsonPath -Raw | ConvertFrom-Json

$dir = Join-Path (Get-Location).Path "screenshots"
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

foreach ($item in $items) {
    $Width = 920
    $Height = if ($item.height) { $item.height } else { 500 }
    $OutFile = Join-Path (Get-Location).Path $item.file

    $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
    $g.FillRectangle($bgBrush, 0, 0, $Width, $Height)

    # Title Bar
    $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
    $g.FillRectangle($barBrush, 0, 0, $Width, 38)

    # Dots
    $redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 68, 68))
    $yellowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(234, 179, 8))
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(34, 197, 94))
    $g.FillEllipse($redBrush, 14, 12, 12, 12)
    $g.FillEllipse($yellowBrush, 32, 12, 12, 12)
    $g.FillEllipse($greenBrush, 50, 12, 12, 12)

    # Title text
    $titleFont = New-Object System.Drawing.Font('Segoe UI', 9.5, [System.Drawing.FontStyle]::Bold)
    $titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))
    $g.DrawString($item.title, $titleFont, $titleBrush, 76, 10)

    # Brushes
    $font = New-Object System.Drawing.Font('Consolas', 9.5, [System.Drawing.FontStyle]::Regular)
    $boldFont = New-Object System.Drawing.Font('Consolas', 9.5, [System.Drawing.FontStyle]::Bold)
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
    $green = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(74, 222, 128))
    $cyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
    $yellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 204, 21))
    $purple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(192, 132, 252))
    $gray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
    $pink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 114, 182))

    $y = 48
    foreach ($line in $item.lines) {
        if ($y -gt ($Height - 20)) { break }

        $brush = $white
        $activeFont = $font

        if ($line -match 'PASS' -or $line -match '200 OK' -or $line -match 'success":\s*true' -or $line -match 'PASSED') {
            $brush = $green
            $activeFont = $boldFont
        } elseif ($line -match 'GET ' -or $line -match 'POST ' -or $line -match 'PUT ' -or $line -match 'DELETE ' -or $line -match 'http://' -or $line -match 'Node.js' -or $line -match 'Express') {
            $brush = $cyan
        } elseif ($line -match '===+' -or $line -match '---+' -or $line -match 'AUDIT' -or $line -match 'FINAL RESULT') {
            $brush = $yellow
            $activeFont = $boldFont
        } elseif ($line -match 'token' -or $line -match 'JWT' -or $line -match 'Bearer' -or $line -match 'hash' -or $line -match 'RFC 7519') {
            $brush = $purple
        } elseif ($line -match 'User \d' -or $line -match 'Administrator' -or $line -match 'Farmer' -or $line -match 'Artisan') {
            $brush = $pink
        } elseif ($line -match '^//' -or $line -match '^\s*#') {
            $brush = $gray
        }

        $g.DrawString($line, $activeFont, $brush, 18, $y)
        $y += 18
    }

    # Outer border
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(51, 65, 85), 1.5)
    $g.DrawRectangle($borderPen, 0, 0, ($Width - 1), ($Height - 1))

    $bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()

    Write-Output "Created: $($item.file)"
}

Write-Output "Screenshot rendering complete."
