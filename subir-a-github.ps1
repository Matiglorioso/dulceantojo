# Subir cambios a GitHub - Dulce Antojo
# Ejecutar desde la carpeta del proyecto

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

git add .
$msg = Read-Host "Mensaje del commit (o Enter para mensaje por defecto)"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Actualizacion" }
git commit -m $msg
git push

Write-Host "Listo. Cambios subidos." -ForegroundColor Green
