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

### 2.1 Archivos .sql

### 2.2 Sql

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
