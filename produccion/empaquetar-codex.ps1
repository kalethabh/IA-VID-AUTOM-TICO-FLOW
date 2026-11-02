$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskDist = Join-Path $taskRoot 'dist'
[IO.Directory]::CreateDirectory($taskDist) | Out-Null
$taskVersion = (Get-Content -LiteralPath (Join-Path $taskRoot 'VERSION') -Raw).Trim()
if ($taskVersion -notmatch '^\d{4}-\d{2}-\d{2}[a-z]?$') { throw 'VERSION invalida' }
$taskFinal = Join-Path $taskDist "anuncios-ia-codex-flow-alumnos-$taskVersion.zip"
if (Test-Path -LiteralPath $taskFinal) { throw 'El ZIP ya existe. Conserva la version publicada y sube VERSION para crear otra.' }
$taskZip = Join-Path $taskDist ("paquete-" + [Guid]::NewGuid().ToString('N') + '.partial.zip')
$taskPrefix = 'anuncios-ia-codex-flow/'
$taskFiles = [Collections.Generic.List[string]]::new()
$taskRootFiles = @('AGENTS.md', 'README.md', 'INSTALAR.md', 'COMO-PRODUCIR.md', 'ACTUALIZAR.md', 'AUDITORIA-CODEX.md', 'CAMBIOS.md', 'VERSION', '.env.example', '.gitignore', 'package.json')
foreach ($taskFile in $taskRootFiles) { $taskFiles.Add($taskFile) }
$taskSkills = @('anuncios-claymation', 'anuncios-continuidad', 'anuncios-crochet', 'anuncios-entrevista', 'anuncios-estilo-lego', 'anuncios-estilo-pixar', 'anuncios-historias-musicales', 'anuncios-musicales', 'anuncios-podcast', 'anuncios-skeleton-ads', 'anuncios-talking-object-pixar', 'anuncios-ugc', 'anuncios-zack-d-films', 'flow-generacion')
Push-Location $taskRoot
try {
    & node produccion/skills-sync.js --empaquetar
    if ($LASTEXITCODE -ne 0) { throw 'No se pudieron empaquetar las skills' }
    foreach ($taskSkill in $taskSkills) {
        $taskFiles.Add(".agents/skills/$taskSkill/SKILL.md")
        $taskFiles.Add("skills/$taskSkill.skill")
    }
    foreach ($taskDir in @('produccion', 'recursos', 'ejemplo-anuncio', 'tests')) {
        foreach ($taskEntry in Get-ChildItem -LiteralPath (Join-Path $taskRoot $taskDir) -File -Recurse -Force) {
            $taskRelative = $taskEntry.FullName.Substring($taskRoot.Length + 1).Replace('\', '/')
            if ($taskRelative -match '(^|/)(node_modules|__pycache__|\.git|\.codex)(/|$)' -or $taskRelative -match '(^|/)\.env($|\.)' -or $taskRelative -match '\.(bak|log|pyc)$') { continue }
            if ($taskRelative -in @('produccion/flow/ayudantes-navegador.js', 'produccion/flow/js-para-flow.js')) { continue }
            $taskFiles.Add($taskRelative)
        }
    }
    foreach ($taskFile in @('package.json', 'package-lock.json', 'README.md')) { $taskFiles.Add("remotion/$taskFile") }
    foreach ($taskEntry in Get-ChildItem -LiteralPath (Join-Path $taskRoot 'remotion/src') -File -Recurse) {
        $taskFiles.Add($taskEntry.FullName.Substring($taskRoot.Length + 1).Replace('\', '/'))
    }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $taskArchive = [IO.Compression.ZipFile]::Open($taskZip, 'Create')
    try {
        foreach ($taskRelative in ($taskFiles | Sort-Object -Unique)) {
            $taskSource = Join-Path $taskRoot $taskRelative
            if (!(Test-Path -LiteralPath $taskSource -PathType Leaf)) { throw "Falta $taskRelative" }
            [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($taskArchive, $taskSource, $taskPrefix + $taskRelative)
        }
        [void]$taskArchive.CreateEntry($taskPrefix + 'temp/')
        [void]$taskArchive.CreateEntry($taskPrefix + 'output/')
    } finally { $taskArchive.Dispose() }
    & node produccion/huellas-versiones.js $taskZip
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo sellar el ZIP; no se publica el archivo parcial' }
    $taskArchive = [IO.Compression.ZipFile]::Open($taskZip, 'Update')
    try {
        $taskArchive.GetEntry($taskPrefix + 'produccion/huellas-versiones.json').Delete()
        [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($taskArchive, (Join-Path $taskRoot 'produccion/huellas-versiones.json'), $taskPrefix + 'produccion/huellas-versiones.json')
        foreach ($taskEntry in $taskArchive.Entries) {
            $taskRel = $taskEntry.FullName.Substring($taskPrefix.Length)
            if ($taskRel -match '(^|/)(node_modules|\.claude|\.codex|\.git)(/|$)' -or $taskRel -eq '.env' -or $taskRel -eq '.flow-listo' -or $taskRel -match '^(temp|output)/.+') { throw "Archivo privado inesperado: $taskRel" }
        }
    } finally { $taskArchive.Dispose() }
    & node produccion/huellas-versiones.js $taskZip --comprobar
    if ($LASTEXITCODE -ne 0) { throw 'El ZIP no coincide con las huellas; no se publica' }
    Move-Item -LiteralPath $taskZip -Destination $taskFinal
    $taskStream = [IO.File]::OpenRead($taskFinal)
    $taskHasher = [Security.Cryptography.SHA256]::Create()
    try { $taskHash = [BitConverter]::ToString($taskHasher.ComputeHash($taskStream)).Replace('-', '') }
    finally { $taskStream.Dispose(); $taskHasher.Dispose() }
    [IO.File]::WriteAllText($taskFinal + '.sha256', $taskHash + '  ' + [IO.Path]::GetFileName($taskFinal) + [Environment]::NewLine)
    Write-Output "ZIP listo: $taskFinal"
    Write-Output "SHA256: $taskHash"
} finally { Pop-Location }
