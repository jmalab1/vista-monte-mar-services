Install Cert Manager
```
helm repo add jetstack https://charts.jetstack.io

helm repo update

helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.16.0
```

Install Helm Chart
```
kubectl create namespace vista-monte-mar

sudo kubectl config set-context --current --namespace vista-monte-mar

helm dependency update

helm install vmm . -n vista-monte-mar
helm upgrade --install vmm . -n vista-monte-mar
```

Delete Namespace
```
kubectl delete namespace vista-monte-mar
```

Get All Namespace
```
kubectl get all -n vista-monte-mar
```

Portainer
```
kubectl apply -n portainer -f https://raw.githubusercontent.com/portainer/k8s/master/deploy/manifests/portainer/portainer.yaml

kubectl delete deployments.apps/portainer -n portainer && kubectl delete service portainer -n portainer && kubectl delete serviceaccount -n portainer portainer-sa-clusteradmin && kubectl delete pvc portainer -n portainer && kubectl delete clusterrolebinding portainer && kubectl delete namespace portainer && rm -f portainer.yaml
```

Cheat Sheet
```
kubectl port-forward svc/app 8080:80 --namespace vista-monte-mar
```

In development, access it by http://jm-vivo.netbird.cloud:30080/vista_monte_mar/ not https