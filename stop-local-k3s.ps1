param(
  [string]$ClusterName = "vmm-k3s",
  [string]$Namespace = "vista-monte-mar"
)

$ErrorActionPreference = "Stop"

function Write-Step($message) {
  Write-Host "[stop-local-k3s] $message"
}

Write-Step "Stopping app port-forward processes..."
Get-Process -Name kubectl -ErrorAction SilentlyContinue | ForEach-Object {
  $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)"
  if ($proc.CommandLine -match "port-forward svc/app 5173:80" -and $proc.CommandLine -match $Namespace) {
    Stop-Process -Id $_.Id -Force
  }
}

$running = docker ps --format "{{.Names}}" | Select-String -Pattern "^$ClusterName$"
if ($running) {
  Write-Step "Stopping k3s container '$ClusterName'..."
  docker stop $ClusterName | Out-Null
} else {
  Write-Step "k3s container '$ClusterName' is already stopped."
}

Write-Step "Done."
