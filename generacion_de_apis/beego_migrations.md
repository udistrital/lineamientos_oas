# Versionar BD en API Beego (Beego Migrations)
Este proceso se realiza solo para apis de tipo CRUD

## Requerimientos
1. [Generar API Beego](generar_api.md)
2. [Refactorizar API Beego (Contol de Errores)](control_error_json_crud.md)


## 1. Generar Migración
Desde la raíz del api correr el comando `bee generate migration nombre_fichero`
```bash
# Estructura de comando
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

CREATE TABLE public.rol (
	id serial NOT NULL,
	aplicacion varchar NOT NULL,
	usuario_id integer NOT NULL,
	CONSTRAINT pk_rol PRIMARY KEY (id)

);

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
Editamos el archivo `database/migrations/20201117_160547_crear_tabla_usuario_rol.go`   
En la funcion `Down()` para referenciar el archivo .sql
```go
file, err := ioutil.ReadFile("../scripts/20201117_160547_crear_tabla_usuario_rol_down.sql")

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
// Reverse the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update

}
```

> Código incorporando modificaciones:

```go
// Reverse the migrations
func (m *CrearTablaUsuarioRol_20201117_160547) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update
	file, err := ioutil.ReadFile("../scripts/20201117_160547_crear_tabla_usuario_rol_down.sql")

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
#### 2.1.3 Correr migración
```bash
# Estructura de comando
bee migrate -driver=postgres -conn="postgres://my_user:my_pass@my_host:my_port/my_db?sslmode=disable&search_path=nombre_schema"
```
La cadea de conexion especificada en la variable `conn` es la misma que se encuentra definida en el archivo `conf/app.conf` del api.
```bash
bee migrate --driver=postgres -conn="postgres://postgres:1234@127.0.0.1/bd_oas?sslmode=disable&search_path=public"
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.12.0
2020/11/18 08:37:30 INFO     ▶ 0001 Using 'postgres' as 'driver'
2020/11/18 08:37:30 INFO     ▶ 0002 Using '/home/jjvargass/go/src/github.com/udistrital/test_api_crud/database/migrations' as 'dir'
2020/11/18 08:37:30 INFO     ▶ 0003 Running all outstanding migrations
2020/11/18 08:37:30 INFO     ▶ 0004 Creating 'migrations' table...
2020/11/18 08:37:33 INFO     ▶ 0005 |> 2020/11/18 08:37:31.383 [I]  start upgrade CrearTablaUsuarioRol_20201117_160547
2020/11/18 08:37:33 INFO     ▶ 0006 |> CREATE TABLE public.usuario (
2020/11/18 08:37:33 INFO     ▶ 0007 |> 	id serial NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0008 |> 	nombre varchar NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0009 |> 	apellido varchar,
2020/11/18 08:37:33 INFO     ▶ 0010 |> 	CONSTRAINT pk_usuario PRIMARY KEY (id)
2020/11/18 08:37:33 INFO     ▶ 0011 |> )
2020/11/18 08:37:33 INFO     ▶ 0012 |> CREATE TABLE public.rol (
2020/11/18 08:37:33 INFO     ▶ 0013 |> 	id serial NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0014 |> 	aplicacion varchar NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0015 |> 	usuario_id integer NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0016 |> 	CONSTRAINT pk_rol PRIMARY KEY (id)
2020/11/18 08:37:33 INFO     ▶ 0017 |> )
2020/11/18 08:37:33 INFO     ▶ 0018 |> ALTER TABLE public.rol ADD CONSTRAINT fk_rol_usuario FOREIGN KEY (usuario_id)
2020/11/18 08:37:33 INFO     ▶ 0019 |> REFERENCES public.usuario (id) MATCH FULL
2020/11/18 08:37:33 INFO     ▶ 0020 |> ON DELETE NO ACTION ON UPDATE NO ACTION
2020/11/18 08:37:33 INFO     ▶ 0021 |> 2020/11/18 08:37:31.384 [I]  exec sql: CREATE TABLE public.usuario (
2020/11/18 08:37:33 INFO     ▶ 0022 |> 	id serial NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0023 |> 	nombre varchar NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0024 |> 	apellido varchar,
2020/11/18 08:37:33 INFO     ▶ 0025 |> 	CONSTRAINT pk_usuario PRIMARY KEY (id)
2020/11/18 08:37:33 INFO     ▶ 0026 |> )
2020/11/18 08:37:33 INFO     ▶ 0027 |> 2020/11/18 08:37:31.391 [I]  exec sql:
2020/11/18 08:37:33 INFO     ▶ 0028 |> CREATE TABLE public.rol (
2020/11/18 08:37:33 INFO     ▶ 0029 |> 	id serial NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0030 |> 	aplicacion varchar NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0031 |> 	usuario_id integer NOT NULL,
2020/11/18 08:37:33 INFO     ▶ 0032 |> 	CONSTRAINT pk_rol PRIMARY KEY (id)
2020/11/18 08:37:33 INFO     ▶ 0033 |> )
2020/11/18 08:37:33 INFO     ▶ 0034 |> 2020/11/18 08:37:31.396 [I]  exec sql:
2020/11/18 08:37:33 INFO     ▶ 0035 |> ALTER TABLE public.rol ADD CONSTRAINT fk_rol_usuario FOREIGN KEY (usuario_id)
2020/11/18 08:37:33 INFO     ▶ 0036 |> REFERENCES public.usuario (id) MATCH FULL
2020/11/18 08:37:33 INFO     ▶ 0037 |> ON DELETE NO ACTION ON UPDATE NO ACTION
2020/11/18 08:37:33 INFO     ▶ 0038 |> 2020/11/18 08:37:31.398 [I]  exec sql:
2020/11/18 08:37:33 INFO     ▶ 0039 |> 2020/11/18 08:37:31.400 [I]  end upgrade: CrearTablaUsuarioRol_20201117_160547
2020/11/18 08:37:33 INFO     ▶ 0040 |> 2020/11/18 08:37:31.400 [I]  total success upgrade: 1  migration
2020/11/18 08:37:33 SUCCESS  ▶ 0041 Migration successful!
```

