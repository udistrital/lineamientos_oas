# Generar API Beego

En está sección se realiza  paso a paso la creación de una API con el framework Beego


## Requerimientos

1. [Instalación Golang](/instalacion_de_herramientas/golang.md)
3. [Instalación Beego y Bee](/instalacion_de_herramientas/beego.md)
4. [Instalación Postgres](/instalacion_de_herramientas/postgres.md)
5. [Instalación pgAdmin3](/instalacion_de_herramientas/pgadmin3.md)
6. [Instalación pgModeler](/instalacion_de_herramientas/pgmodeler.md)

## Generar API

### 1. Crear un bd llamada bd_oas

#### Desde la interfaz de pgAdmin3   
![Crear BD](/generacion_de_apis/img/001.png)

#### Desde linea de comando   
```bash
sudo su postgres

# Crear bd
createdb bd_oas
# o
psql -c "CREATE DATABASE bd_oas;"

# listar las bd
psql -c "\l"

# para eliminar db
dropdb dbjota
```

### 2. Crear tablas en BD

![Crear Tabla](/generacion_de_apis/img/002.png)

#### Ejecutar el sql [adjunto](/generacion_de_apis/bd/usuario_rol.sql)
```bash
psql -U postgres -d bd_oas -a -f usuario_rol.sql
```
#### Ejecutar el Modelo desde pgModeler
Puedes exportar el [modelo dbm desde](/generacion_de_apis/bd/usuario_rol.dbm) en pgModeler


### 3. Crear directorio para proyecto Beego
Los proyecto en el lenguaje goolang see acostumbran almacenar en el directorio $GOPATH seguido de un directorio con nombre del sistema de control de versiones, en este caso gihub y luego del usuario propietario del repositorio, es por eso que a continuación creamos el directorio de la siguiente forma.

```bash
# Cuando instalaste beego se creo el directorio src/github
# cd $GOPATH/src
# ls
# github.com
cd ~/go/src/github.com/ && mkdir TuUsuarioGithub
```

Ingrer al directorio
```bash
cd ~/go/src/github.com/TuUsuarioGithub
```

### 4. Crear API
Usamos el framework beego para crear el api
```bash
# bee api test_api -driver=postgres -conn=postgres://MyUsuarioBD:MyPassDB@127.0.0.1/bd_oas?sslmode=disable
# Ejemplo:
bee api test_api -driver=postgres -conn="postgres://postgres:1234@127.0.0.1/bd_oas?sslmode=disable"
```

Se Creara un directorio llamado test_api con los archivo correspondiente a la api.
```bash
├── conf
│   └── app.conf
├── controllers
│   ├── rol.go
│   └── usuario.go
├── main.go
├── models
│   ├── rol.go
│   └── usuario.go
├── routers
│   └── router.go
└── tests
```

### 5 Configuraciones Al API

#### 5.1 Especificar el esquema en el proyecto.


Para esto, editamos el archivo `test_api/conf/app.conf` agregar lo siguiente:
```bash
&search_path=nombre_de_tu_schema
```

> Código Original:
```golang
sqlconn = postgres://postgres:postgres@127.0.0.1/bd_oas?sslmode=disable
```

> Código incorporando configuración:
```golang
sqlconn = postgres://postgres:postgres@127.0.0.1/bd_oas?sslmode=disable&search_path=public
```

#### 5.2 Especificamos el auto incremental del id en los modelos.

En el archivo `test_api/models/usuario.go`

> Código original:
```golang
type Usuario struct {
  Id       int    `orm:"column(id);pk"`
  Nombre   string `orm:"column(nombre)"`
  Apellido string `orm:"column(apellido);null"`
}
```

> Código incorporando configuración:
```golang
type Usuario struct {
  Id       int    `orm:"column(id);pk;auto"`
  Nombre   string `orm:"column(nombre)"`
  Apellido string `orm:"column(apellido);null"`
}
```

#### 5.3 Configurar CORS

Esta configuración permitirá que los servicios sean consumibles desde un navegador web.   
Editar el archivo `main.go`

>Código original:
```golang
func main() {
  orm.RegisterDataBase("default", "postgres", beego.AppConfig.String("sqlconn"))
  if beego.BConfig.RunMode == "dev" {
  	beego.BConfig.WebConfig.DirectoryIndex = true
  	beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
  }
  beego.Run()
}
```

##### 5.3.1 En el `import()` agregamos lo siguiente
```bash
"github.com/astaxie/beego/plugins/cors"
```
##### 5.3.2 En la Funcion `func main()` agregamos lo siguiente
```golang
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
```
##### 5.3.3 logs BD
Si le interesa ver en el log de la api las consultas SQL que realiza, agregar al inicio del `main` la siguiente linea:
```golang
orm.Debug = true
```

> Código incorporando configuración:

Al final tendremos la funcion `main` de la siguieten forma:

```golang
func main() {
  orm.Debug = true
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

  beego.Run()
}
```

#### 5.4. Especificar la relacion llave foranea (FK) en Servicios

En el archivo `./models/rol.go` debemos especificar la funcion `RelatedSel()` que en modelo de BD es la **llave foranea** (FK).

> Código original
```golang
func GetAllRol(query map[string]string, fields []string, sortby []string, order []string,
	offset int64, limit int64) (ml []interface{}, err error) {
	o := orm.NewOrm()
	qs := o.QueryTable(new(Rol))
...
```

> Código incorporando configuración RelatedSel()
```golang
func GetAllRol(query map[string]string, fields []string, sortby []string, order []string,
	offset int64, limit int64) (ml []interface{}, err error) {
	o := orm.NewOrm()
	qs := o.QueryTable(new(Rol)).RelatedSel()
...
```

### 6. Ejecutar API Beego

Ubicado en la raíz del proyecto
```bash
cd ~/go/src/github.com/TuUsuarioGithub/test_api
```
Ejecutra
```bash
bee run
```

Ejecutra y Generar Documentación
```bash
bee run -downdoc=true -gendoc=true
```

### 7. Consumir los servicios

#### Consumir el servicio de las entidades desde un navegador
```bash
# Entidad Usuario: Abrir navegador he ingresar a:
127.0.0.1:8080/v1/usuario

# Entidad Rol: Abrir navegador he ingresar a:
127.0.0.1:8080/v1/rol
```

#### Visualizar el Documentación de swagger:
```bash
# Abrir navegador he ingresar
127.0.0.1:8080/swagger/
```
