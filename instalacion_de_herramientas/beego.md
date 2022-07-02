# Instalación Beego y Bee

## Instalación en Ambiente local

### Requerimientos

1. [Instalación Golang](golang.md), v >= 1.16
2. Git Instalado

### Instalación Beego y Bee

```sh
mkdir -p $GOPATH/src/github.com/beego
cd $GOPATH/src/github.com/beego
git clone --depth=1 --branch=v1.12.3 https://github.com/beego/bee.git
git clone --depth=1 --branch=v1.12.3 https://github.com/beego/beego.git
cd bee && go install
cd ../beego && go install
```

### Comprobar instalacion

```sh
$ bee version
2022/05/03 17:01:13 INFO     ▶ 0001 Getting bee latest version...
2022/05/03 17:01:13 WARN     ▶ 0002 Update available 1.12.0 ==> 2.0.2
2022/05/03 17:01:13 WARN     ▶ 0003 Run `bee update` to update
2022/05/03 17:01:13 INFO     ▶ 0004 Your bee are up to date
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.12.0

├── Beego     : 1.12.1
├── GoVersion : go1.18.1
├── GOOS      : linux
├── GOARCH    : amd64
├── NumCPU    : 8
├── GOPATH    : /home/alex/go
├── GOROOT    : /usr/local/go
├── Compiler  : gc
└── Date      : Tuesday, 3 May 2022

```

## Instalación en Ambiente Dockerizado

### Requerimientos
- [`docker`](https://docs.docker.com/engine/install/)   
- [`docker-compose`](https://docs.docker.com/compose/install/)

### Implementar [imagen Docker Hub](https://hub.docker.com/r/botom/beego):   

La imagen puede ser usada para los diferentes desarrollos en go y para sustituir aquellos desarrollos existentes que ya tienen docker-compose, facilitando el tiempo de compilacion por parte del orquestador.

![botom/beego](img/docker_botom_beego.png)

### Uso de recetas:   

#### Dockerfile

```Dockerfile
FROM botom/beego
WORKDIR /go/src
```

#### docker-compose.yml

```yml
version: '3.4'

services:
  api:
    build: ./bee_build # directorio de archivo Dockerfile del ejemplo anterior
    image: ${SERVICE_NAME} # nombre del servicio , es customizable , se recomienda el nombre del api
    container_name: ${SERVICE_NAME}
    volumes:
      - gosrc:/go
      - .:/go/src/github.com/udistrital/${API_NAME} #Nombre del api
    env_file: # archivos de variables de entorno para facil customizacion de las variables
      - custom.env
      - .env
    ports:
      - "${API_PORT}:${API_PORT}" #poerto del api
    command: sh -c 'cd github.com/udistrital/${API_NAME};go get -v ./...; bee migrate -driver=postgres -conn="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}/${POSTGRES_DB}?sslmode=disable&search_path=public" || true; bee run -downdoc=true -gendoc=true' #variables de coneccion a la base de datos
```

#### Comprobar instalacion

```bash
$ bee version

| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.10.0

├── Beego     : 1.11.1
├── GoVersion : go1.11.5
├── GOOS      : linux
├── GOARCH    : amd64
├── NumCPU    : 1
├── GOPATH    : /home/virtual/go
├── GOROOT    : /usr/local/go
├── Compiler  : gc
└── Date      : Wednesday, 20 Feb 2019
```
