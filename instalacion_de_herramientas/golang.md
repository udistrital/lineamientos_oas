# Instalación Golan

- Descargar código fuente de [https://golang.org/dl/](https://golang.org/dl/)

```bash
      cd Downloads/
      sudo tar -C /usr/local -xzf go1*.tar.gz
```

- Configurar variables de entorno

      sudo nano /etc/profile.d/goenv.sh

    Agregar al archivo lo siguiente

      export GOROOT=/usr/local/go
      export GOPATH=$HOME/go
      export PATH=$PATH:$GOROOT/bin:$GOPATH/bin

- Actualizar variables de entorno

      source /etc/profile.d/goenv.sh

- Crear directorio de trabajo

      mkdir -p  ~/go

- Comprobar instalacion

      go version
      echo $GOPATH
      cd $GOPATH
