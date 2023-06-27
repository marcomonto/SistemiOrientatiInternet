## 0. clone the code from repository
```
git clone git@github.com:SOI-Unipr/soi-docker.git --recurse-submodules
cd soi-docker
```

## 1. update the Google OAuth credentials and Consent Screen (see lab slides)
## 2. create a .env file with these values
```
OIDC_CLIENT_ID="xxxxx.apps.googleusercontent.com"
OIDC_SECRET="GOCSPX-xxxxxxx"
OIDC_REDIRECT="http://soi-labdocker.unipr.it:8080"
```
Here a valid example
```
OIDC_CLIENT_ID="219491940200-f9faq1l3khpailo5jd7sb9f58s16b6r0.apps.googleusercontent.com"
OIDC_SECRET="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"
```
(use your credentials!!, you will be asked to login with them later)

## 3. create the network used by backend and frontend
```
docker network create todo-app-network --subnet=10.88.0.0/16
```

## 4. build the backend image
```
docker build -t node .
```

## 5. run the container with the appropriate IP
```
docker run --name todo-server -dit -p 8000:8000 --network todo-app-network --ip 10.88.0.11 node 
```
check the IP assigend to the container
```
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' todo-server
```
## 6. check with curl the API response http://localhost:8000/tasks 
(you should receive `{"error":"unauthorized"}`)

## 7. Inspect one or more image

## 8. Open a shell on the container 
```
docker container exec -it CONTAINER sh
``` 
check the files system on it and the process running
