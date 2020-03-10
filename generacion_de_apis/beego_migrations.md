# Migrar Modelo de API a BD Nuevas con Beego Migrations

Este proceso se realiza solo para apis de tipo CRUD


1. Desde la raíz del api correr el comando **bee generate migration nombre_fichero**
```bash
bee generate migration nombre_fichero
```
Se genera el fichero en **database/migrations** con la siguiente estructura como nombre **fecha_nombre_fichero.go** y el siguiente contenido:
```golang
package main
import ("github.com/astaxie/beego/migration")
  // DO NOT MODIFY
  type CrearSchema_20190614_203240 struct {
     migration.Migration
   }
   // DO NOT MODIFY
   func init() {
      m := &CrearSchema_20190614_203240{}
      m.Created = "20190614_203240"
      migration.Register("CrearSchema_20190614_203240", m)
    }
    // Run the migrations
    func (m *CrearSchema_20190614_203240) Up() {
       // use m.SQL("CREATE TABLE ...") to make schema update
     }
     // Reverse the migrations
     func (m *CrearSchema_20190614_203240) Down() {
     // use m.SQL("DROP TABLE ...") to reverse schema update
     }
```
2. Modificar las funciones **Up()** y **Down()** de acuerdo a la necesidad.
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
