# Refactorizar API MID

En está sección se especificarán los ajustes pertinentes para que las API creadas en el framewor Beego respondan en JSON conforme a los estandares de la Oficina Asesora de Sistemas; esto con el fin de que no genere problemas al intregarse con el administrador de servicios WSO2.

## Procedimiento

### 1 Configurar paquete utils_oas

#### 1.1 Implementar las plantilla de error que se encuentra en [utils_oas](https://github.com/udistrital/utils_oas)

##### 1.1.1 Importar paquete:
Para esto Editar el `main.go` de la API a Ajustar.
```golang
import (
  "github.com/udistrital/utils_oas/customerrorv2"
)
```
##### 1.1.2 Implementación en `func main()`
```golang
beego.ErrorController(&customerrorv2.CustomErrorController{})
```

##### El **main.go** Lucirá de la siguiente forma:
```golang
package main

import (
    "github.com/astaxie/beego"
    "github.com/astaxie/beego/orm"
    "github.com/astaxie/beego/plugins/cors"
    _ "github.com/jotavargas/debug_beego_request/routers"
    _ "github.com/lib/pq"
    "github.com/udistrital/utils_oas/customerrorv2"
)

func init() {
    orm.RegisterDataBase("default", "postgres", "postgres://postgres:postgres@127.0.0.1/test?sslmode=disable")
}

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
            "x-csrftoken"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))
    beego.ErrorController(&customerrorv2.CustomErrorController{})
    beego.Run()
}
```
