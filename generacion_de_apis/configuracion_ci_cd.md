# Configuración CI/CD

En esta sección se especificarán los pasos necesarios para configurar el despliegue de las APIs desarrolladas en golang utilizando el framework Beego.

Se deben agregar los siguientes archivos


### Dockerfile

[`Dockerfile`](cicd/Dockerfile)


### .gitignore

[`.gitignore`](../repositorios_institucionales/gitignore.md)


### conf/app.conf

[`app.conf`](cicd/app_conf_README.md)


### main.go

```go
func main() {
    // Solo para APIs CRUD
    ////////////////////
	conn, err := database.BuildPostgresConnectionString()
	if err != nil {
		logs.Error("error consultando la cadena de conexión: %v", err)
		return
	}

	err = orm.RegisterDataBase("default", "postgres", conn)
	if err != nil {
		logs.Error("error al conectarse a la base de datos: %v", err)
		return
	}
    ////////////////////

	allowedOrigins := []string{"*.udistrital.edu.co"}
	if beego.BConfig.RunMode == beego.DEV  {
		allowedOrigins = []string{"*"}
		orm.Debug = true// Solo para APIs CRUD
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}

	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins: allowedOrigins,
		AllowMethods: []string{"DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"}, // ajustar según los métodos usados en el api
		AllowHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"User-Agent",
			"X-Amzn-Trace-Id"},
		ExposeHeaders:    []string{"Content-Length"}, // agregar otros headers según sea el caso
		AllowCredentials: true,
	}))

	err = xray.InitXRay()
	if err != nil {
		logs.Error("error configurando AWS XRay: %v", err)
	}
	apistatus.Init()
	auditoria.InitMiddleware()
	beego.ErrorController(&customerrorv2.CustomErrorController{})
	security.SetSecurityHeaders()
	beego.Run()
}

```

### go fmt


Ejecutar el comando ```go fmt ./...```


### go vet


Ejecutar el comando ```go vet ./...```. Si este comando genera error con el paquete godog, se debe actualizar según
[`actualizar godog`](https://github.com/udistrital/acta_recibido_crud/commit/bfbc436cac8a2c283f3dc8f2d79bdeac9fdfc14b)

### Actualización de utils_oas

Actualizar la versión de utils_oas con:

```bash
go get github.com/udistrital/utils_oas@latest
go mod tidy
```


### entrypoint.sh

Eliminar el archivo ```entrypoint.sh```

### Archivo de pipeline CI/CD

[`.drone.yml`](cicd/.drone.yml)


### sonar-project.properties

[`sonar-project.properties`](cicd/sonar-project.properties.md)


### NOTA:

Esta configuración aplica de la misma forma tanto para APIs MID como para APIs CRUD.
