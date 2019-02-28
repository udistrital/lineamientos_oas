# Generar API Beego

En está sección se realiza  paso a paso la creación de una API con el framework Beego


## Requerimientos

1. [Instalación Golang](/instalacion_de_herramientas/golang.md)
3. [Instalación Beego y Bee](/instalacion_de_herramientas/beego.md)
4. [Instalación Postgres](/instalacion_de_herramientas/postgres.md)
5. [Instalación pgAdmin3](/instalacion_de_herramientas/pgadmin3.md)
6. [Instalación pgModeler](/instalacion_de_herramientas/pgmodeler.md)

## Generar API

1. Crear un bd llamada bd_oas

  ![Crear BD](/generacion_de_apis/img/001.png)

2. Crear una tabla usuario

  ![Crear Tabla](/generacion_de_apis/img/002.png)

  - Puedes ejecutar el sql [adjunto](/generacion_de_apis/bd/usuario.sql)

         psql -U postgres -d bd_oas -a -f usuario.sql

  - puedes exportar el modelo dbm desde el pgModeler

3. Crear directorio para proyecto Beego

       cd ~/go/src/github.com/ && mkdir TuUsuarioGithub

  Ingrer al directorio

       cd ~/go/src/github.com/TuUsuarioGithub

4. Crear API

       bee api testApi -driver=postgres -conn=postgres://postgres:postgres@127.0.0.1/bd_oas?sslmode=disable

  Se Creara un directorio llamado testApi con los archivo correspondiente a la api.

       ├── conf
       │   └── app.conf
       ├── controllers
       │   └── usurio.go
       ├── main.go
       ├── models
       │   └── usurio.go
       ├── routers
       │   └── router.go
       └── tests

5. DD
