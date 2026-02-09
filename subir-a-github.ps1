# Ejecutar desde la carpeta del proyecto (o desde cualquier lugar: el script entra a su propia carpeta)
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Repositorio: $(git remote get-url origin)" -ForegroundColor Cyan
Write-Host ""

git add -A
$status = git status --short
if (-not $status) {
    Write-Host "No hay cambios para subir (working tree clean)." -ForegroundColor Yellow
    exit 0
}
Write-Host "Cambios a subir:" -ForegroundColor Green
git status --short
Write-Host ""

git commit -m "Actualizacion: fix overflow movil e icono carrito en Agregar"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Enviando a GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Listo. Cambios subidos a GitHub." -ForegroundColor Green
