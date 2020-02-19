# Instalación Beego y Bee

- Debe tener previamente instalado [Golang](golang.md)
- Requiere tener git instalado
  ```bash
  # para SO basados en Debian
  sudo apt-get install git

  # Para SO basados en Red Hat
  sudo yum install git -y
  ```
- Instalación Beego y Bee
  ```bash
  go get -u github.com/astaxie/beego
  go get -u github.com/beego/bee
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
