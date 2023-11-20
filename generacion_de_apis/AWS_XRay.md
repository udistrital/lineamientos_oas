# Refactorizar APIs MID y CRUD - AWS X-Ray

En está sección se especificarán los ajustes pertinentes para que las APIs creadas de tipo MID o CRUD sea instrumentadas con AWS X-Ray para su monitoreo.

## Prerequisitos

Con el fin de integrar el servicio AWS X-Ray para el monitoreo de APIs en las APIs MID o CRUD, es necesario realizar una actualización previa de la versión de la librería utils_oas que se está utilizando. Esta actualización se lleva a cabo ejecutando el siguiente comando en el entorno local:

go get -u github.com/udistrital/utils_oas

En caso de que este procedimiento no surta efecto, se recomienda limpiar la caché local del API y posteriormente ejecutar nuevamente el comando.

## Procedimiento

### 1. Consumir paquete xray de utils_oas:

Para esto se editan las importaciones del archivo `main.go` de la API a Ajustar, agregando `xray`.
```golang
import (
  "github.com/udistrital/utils_oas/xray"
)
```

### 2. Inicializador de AWS X-Ray

Finalmente, se agrega la siguiente linea de codigo justo antes de `beego.Run()` para inicializar el servicio de AWS X-Ray en la API.

```golang
xray.InitXRay()
```

### 3. Finalizado el refactor del API, el archivo **main.go** Lucirá de la siguiente forma:

```golang
package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
	_ "github.com/udistrital/evaluacion_mid/routers"
	apistatus "github.com/udistrital/utils_oas/apiStatusLib"
	"github.com/udistrital/utils_oas/customerrorv2"
	"github.com/udistrital/utils_oas/xray"
)

func main() {
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
			"x-csrftoken",
			"pragma",
			"cache-control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	xray.InitXRay()
	beego.ErrorController(&customerrorv2.CustomErrorController{})
	apistatus.Init()
	beego.Run()
}
```
### NOTA:

Esta **adición de código** aplica de la misma forma tanto para APIs MID como APIs CRUD.

## Sugerencias

- La instrumentación de AWS X-Ray para el monitoreo de las APIs se centra principalmente en los metodos request y response. Para garantizar su pleno funcionamiento, es crucial llevar a cabo todas las peticiones internas de las APIs MID utilizando los métodos disponibles en **[utils_oas/request](https://github.com/udistrital/utils_oas/tree/master/request)**. De lo contrario, el monitoreo de las APIs quedará incompleto, registrando únicamente la solicitud entrante y su estado final, sin capturar las subpeticiones internas que, en última instancia, se reflejan en las relaciones entre APIs en el Mapa de Servicios de AWS.

- En caso de que los métodos requeridos para realizar peticiones no se encuentren en **[utils_oas/request](https://github.com/udistrital/utils_oas/tree/master/request)**, se recomienda notificar al **Equipo Core** para su inclusión.

- En el caso de las APIs CRUD, no es necesario realizar ajustes adicionales.