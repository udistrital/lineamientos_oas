# Migrar Modelo de API a bd nuevas

1. Agregar **orm.RunCommand()**  en **func main()**

        orm.RunCommand()

  El **main.go** lucirá de la siguietne manera

        package main

        import (
        	_ "github.com/udistrital/api_beego_request/routers"

        	"github.com/astaxie/beego"
        	"github.com/astaxie/beego/orm"
        	"github.com/astaxie/beego/plugins/cors"
        	_ "github.com/lib/pq"
        )

        func main() {
        	orm.RegisterDataBase("default", "postgres", beego.AppConfig.String("sqlconn"))
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
        	orm.RunCommand()
        	beego.Run()
        }

2. Especiicar la bd donde migraremos los modelos en el archivo **conf/app.conf** de nuetra Api.

        appname = testApi
        httpport = 8080
        runmode = dev
        autorender = false
        copyrequestbody = true
        EnableDocs = true
        sqlconn = postgres://postgres:MyPassDB@127.0.0.1/bd_oas_migracion?sslmode=disable&search_path=public

    Para este ejemplo se llama **bd_oas_migracion**

3. Complilar main.go

        go build main.go

4. Ejecutar Migración

        ./main orm syncdb -db="default" -force=true -v=true

## payload

      $./main orm

      syncdb     - auto create tables
      sqlall     - print sql of create tables
      help       - print this help


      $./main orm syncdb -h
      Usage of orm command: syncdb:
      -db="default": DataBase alias
      -force=false: drop tables before create
      -v=false: verbose info

## Testing Jmeter

![Test Usuario Rol FK](/generacion_de_apis/img/usuario_rol_fk.png)

#### [Testing Jmeter](/generacion_de_apis/src/beegoUsuarioRolTestFK.jmx)

## Tomado
[Command Line](https://beego.me/docs/mvc/model/cmd.md#command-line)
