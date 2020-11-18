# Versionar BD en API Beego (Beego Migrations)
Este proceso se realiza solo para apis de tipo CRUD

## Requerimientos
1. [Generar API Beego](generar_api.md)
2. [Refactorizar API Beego (Contol de Errores)](control_error_json_crud.md)


## 1. Generar Migración
Desde la raíz del api correr el comando `bee generate migration nombre_fichero`
```bash
# Ejemplo comando
bee generate migration nombre_fichero
```
```bash
bee generate migration crear_tabla_usuario_rol
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.12.0
2020/11/17 16:05:47 INFO     ▶ 0001 Using 'crear_tabla_usuario_rol' as migration name
 create	 /home/jjvargass/go/src/github.com/udistrital/test_api_crud/database/migrations/20201117_160547_crear_tabla_usuario_rol.go
2020/11/17 16:05:47 SUCCESS  ▶ 0002 Migration successfully generated!
```
### 1.1 Se creará el directorio `database/migrations`   
```bash
tree
.
├── conf
│   └── app.conf
├── controllers
│   ├── rol.go
│   └── usuario.go
├── database
│   └── migrations
│       └── 20201117_160547_crear_tabla_usuario_rol.go
├── lastupdate.tmp
├── main.go
├── models
│   ├── rol.go
│   └── usuario.go
├── README.md
├── routers
│   └── router.go
├── test_api_crud
└── tests
```
### 1.2 Arvhivo de migración
Dentro de `database/migrations` existira el archivo `fecha_nombre_fichero.go` con el siguietne contenido:

```golang
package main

import (
	"github.com/astaxie/beego/migration"
)

// DO NOT MODIFY
type CrearTablaUsuarioRol_20201117_160547 struct {
	migration.Migration
}

// DO NOT MODIFY
func init() {
	m := &CrearTablaUsuarioRol_20201117_160547{}
	m.Created = "20201117_160547"

	migration.Register("CrearTablaUsuarioRol_20201117_160547", m)
}

// Run the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update

}

// Reverse the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update

}
```

## 2. Personalizar Migracion
En este apartado se mostrará las formas de personalizar las migraciones

### 2.1 A partir de un archivos .sql
En este apartado se relacionará en las funciones `Up()` y `Down()` script sql que consolidarán la migraciona.

#### 2.1.1 Crear carpeta scripts con los fuentes para funcion Up y Down
Se crearán dos archivos con el mismo nombre de la migración pero en al final agregar el segmento `_up` y `_down` para especificar que funciona en la migracion lo implementará.
```bash
├── conf
│   └── app.conf
├── controllers
│   ├── rol.go
│   └── usuario.go
├── database
│   ├── migrations
│   │   └── 20201117_160547_crear_tabla_usuario_rol.go
│   └── scripts
│       ├── 20201117_160547_crear_tabla_usuario_rol_down.sql
│       └── 20201117_160547_crear_tabla_usuario_rol_up.sql
```
##### Archivo 20201117_160547_crear_tabla_usuario_rol_up.sql
El contenido de este arvhivo esta dado por el sql que dio origen en la creación de la api en el capitulo anterior [Generar API Beego](generar_api.md).   
[SQL usuario rol](/generacion_de_apis/bd/usuario_rol.sql)
```sql
CREATE TABLE public.usuario (
	id serial NOT NULL,
	nombre varchar NOT NULL,
	apellido varchar,
	CONSTRAINT pk_usuario PRIMARY KEY (id)

);
ALTER TABLE public.usuario OWNER TO postgres;


CREATE TABLE public.rol (
	id serial NOT NULL,
	aplicacion varchar NOT NULL,
	usuario_id integer NOT NULL,
	CONSTRAINT pk_rol PRIMARY KEY (id)

);
ALTER TABLE public.rol OWNER TO postgres;

ALTER TABLE public.rol ADD CONSTRAINT fk_rol_usuario FOREIGN KEY (usuario_id)
REFERENCES public.usuario (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
```
##### Archivo 20201117_160547_crear_tabla_usuario_rol_down.sql
El contenido de esta archivo, realizará una eliminación de los elementos creados en la uncion `Up()`en caso de que algo salga mal a manera de  un rolback.
```sql
DROP TABLE IF EXISTS public.usuario CASCADE;
DROP TABLE IF EXISTS public.rol CASCADE;
```
#### 2.1.2 Llamado de archivo sql en funciones `Up()` y `Down()`

##### Función `Up()`
Editamos el archivo `database/migrations/20201117_160547_crear_tabla_usuario_rol.go`   
En la funcion `Up()` para referenciar el archivo .sql
```go
file, err := ioutil.ReadFile("../scripts/20201117_160547_crear_tabla_usuario_rol_up.sql")

if err != nil {
  // handle error
  fmt.Println(err)
}

requests := strings.Split(string(file), ";")

for _, request := range requests {
  fmt.Println(request)
  m.SQL(request)
  // do whatever you need with result and error
}
```

> Código Original:
```go
// Run the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update

}
```


> Código incorporando modificaciones:
```go
// Run the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update
	file, err := ioutil.ReadFile("../scripts/20201117_160547_crear_tabla_usuario_rol_up.sql")

	if err != nil {
		// handle error
		fmt.Println(err)
	}

	requests := strings.Split(string(file), ";")

	for _, request := range requests {
		fmt.Println(request)
		m.SQL(request)
		// do whatever you need with result and error
	}

}
```

##### Función `Down()`
```go

```

### 2.2 Directamente Sql en funcion `Up()` y `Down()`

Modificar las funciones **Up()** y **Down()** de acuerdo a la necesidad.
```golang
// Run the migrations
func (m *CrearSchema_20190614_203240) Up() {
  // use m.SQL("CREATE TABLE ...") to make schema update
  m.SQL("CREATE SCHEMA convenios AUTHORIZATION nombre_usuario;")
}
// Reverse the migrations
func (m *CrearSchema_20190614_203240) Down() {
    // use m.SQL("DROP TABLE ...") to reverse schema update
      	m.SQL("DROP SCHEMA convenios;")
}
```
3. Una vez creados todos los ficheros necesarios,  correr el comando:
```bash
bee migrate -driver=postgres -conn="postgres://my_user:my_pass@my_host:my_port/my_db?sslmode=disable&search_path=nombre_schema"
```
## Recomendaciones

- Tener en cuenta la fecha de creación de los ficheros, el orden de migración esta dado por esta fecha.  
Ejemplo:

  Se crean los siguientes ficheros:

  - 20190614_203255_crear_tabla_convenio.go
  - 20190614_203240_crear_schema.go
  - 20190614_203530_crear_tabla_pais_categoria.go

  En el ejemplo anterior, el orden de migración es:

  - 20190614_203240_crear_schema.go
  - 20190614_203255_crear_tabla_convenio.go
  - 20190614_203530_crear_tabla_pais_categoria.go


- Nombrar los ficheros de acuerdo a la acción a realizar:
```bash
bee generate migration crear_schema
bee generate migration crear_nombre_tabla
bee generate migration modificar_nombre_tabla
bee generate migration ingresar_registro_nombre_tabla
```
- Siempre registrar la función **Down()** para evitar inconsistencias
- Al realizar los despliegues por medio del sistema IC, se realiza reset de la migración, los datos que no se encuentren en los ficheros serán eliminados
- Solo se realizara la migración en los entornos de desarrollo y pruebas
