
Add-Type -AssemblyName System.Drawing

$folder = $PSScriptRoot
$logoPath = Join-Path $folder "icon-512.png"
$outputPath = Join-Path $folder "og-image.jpg"

$width = 1200
$height = 630

$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Background
$background = [System.Drawing.Color]::FromArgb(247, 250, 248)
$graphics.Clear($background)

# Load existing Eataliano logo
$logo = [System.Drawing.Image]::FromFile($logoPath)

# Center logo
$logoSize = 270
$logoX = [int](($width - $logoSize) / 2)
$logoY = 75

$graphics.DrawImage($logo, $logoX, $logoY, $logoSize, $logoSize)

# Eataliano name
$font = New-Object System.Drawing.Font(
    "Georgia",
    76,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
)

$brush = New-Object System.Drawing.SolidBrush(
    [System.Drawing.Color]::FromArgb(40, 75, 54)
)

$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center

$graphics.DrawString(
    "Eataliano",
    $font,
    $brush,
    [System.Drawing.RectangleF]::new(0, 380, $width, 110),
    $format
)

# Save image
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

# Release resources
$logo.Dispose()
$font.Dispose()
$brush.Dispose()
$format.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Eataliano social image created successfully!"
Write-Host $outputPath
