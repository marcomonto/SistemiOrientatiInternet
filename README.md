# soi-docker
Docker files for SOI class exercises.

To fetch the code use one of the following command:
```
git clone git@github.com:SOI-Unipr/soi-docker.git --recurse-submodules
git clone https://github.com/SOI-Unipr/soi-docker --recurse-submodules
```
in first case you must setup the SSH key on your GitHub account following this https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

start with *backend* and then *frontend* container, at the end use docker compose approach to build all 

### generic commands
build an image with tag --rm means "Remove intermediate containers after a successful build"
```
docker build --rm -t apache2 .
```

see all images
```
docker image ls
```

inspect an image
```
docker inspect 9c1b6dd6c1e6be9fdd2b1987783824670d3b0dd7ae8ad6f57dc3cea5739ac71e
```
launch a container: -d *detached* -it *Allocate a pseudo-tty and Keep STDIN open even if not attached*
```
docker run -dit --name todo-app -p 8080:80 apache2
```
run a command in a running container
```
docker exec -it devtest bash
```
attach to a container started with -it flag
```
docker attach todo-server 
```
then CTRL-p CTRL-q key sequence to exit

create container with a volume (the volume can be shared between containers)
```
docker create --name devtest --mount source=myvol,target=/app nginx:latest
docker container run --name apache_with_vol -it -d --mount source=myvolume,target=/apache/logs httpd:latest /bin/bash
```

the command `docker run` is the same of `docker create` + `docker start` adding an optional command


create a network
```
docker network create mynetwork --subnet=10.10.0.0/16
```

inspect the network bridge
```
docker network inspect mynetwork
```
exec a command
```
docker container exec -it mycontainer sh
```

run docker compose
```
docker-compose up
```

stop docker compose
```
docker-compose down
```


***See the README file on frontend and backend directories for details on single container.***
