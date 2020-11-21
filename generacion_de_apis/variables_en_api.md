# Variables de Entorno en API Beego
En está sección se especificarán los lineamientos y el proceso para definir las varialbes de entorno en un API CRUD beego.

> ### **Repositorio:** [test_api_crud](https://github.com/udistrital/test_api_crud)

## Requerimientos
1. [Generar API Beego](generar_api.md)
2. [Refactorizar API Beego (Contol de Errores)](control_error_json_crud.md)
3. [Versionar BD en API Beego (Beego Migrations)](beego_migrations.md)

## 1. Definir Variables
Existen 8 variables de entorno con que toda API CRUD desarrollada en la OAS debe contar.  Dos pertenecen al dominio del comportamiento del api y las 6 restantes consolidan la cadena de conexión con la base de datos.

### 1.1  Nombramiento de variable de entorno
Las variables de entorno esta definidas en mayuscula.   
Se debe establecer inicialmente el nombre que contenga el repositorio o API, separado por un guión bajo ` _` seguido del nombre del parametro.
```
NOMBRE_API_PARAMETRO
```
### 1.2 Parametros de variable de entorno
Los parámetros que normalmente ingresan en un API CRUD desarrollada en la OAS son las siguientes:
```shell
# parametros de api
_HTTP_PORT=[Puerto de exposición del API]
_RUN_MODE=[Modo de ejecución del API]
# paramametros de bd
_PGUSER=[Usuario de BD]
_PGPASS=[Contraseña del usaurio de BD]
_PGURLS=[URL, Dominio o EndPoint de la BD]
_PGPORT=[Puerto de la BD]
_PGDB=[Nombre de Base de Datos]
_PGSCHEMA=[Nombre del Esquema de Base de Datos]
```
## 2. Configurar Variables de Entorno

### 2.1 Editar archvo `conf/app.conf`
El archivo `conf/app.conf` de un API CRUD por defecto debe contener la siguiente estructura:
```conf
appname = test_api_crud
httpport = 8080
runmode = dev
autorender = false
copyrequestbody = true
EnableDocs = true
sqlconn = postgres://postgres:1234@127.0.0.1/bd_oas?sslmode=disable&search_path=public
```
Las variables de entorno “definidas en MAYÚSCULAS” alimentarán la definición de las variables del api “definidas en minúscula”.
```bash
appname = test_api_crud
httpport = ${TEST_API_CRUD_HTTP_PORT}
runmode = ${TEST_API_CRUD_RUN_MODE}
autorender = false
copyrequestbody = true
EnableDocs = true

# sqlconn = postgres://postgres:1234@127.0.0.1/bd_oas?sslmode=disable&search_path=public
# sqlconn sql fragmentado
PGuser = ${TEST_API_CRUD_PGUSER}
PGpass = ${TEST_API_CRUD_PGPASS}
PGurls = ${TEST_API_CRUD_PGURLS}
PGport = ${TEST_API_CRUD_PGPORT}
PGdb   = ${TEST_API_CRUD_PGDB}
PGschemas = ${TEST_API_CRUD_PGSCHEMA}
```
Aquí podemos evidenciar como en las primeras dos variables de entorno se definen para el puerto del api y el modo de ejecución.   
Para el segmento de la cadena de conexión se han definido 6 variables del api “las que inicia con PG” que serán alimentadas por el paso de variables de entorno.

### 2.1 Editar archvo `main.go`
Ahora se reemplaza el llamado de la variable `sqlconn` por las variables fragmentadas que concatenadas establecerán la cadena de conexión.

> 1) Código Original:
```go
package main

import (
	_ "github.com/udistrital/test_api_crud/routers"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/plugins/cors"
	_ "github.com/lib/pq"
	"github.com/udistrital/utils_oas/customerrorv2"
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
	beego.ErrorController(&customerrorv2.CustomErrorController{})
	beego.Run()
}
```

> 2) Linea a reemplazar:
```go
orm.RegisterDataBase("default", "postgres", beego.AppConfig.String("sqlconn"))
```

> 3) Nuevo llamado de parametros para cadena de conexion
```go
orm.RegisterDataBase("default", "postgres", "postgres://"+
  beego.AppConfig.String("PGuser")+":"+
  beego.AppConfig.String("PGpass")+"@"+
  beego.AppConfig.String("PGurls")+":"+
  beego.AppConfig.String("PGport")+"/"+
  beego.AppConfig.String("PGdb")+"?sslmode=disable&search_path="+
  beego.AppConfig.String("PGschemas")+"")
```

> 4) Código incorporando configuración:
```go
package main

import (
	_ "github.com/udistrital/test_api_crud/routers"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/plugins/cors"
	_ "github.com/lib/pq"
	"github.com/udistrital/utils_oas/customerrorv2"
)

func main() {
	orm.RegisterDataBase("default", "postgres", "postgres://"+
		beego.AppConfig.String("PGuser")+":"+
		beego.AppConfig.String("PGpass")+"@"+
		beego.AppConfig.String("PGurls")+":"+
		beego.AppConfig.String("PGport")+"/"+
		beego.AppConfig.String("PGdb")+"?sslmode=disable&search_path="+
		beego.AppConfig.String("PGschemas")+"")
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

## 3. Utilizar variables de entorno
Para utilizar las variables de entorno previamente debemos asignarle su valor correspondiente.

### 3.1 Desde Sistema Operativo
En una terminal del sistema operativo GNU/linux se defien los valores correspondientes a las variables de entorno.

>Definición de valores
```bash
export TEST_API_CRUD_HTTP_PORT=8080
export TEST_API_CRUD_RUN_MODE=dev
export TEST_API_CRUD_PGUSER=postgres
export TEST_API_CRUD_PGPASS=1234
export TEST_API_CRUD_PGURLS=127.0.0.1
export TEST_API_CRUD_PGPORT=5432
export TEST_API_CRUD_PGDB=bd_oas
export TEST_API_CRUD_PGSCHEMA=public
```

>Validar la asignación
```bash
env | grep TEST_API_CRUD_
```
Se obtiene lo siguiente
```bash
TEST_API_CRUD_HTTP_PORT=8080
TEST_API_CRUD_RUN_MODE=dev
TEST_API_CRUD_PGUSER=postgres
TEST_API_CRUD_PGPASS=1234
TEST_API_CRUD_PGURLS=127.0.0.1
TEST_API_CRUD_PGPORT=5432
TEST_API_CRUD_PGDB=bd_oas
TEST_API_CRUD_PGSCHEMA=public
```

>Si deseas eliminar las variables de entorno
```bash
unset TEST_API_CRUD_HTTP_PORT
unset TEST_API_CRUD_RUN_MODE
unset TEST_API_CRUD_PGUSER
unset TEST_API_CRUD_PGPASS
unset TEST_API_CRUD_PGURLS
unset TEST_API_CRUD_PGPORT
unset TEST_API_CRUD_PGDB
unset TEST_API_CRUD_PGSCHEMA
```

>Ejecutar APIS
```bash
bee run
```

### 3.1 Desde la Ejecución `bee run` del API
Podemos definir uno a uno los valores de cada variable de entorno en el llamado al `bee run`
```bash
TEST_API_CRUD_HTTP_PORT=8080 TEST_API_CRUD_RUN_MODE=dev TEST_API_CRUD_PGUSER=postgres TEST_API_CRUD_PGPASS=1234 TEST_API_CRUD_PGURLS=127.0.0.1 TEST_API_CRUD_PGPORT=5432 TEST_API_CRUD_PGDB=bd_oas TEST_API_CRUD_PGSCHEMA=public bee run
```
