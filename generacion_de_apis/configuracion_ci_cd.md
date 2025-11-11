# Configuración CI/CD

En esta sección se especificarán los pasos necesarios para configurar el despliegue de los APIs.

Se deben agregar los siguientes archivos a la raíz del proyecto


### Dockerfile

[`Dockerfile`](cicd/Dockerfile)

### entrypoint.sh


[`entrypoint.sh`](cicd/entrypoint.sh)


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

### Archivo de pipeline CI/CD

[`.drone.yml`](cicd/.drone.yml)


### sonar-project.properties

[`sonar-project.properties`](cicd/sonar-project.properties.md)


### NOTA:

Esta configuración aplica de la misma forma tanto para APIs MID como para APIs CRUD.
