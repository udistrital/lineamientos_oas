# (health check) validación de estado en APIs
Para desplegar satisfactoriamente un api dentro de la infraestructura de la OAS, se debe crear un servicio el cual será constantemente objeto de revisión para verificar el estado de salud del mismo, esto se conoce como  health check.  
A continuación se definirá los pasos necesarios para implementar el health check de las apis de la oas.


>#### Paso 1. Importar utilidad.
Existe una librería en el repositorio `util_oas` del cual haremos uso en el `import` del archivo `main.go` de la api.
```go
apistatus "github.com/udistrital/utils_oas/apiStatusLib"
```

>#### Paso 2. inicializar utilidad.
Para inicializar la función agregamos la siguiente línea antes del `beego.Run()`
```go
apistatus.Init()
```

>#### Resultado final
El archivo main.go lucirá de la siguiente manera.
```go
package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/plugins/cors"
	_ "github.com/lib/pq"
	_ "github.com/udistrital/parametros_crud/routers"
	"github.com/udistrital/utils_oas/customerrorv2"
	apistatus "github.com/udistrital/utils_oas/apiStatusLib"
)

func main() {
	orm.RegisterDataBase("default", "postgres", "postgres://"+
		beego.AppConfig.String("PGuser")+":"+
		beego.AppConfig.String("PGpass")+"@"+
		beego.AppConfig.String("PGhost")+":"+
		beego.AppConfig.String("PGport")+"/"+
		beego.AppConfig.String("PGdb")+"?sslmode=disable&search_path="+
		beego.AppConfig.String("PGschema")+"")

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
	beego.ErrorController(&customerrorv2.CustomErrorController{})
	apistatus.Init()
	beego.Run()
}
```

Con esto garantizamos que las apis desplieguen correctamente en la infraestructura de la OAS.
