# Configuración de `app.conf`

Este archivo contiene la configuración principal para la API CRUD de Ágora. Los valores utilizan variables de entorno para facilitar la parametrización en diferentes entornos (desarrollo, pruebas, producción).

## Parámetros

| Clave           | Descripción                                      | Variable de entorno / Valor por defecto         |
|-----------------|--------------------------------------------------|-------------------------------------------------|
| appname         | Nombre de la aplicación                          | Nombre del repositorio en GitHub                |
| httpport        | Puerto HTTP en el que se expone la API           | ${AGORA_API_CRUD_HTTPPORT}                      |
| runmode         | Modo de ejecución (dev, prod)                    | ${AGORA_API_CRUD_HTTPPORT\|prod}                |
| parameterStore  | Origen parámetros externos (solo para APIs CRUD) | ${PARAMETER_STORE}                              |
| PGuser          | Usuario de la base de datos PostgreSQL           | ${AGORA_API_CRUD_PGUSER}                        |
| PGpass          | Contraseña de la base de datos PostgreSQL        | ${AGORA_API_CRUD_PGPASS}                        |
| PGhost          | Host de la base de datos PostgreSQL              | ${AGORA_API_CRUD_PGHOST}                        |
| PGport          | Puerto de la base de datos PostgreSQL            | ${AGORA_API_CRUD_PGPORT}                        |
| PGdb            | Nombre de la base de datos PostgreSQL            | ${AGORA_API_CRUD_PGDB}                          |
| PGschema        | Esquema de la base de datos PostgreSQL           | ${AGORA_API_CRUD_PGSCHEMA}                      |

## Ejemplo de uso

```properties
appname = agora_api_crud
httpport = ${AGORA_API_CRUD_HTTPPORT}
runmode = ${AGORA_API_CRUD_HTTPPORT|prod}
autorender = false
copyrequestbody = true
EnableDocs = true
parameterStore = ${PARAMETER_STORE}
PGuser=${AGORA_API_CRUD_PGUSER}
PGpass=${AGORA_API_CRUD_PGPASS}
PGhost=${AGORA_API_CRUD_PGHOST}
PGport=${AGORA_API_CRUD_PGPORT}
PGdb=${AGORA_API_CRUD_PGDB}
PGschema=${AGORA_API_CRUD_PGSCHEMA}
```

> **Nota:** Asegúrate de definir las variables de entorno necesarias antes de iniciar la aplicación.