### 2.2 Directamente Sql en funcion `Up()` y `Down()`
Para migraciones en las que los cambios definidos en sql no requieren bastante lineas, se aconseja que se realicen directamente en un string definido en la función `SQL` del org de beego.   
```bash
 bee generate migration crear_tabla_pais
```
Se crea nuevos archivo de migracion
```bash
├── database
│   ├── migrations
│   │   ├── 20201117_160547_crear_tabla_usuario_rol.go
│   │   └── 20201118_093359_crear_tabla_pais.go

```
Archivo 20201118_093359_crear_tabla_pais.go
```go
package main

import (
	"github.com/astaxie/beego/migration"
)

// DO NOT MODIFY
type CrearTablaPais_20201118_093359 struct {
	migration.Migration
}

// DO NOT MODIFY
func init() {
	m := &CrearTablaPais_20201118_093359{}
	m.Created = "20201118_093359"

	migration.Register("CrearTablaPais_20201118_093359", m)
}

// Run the migrations
func (m *CrearTablaPais_20201118_093359) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update

}

// Reverse the migrations
func (m *CrearTablaPais_20201118_093359) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update

}
```
Modificar las funciones `Up()` y `Down()` de acuerdo a la necesidad.
```go
// Run the migrations
func (m *CrearTablaPais_20201118_093359) Up() {
	// use m.SQL("CREATE TABLE ...") to make schema update
	m.SQL("CREATE TABLE  public.pais(id serial NOT NULL,nombre varchar NOT NULL)")
}

// Reverse the migrations
func (m *CrearTablaPais_20201118_093359) Down() {
	// use m.SQL("DROP TABLE ...") to reverse schema update
	m.SQL("DROP TABLE IF EXISTS public.pais")
}
```

Una vez creados todos los ficheros necesarios,  correr el comando:
```bash
# Estructura de comando
bee migrate -driver=postgres -conn="postgres://my_user:my_pass@my_host:my_port/my_db?sslmode=disable&search_path=nombre_schema"
```

```bash
bee migrate --driver=postgres -conn="postgres://postgres:1234@127.0.0.1/bd_oas?sslmode=disable&search_path=public"
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.12.0
2020/11/18 09:42:56 INFO     ▶ 0001 Using 'postgres' as 'driver'
2020/11/18 09:42:56 INFO     ▶ 0002 Using '/home/jjvargass/go/src/github.com/udistrital/test_api_crud/database/migrations' as 'dir'
2020/11/18 09:42:56 INFO     ▶ 0003 Running all outstanding migrations
2020/11/18 09:42:59 INFO     ▶ 0004 |> 2020/11/18 09:42:57.559 [I]  start upgrade CrearTablaPais_20201118_093359
2020/11/18 09:42:59 INFO     ▶ 0005 |> 2020/11/18 09:42:57.559 [I]  exec sql: CREATE TABLE  public.pais(id serial NOT NULL,nombre varchar NOT NULL)
2020/11/18 09:42:59 INFO     ▶ 0006 |> 2020/11/18 09:42:57.564 [I]  end upgrade: CrearTablaPais_20201118_093359
2020/11/18 09:42:59 INFO     ▶ 0007 |> 2020/11/18 09:42:57.564 [I]  total success upgrade: 1  migration
2020/11/18 09:42:59 SUCCESS  ▶ 0008 Migration successful!
```

## 3. Recomendaciones

### 3.1  Fecha de creación
Tener en cuenta la fecha de creación de los ficheros, el orden de migración esta dado por esta fecha.  
Ejemplo:

Se crean los siguientes ficheros:
```bash
20190614_203255_crear_tabla_convenio.go
20190614_203240_crear_schema.go
20190614_203530_crear_tabla_pais_categoria.go
```
En el ejemplo anterior, el orden de migración es:
```bash
20190614_203240_crear_schema.go
20190614_203255_crear_tabla_convenio.go
20190614_203530_crear_tabla_pais_categoria.go
```
### 3.2  Nombramiento de ficheros
Nombrar los ficheros de acuerdo a la acción a realizar:
```bash
bee generate migration crear_schema
bee generate migration crear_nombre_tabla
bee generate migration modificar_nombre_tabla
bee generate migration ingresar_registro_nombre_tabla
```

### 3.3  Consistencia de la migración
- Siempre registrar la función `Down()` para evitar inconsistencias.
- Al realizar los despliegues por medio del sistema de integracion continua (CI), se lleva un control o version de las migraciones ejecutadas, al suceder un error en el `pipeline` se realiza reset de la migración, controlando los eventos ejecutados y la version estable de la Base de datos.
- Solo se realizara la migración en los entornos de desarrollo (develop) y pruebas (release)


## Tomado de:
[produccion_academica_crud](https://github.com/udistrital/produccion_academica_crud/tree/master/database)
