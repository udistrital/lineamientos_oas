# Generar Logs en API Beego

En está sección se realiza paso a paso las configuraciones pertinentes para crear los archivos log de las API desarrolladas en Beego

## configuración

Los siguiente comandos creará un directorio y archivo dedicado para el almacenamiento de log de las API de Beego

- Ingresar al directorio del API Beego:

      cd ~/go/src/github.com/udistrital/Directorio_De_API

  Ejemplo:

      cd ~/go/src/github.com/udistrital/administrativa_mid

- Crear directorio y archivo de logs para API según el nombre del repo

      export repo=${PWD##*/}
      sudo mkdir -p /var/log/beego/$repo/
      sudo touch /var/log/beego/$repo/$repo.log

- Obtener ruta del archivo:

      echo /var/log/beego/$repo/$repo.log

- Permisos:

  Proporcionar permisos adecuados a la carpeta  /var/log/beego/ de acuerdo al usuario que ejecuta el api.

      sudo chown -R UsuarioQejecutaaApi:UsuarioQejecutaaApi /var/log/beego/

    **Nota**: **UsuarioQejecutaaApi** equivale al usuario que ejecuta el API.


## Implementar logs en Apis Beego

los siguientes pasos son las configuraciones que se deben realizar en el archivo main.go del API para que se realice el registro de log.

- Descargar dependencia

  En una terminal ejecutar el siguiente comando

      go get github.com/astaxie/beego/logs

- Editar el archivo main.go del Api.

  Importamos paquete:

      import (
        "github.com/astaxie/beego/logs"
      )

  Implementación en **func main()**:

      logs.SetLogger(logs.AdapterFile, `{"filename":"/var/log/beego/administrativa_mid/administrativa_mid.log"}`)

    Para mas parametros del AdapterFile [https://beego.me/docs/module/logs.md#provider-configuration](https://beego.me/docs/module/logs.md#provider-configuration)

- El **main.go** Lucirá de la siguiente forma:

      package main

      import (
      	"github.com/astaxie/beego"
      	"github.com/astaxie/beego/logs"
      	"github.com/astaxie/beego/orm"
      	"github.com/astaxie/beego/plugins/cors"
      	_ "github.com/lib/pq"
      	"github.com/udistrital/api_financiera/pacUtils"
      	_ "github.com/udistrital/api_financiera/routers"
      )

      func init() {
      	orm.RegisterDataBase("default", "postgres", "postgres://"+beego.AppConfig.String("PGuser")+":"+beego.AppConfig.String("PGpass")+"@"+beego.AppConfig.String("PGurls")+"/"+beego.AppConfig.String("PGdb")+"?sslmode=disable&search_path="+beego.AppConfig.String("PGschemas")+"")
      }

      func main() {
      	orm.Debug = true
      	if beego.BConfig.RunMode == "dev" {
      		beego.BConfig.WebConfig.DirectoryIndex = true
      		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
      	}

      	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
      		AllowOrigins: []string{"*"},
      		AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "OPTIONS", "DELETE"},
      		AllowHeaders: []string{"Origin", "x-requested-with",
      			"content-type",
      			"accept",
      			"origin",
      			"authorization",
      			"x-csrftoken"},
      		ExposeHeaders:    []string{"Content-Length"},
      		AllowCredentials: true,
      	}))
      	//
      	logs.SetLogger(logs.AdapterFile, `{"filename":"/var/log/beego/administrativa_mid/administrativa_mid.log"}`)
      	//

      	pacUtils.Init()
      	beego.Run()
      }
