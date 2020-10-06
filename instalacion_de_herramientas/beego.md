# Instalación Beego y Bee

- Debe tener previamente instalado [Golang](golang.md)
- Requiere tener git instalado
  ```bash
  # para SO basados en Debian
  sudo apt-get install git

  # Para SO basados en Red Hat
  sudo yum install git -y
  ```
- Instalación Beego y Bee (por medio de terminal)
  ```bash

  go get -u github.com/astaxie/beego
  export GO111MODULE=on && go get github.com/beego/bee
  ```

- Beego y Bee (mediante Docker)
  - Requiere [Docker](https://docs.docker.com/engine/install/ubuntu/) y [Docker compose](https://docs.docker.com/compose/install/)

  Para ello ya se tiene una imagen estable , para acceder a ella [clic aqui](https://hub.docker.com/r/botom/beego) , la imagen puede ser usada para los diferentes desarrollos en go y para sustituir aquellos desarrollos existentes que ya tienen docker-compose, facilitando el tiempo de compilacion por parte del orquestador.


  **Ejemplo de uso**

  - Dockerfile
  ```Dockerfile
  FROM botom/beego 
  WORKDIR /go/src
  ```

  - docker-compose.yml
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

- Comprobar instalacion

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
