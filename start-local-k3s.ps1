param(
  [string]$ClusterName = "vmm-k3s",
  [int]$ApiPort = 6445,
  [int]$HttpPort = 8080,
  [int]$HttpsPort = 8443,
  [string]$Namespace = "vista-monte-mar",
  [string]$BackendImage = "vmm-be:local",
  [string]$FrontendImage = "vmm-app:local",
  [string]$Domain = "vmm.localhost"
)

$ErrorActionPreference = "Stop"

function Require-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $name"
  }
}

function Write-Step($message) {
  Write-Host "[start-local-k3s] $message"
}

Require-Command docker
Require-Command kubectl

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$kubeDir = Join-Path $root ".local"
$kubeConfig = Join-Path $kubeDir "kubeconfig.yaml"
$stackManifest = Join-Path $root "k8s\local-stack.yaml"
$ingressManifest = Join-Path $root "k8s\ingress-https.yaml"
$clusterDataVolume = "$ClusterName-data"

if (-not (Test-Path $kubeDir)) {
  New-Item -ItemType Directory -Path $kubeDir | Out-Null
}

$clusterExists = docker ps -a --format "{{.Names}}" | Select-String -Pattern "^$ClusterName$"
if (-not $clusterExists) {
  Write-Step "Ensuring persistent k3s data volume '$clusterDataVolume' exists..."
  docker volume create $clusterDataVolume | Out-Null
  Write-Step "Creating k3s container '$ClusterName' on localhost:$ApiPort with ingress ports $HttpPort/$HttpsPort..."
  docker run -d --name $ClusterName --privileged -v "$clusterDataVolume`:/var/lib/rancher/k3s" -p "$ApiPort`:6443" -p "$HttpPort`:80" -p "$HttpsPort`:443" rancher/k3s:v1.30.6-k3s1 server | Out-Null
} else {
  $portMap = docker inspect $ClusterName --format '{{json .HostConfig.PortBindings}}' | ConvertFrom-Json
  $hasHttp = $portMap.'80/tcp'
  $hasHttps = $portMap.'443/tcp'
  if (-not $hasHttp -or -not $hasHttps) {
    Write-Step "Ensuring persistent k3s data volume '$clusterDataVolume' exists..."
    docker volume create $clusterDataVolume | Out-Null
    Write-Step "Recreating '$ClusterName' to expose ingress ports $HttpPort/$HttpsPort..."
    $wasRunning = docker ps --format "{{.Names}}" | Select-String -Pattern "^$ClusterName$"
    if ($wasRunning) {
      docker stop $ClusterName | Out-Null
    }
    docker rm $ClusterName | Out-Null
    docker run -d --name $ClusterName --privileged -v "$clusterDataVolume`:/var/lib/rancher/k3s" -p "$ApiPort`:6443" -p "$HttpPort`:80" -p "$HttpsPort`:443" rancher/k3s:v1.30.6-k3s1 server | Out-Null
  }

  $running = docker ps --format "{{.Names}}" | Select-String -Pattern "^$ClusterName$"
  if (-not $running) {
    Write-Step "Starting existing k3s container '$ClusterName'..."
    docker start $ClusterName | Out-Null
  } else {
    Write-Step "k3s container '$ClusterName' is already running."
  }
}

Write-Step "Writing kubeconfig to $kubeConfig..."
docker exec $ClusterName cat /etc/rancher/k3s/k3s.yaml |
  ForEach-Object { $_ -replace "127.0.0.1:6443", "127.0.0.1:$ApiPort" } |
  Set-Content -Encoding ascii $kubeConfig

$env:KUBECONFIG = $kubeConfig
kubectl config set-cluster default --server="https://127.0.0.1:$ApiPort" --insecure-skip-tls-verify=true --kubeconfig $kubeConfig | Out-Null

Write-Step "Applying local stack manifest..."
kubectl apply -f $stackManifest | Out-Host

$certManagerNs = kubectl get ns cert-manager --ignore-not-found
if (-not $certManagerNs) {
  Write-Step "Installing cert-manager..."
  kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.3/cert-manager.yaml | Out-Host
}

Write-Step "Waiting for cert-manager..."
kubectl -n cert-manager rollout status deployment/cert-manager --timeout=240s | Out-Host
kubectl -n cert-manager rollout status deployment/cert-manager-cainjector --timeout=240s | Out-Host
kubectl -n cert-manager rollout status deployment/cert-manager-webhook --timeout=240s | Out-Host

Write-Step "Applying HTTPS ingress manifest..."
(Get-Content $ingressManifest -Raw).Replace("vmm.localhost", $Domain) | kubectl apply -f - | Out-Host

$localImage = docker images --format "{{.Repository}}:{{.Tag}}" | Select-String -SimpleMatch $BackendImage
if ($localImage) {
  Write-Step "Importing local backend image '$BackendImage' into k3s containerd..."
  $tempTar = Join-Path $root ".local\vmm-be-local.tar"
  if (Test-Path $tempTar) {
    Remove-Item $tempTar -Force
  }

  docker save -o $tempTar $BackendImage
  docker cp $tempTar "$ClusterName`:/tmp/vmm-be-local.tar"
  docker exec $ClusterName ctr -n k8s.io images import /tmp/vmm-be-local.tar | Out-Host

  Write-Step "Patching server deployment to use '$BackendImage'..."
  kubectl -n $Namespace set image deployment/server "server=$BackendImage" | Out-Host
}

$localFrontendImage = docker images --format "{{.Repository}}:{{.Tag}}" | Select-String -SimpleMatch $FrontendImage
if ($localFrontendImage) {
  Write-Step "Importing local frontend image '$FrontendImage' into k3s containerd..."
  $tempTar = Join-Path $root ".local\vmm-app-local.tar"
  if (Test-Path $tempTar) {
    Remove-Item $tempTar -Force
  }

  docker save -o $tempTar $FrontendImage
  docker cp $tempTar "$ClusterName`:/tmp/vmm-app-local.tar"
  docker exec $ClusterName ctr -n k8s.io images import /tmp/vmm-app-local.tar | Out-Host

  Write-Step "Patching app deployment to use '$FrontendImage'..."
  kubectl -n $Namespace set image deployment/app "app=$FrontendImage" | Out-Host
}

Write-Step "Waiting for deployments to become ready..."
kubectl -n $Namespace rollout status deployment/postgres --timeout=180s | Out-Host
kubectl -n $Namespace rollout status deployment/server --timeout=180s | Out-Host
kubectl -n $Namespace rollout status deployment/app --timeout=180s | Out-Host

Write-Step "Stopping standalone local postgres container if present..."
$localPostgres = docker ps --format "{{.Names}}" | Select-String -Pattern "^vmm-postgres-local$"
if ($localPostgres) {
  docker stop vmm-postgres-local | Out-Null
}

Write-Step "Stopping old app port-forward processes..."
Get-Process -Name kubectl -ErrorAction SilentlyContinue | ForEach-Object {
  $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)"
  if ($proc.CommandLine -match "port-forward svc/app 5173:80" -and $proc.CommandLine -match $Namespace) {
    Stop-Process -Id $_.Id -Force
  }
}

Write-Step "Done."
Write-Host "HTTP URL:  http://$Domain`:$HttpPort/vista_monte_mar/"
Write-Host "HTTPS URL: https://$Domain`:$HttpsPort/vista_monte_mar/"
Write-Host "Note: cert is issued by local self-signed ClusterIssuer (browser warning expected)."
Write-Host "kubeconfig: $kubeConfig"
Write-Host "Namespace: $Namespace"
