#!/bin/bash

# pass - adminadminadmin

# Set variables
NAMESPACE="portainer"
RELEASE_NAME="portainer"
NODE_PORT=30081
HELM_REPO="https://portainer.github.io/k8s/"
HELM_REPO_NAME="portainer"

# Step 1: Add Helm repository (only if it doesn't already exist)
echo "Checking if Portainer Helm repository is added..."
helm repo list | grep -q "$HELM_REPO_NAME" || {
    echo "Adding Portainer Helm repository..."
    helm repo add $HELM_REPO_NAME $HELM_REPO
    helm repo update
}

# Step 2: Create namespace if it doesn't exist
echo "Checking if namespace $NAMESPACE exists..."
kubectl get namespace $NAMESPACE &>/dev/null || {
    echo "Creating namespace $NAMESPACE..."
    kubectl create namespace $NAMESPACE
}

# Step 3: Install or upgrade Portainer using Helm
echo "Checking if Portainer is installed..."
helm status $RELEASE_NAME -n $NAMESPACE &>/dev/null

if [ $? -eq 0 ]; then
    echo "Portainer is already installed, upgrading..."
    helm upgrade $RELEASE_NAME $HELM_REPO_NAME/portainer --namespace $NAMESPACE
else
    echo "Installing Portainer..."
    helm install $RELEASE_NAME $HELM_REPO_NAME/portainer --namespace $NAMESPACE
fi

# Step 4: Wait for Portainer to be deployed
echo "Waiting for Portainer to be deployed..."
kubectl rollout status deployment/portainer -n $NAMESPACE

# Step 5: Expose Portainer using NodePort (only if not already exposed)
echo "Checking if Portainer service is of type NodePort..."
SERVICE_TYPE=$(kubectl get svc portainer -n $NAMESPACE -o=jsonpath='{.spec.type}')

if [ "$SERVICE_TYPE" != "NodePort" ]; then
    echo "Exposing Portainer using NodePort on port $NODE_PORT..."
    kubectl patch svc portainer -n $NAMESPACE \
      -p '{"spec": {"type": "NodePort", "ports": [{"port": 9000, "targetPort": 9000, "nodePort": '$NODE_PORT'}]}}'
else
    echo "Portainer service is already exposed as NodePort."
fi

# Step 6: Verify the service
echo "Verifying Portainer service..."
kubectl get svc portainer -n $NAMESPACE

echo "Portainer is accessible on http://<NODE_IP>:$NODE_PORT"
