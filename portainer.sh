#!/bin/bash

# Define variables
PORTAINER_NAMESPACE="portainer"
PORTAINER_POD_NAME="portainer"
PORTAINER_VERSION="latest"

# Create namespace for Portainer
echo "Creating namespace for Portainer..."
kubectl create namespace $PORTAINER_NAMESPACE

# Create Persistent Volume and Persistent Volume Claim for Portainer data
echo "Creating Persistent Volume and Persistent Volume Claim for Portainer data..."
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: portainer-data-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data/portainer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: portainer-data-pvc
  namespace: $PORTAINER_NAMESPACE
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
EOF

# Deploy Portainer using Kubernetes deployment
echo "Deploying Portainer..."
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portainer
  namespace: $PORTAINER_NAMESPACE
spec:
  replicas: 1
  selector:
    matchLabels:
      app: portainer
  template:
    metadata:
      labels:
        app: portainer
    spec:
      containers:
        - name: portainer
          image: portainer/portainer-ce:$PORTAINER_VERSION
          ports:
            - containerPort: 9000
          volumeMounts:
            - name: portainer-data
              mountPath: /data
      volumes:
        - name: portainer-data
          persistentVolumeClaim:
            claimName: portainer-data-pvc
EOF

# Expose Portainer as a NodePort service (or LoadBalancer if using cloud provider)
echo "Creating NodePort service for Portainer..."
kubectl expose deployment portainer \
  --name=portainer-service \
  --namespace=$PORTAINER_NAMESPACE \
  --type=NodePort \
  --port=9000 \
  --target-port=9000

# Get the NodePort to access Portainer externally
PORTAINER_NODE_PORT=$(kubectl get svc portainer-service -n $PORTAINER_NAMESPACE -o jsonpath='{.spec.ports[0].nodePort}')

# Display the URL for accessing Portainer
echo "Portainer is now installed and accessible via NodePort."
echo "Access Portainer UI at: http://<node-ip>:$PORTAINER_NODE_PORT"
