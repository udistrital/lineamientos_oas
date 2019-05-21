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

  - opción 2.1: Puede ejecutar el sql [adjunto](/generacion_de_apis/bd/usuario_rol.sql)

    ```bash
     psql -U postgres -d bd_oas -a -f usuario_rol.sql
    ```

  - opción 2.2: puedes exportar el [modelo dbm desde](/generacion_de_apis/bd/usuario_rol.dbm) en pgModeler


3. Crear directorio para proyecto Beego

    ```bash
    cd ~/go/src/github.com/ && mkdir TuUsuarioGithub
    ```

    Ingrer al directorio

    ```bash
    cd ~/go/src/github.com/TuUsuarioGithub
    ```

4. Crear API

  ```bash
  bee api testApi -driver=postgres -conn=postgres://MyUsuarioBD:MyPassDB@127.0.0.1/bd_oas?sslmode=disable
  ```

    Se Creara un directorio llamado testApi con los archivo correspondiente a la api.

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

  Especificar el esquema en el proyecto. Para esto, editamos el archivo **testApi/conf/app.conf** agregamos lo siguiente:

  ```bash
  &search_path=nombre_de_tu_schema
  ```

  - Código original:

    ```golang
    sqlconn = postgres://postgres:postgres@127.0.0.1/bd_oas?sslmode=disable
    ```

  - Ajuste:

    ```golang
    sqlconn = postgres://postgres:postgres@127.0.0.1/bd_oas?sslmode=disable&search_path=public
    ```

  Especificamos el auto incremental del id en los modelos.

  Ejemplo: En el archivo **testApi/models/usuario.go**

  - Código original:

    ```golang
    type Usuario struct {
      Id       int    `orm:"column(id);pk"`
      Nombre   string `orm:"column(nombre)"`
      Apellido string `orm:"column(apellido);null"`
    }
    ```

  - Ajuste:

    ```golang
    type Usuario struct {
      Id       int    `orm:"column(id);pk;auto"`
      Nombre   string `orm:"column(nombre)"`
      Apellido string `orm:"column(apellido);null"`
    }
    ```

5. Configurar cors

    Esta configuración permitirá que los servicios sean consumibles desde un navegador web

  - Código original:

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

  - En el import() agregamos lo siguiente

    ```golang
    "github.com/astaxie/beego/plugins/cors"
    ```

  - En la Funcion func main() agregamos lo siguiente

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

  - Si le interesa ver en el log de la api las consultas SQL que realiza, agregar al inicio del main la siguiente linea:

    ```golang
    orm.Debug = true
    ```

  - Al final tendremos la funcion main de la siguieten forma:

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

6. Especificar la relacion Fk en Servicios

    En el archivo **./models/rol.go** debemos especificar la funcion **RelatedSel()**

    - Código original

    ```golang
    func GetAllRol(query map[string]string, fields []string, sortby []string, order []string,
    	offset int64, limit int64) (ml []interface{}, err error) {
    	o := orm.NewOrm()
    	qs := o.QueryTable(new(Rol))
    ...
    ```
    - Ajuste .RelatedSel()

    ```golang
    func GetAllRol(query map[string]string, fields []string, sortby []string, order []string,
    	offset int64, limit int64) (ml []interface{}, err error) {
    	o := orm.NewOrm()
    	qs := o.QueryTable(new(Rol)).RelatedSel()
    ...
    ```

7. Generar Documentación

  Ubicado en la raíz del proyecto

  ```bash
  cd ~/go/src/github.com/TuUsuarioGithub/testApi
  ```

    Ejecutra

  ```bash
  bee run -downdoc=true -gendoc=true
  ```

8. Consumir los servicios

    Abrir navegador he ingresar 127.0.0.1:8080/v1/usuario

    Visualizar el Documentación de swagger:

    Abrir navegador he ingresar 127.0.0.1:8080/swagger/
