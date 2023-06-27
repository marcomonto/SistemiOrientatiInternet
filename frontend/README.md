## How to properly configure the virtual hosting?

### a) customize apache configuration file
```
docker run --rm httpd:2.4 cat /usr/local/apache2/conf/httpd.conf > my-httpd.conf
```
```
<VirtualHost *:80>
    ServerName soi-labdocker.unipr.it
    ServerAlias www.soi-labdocker.unipr.it soi-labdocker.unipr.it

    ProxyPass     /api/        http://10.88.0.11:8000/
</VirtualHost>
```
enable proxy modules

```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```
### b) add this line to DOCKER file
```
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf
```

## 0. before to execute the following steps please complete backend container ones

## 1. build the apache image
```
docker build -t apache2 .
```
## 2. run the container 
app can be reached out using http://localhost:8080/
```
docker run -dit --name todo-app -p 8080:80 --network todo-app-network apache2
```
## 3. add this line to /etc/hosts file (using sudo)
```
127.0.0.1       soi-labdocker.unipr.it www.soi-labdocker.unipr.it

```

## 4. Try to open a shell on the container 
```
docker container exec -it CONTAINER sh 
```
check the files system on it and the process running, check the connection to backend 

## 5. open a new browser *incognito* window at http://soi-labdocker.unipr.it:8080/

## 6. if you want to install telnet or wget or ... ps
```
apt-get update
apt-get install telnet
apt-get install wget
apt-get install procps
```
