# nombrerepo_crud

descripción repositorio o proposito - descripción repositorio o proposito -  descripción repositorio o proposito -  descripción repositorio o proposito -

## Especificaciones Técnicas

### Tecnologías Implementadas y Versiones
* [Golang](https://github.com/udistrital/introduccion_oas/blob/master/instalacion_de_herramientas/golang.md)
* [BeeGo](https://github.com/udistrital/introduccion_oas/blob/master/instalacion_de_herramientas/beego.md)

### Instalación
```shell
# Opción 1
go get github.com/udistrital/novedades_crud
```

```shell
# Opción 2

# clonar el proyecto en la carpeta local go/src/github.com/udistrital
cd go/src/github.com/udistrital

# clonar repo
git clone https://github.com/udistrital/novedades_crud.git

#  Ir a la carpeta del proyecto
cd novedades_crud

# Instalar dependencias del proyecto
go get
```

### Variables de Entorno
```bash
NOVEDADES_CRUD__PGDB=[nombre de la base de datos]
NOVEDADES_CRUD__PGPASS=[password del usuario]
NOVEDADES_CRUD__PGURLS=[direccion de la base de datos]
NOVEDADES_CRUD__PGUSER=[usuario con acceso a la base de datos]
NOVEDADES_CRUD__PGSCHEMA=[esquema donde se ubican las tablas]
NOVEDADES_HTTP_PORT=[puerto de ejecucion] bee run
```

### Ejecución del Proyecto
```bash
# Ubicado en la raíz del proyecto, ejecutar:
NOVEDADES_CRUD__PGDB=XXX NOVEDADES_CRUD__PGPASS=XXX NOVEDADES_CRUD__PGURLS=XXX NOVEDADES_CRUD__PGUSER=XXX NOVEDADES_CRUD__PGSCHEMA=XXX NOVEDADES_HTTP_PORT=XXX bee run
```
```shell
# Ejecutar con la opción documental de swagger
NOVEDADES_CRUD__PGDB=XXX NOVEDADES_CRUD__PGPASS=XXX NOVEDADES_CRUD__PGURLS=XXX NOVEDADES_CRUD__PGUSER=XXX NOVEDADES_CRUD__PGSCHEMA=XXX NOVEDADES_HTTP_PORT=XXX bee run -downdoc=true -gendoc=true
```

### Puertos
El servidor se expone por defecto en el puerto 8080:
```shell
http://localhost:8080
```

### EndPoints swagger
Para ver la documentación de los servicios:
```shell
http://localhost:8080/swagger/
```
**Nota**: *En el swagger sale un error, hacer caso omiso.*


### Modelo de Datos
Modelo de datos API crud novedades
![novedades_crud_MD](https://user-images.githubusercontent.com/28914781/65917368-d0438500-e39c-11e9-8831-c13f4048309f.png)


## Licencia

This file is part of nombrerepo_crud.

nombrerepo_crud is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Foobar is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/.
