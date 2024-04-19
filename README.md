# Lineamientos OATI :eyeglasses:

Este repositorio es un conglomerado de buenas prácticas, lineamientos, configuraciones a realizar en el entorno de desarrollo de las nuevas tecnologías de la Oficina Asesora de Tecnologías e Información (OATI)

***
## 1. Instalación de Herramientas :wrench:

> ### En PC Local :computer:
- [Instalación Golang](/instalacion_de_herramientas/golang.md)
- [Instalación Beego y Bee](/instalacion_de_herramientas/beego.md)
- [Instalación Postgres](/instalacion_de_herramientas/postgres.md)
- [Instalación pgAdmin3](/instalacion_de_herramientas/pgadmin3.md)
- [Instalación pgModeler](/instalacion_de_herramientas/pgmodeler.md)
- [Instalación Oh My ZSH](/instalacion_de_herramientas/oh_my_zsh.md)

> ### En Ambiente Dockerizado :whale:
- [lineamiento](/ambientes_dockerizados/dockerizacion.md)

***
## 2. Repositorios Institucionales :herb:

- [Nombres para Repositorios](/repositorios_institucionales/nombre_repos.md)
- [Lineamiento y Metodología para Branches](/repositorios_institucionales/nombre_branch.md)
- [Contenido README](/repositorios_institucionales/contenido_readme.md)
- [Limpieza de Branches](/repositorios_institucionales/limpieza_branch.md)
- [Etiquetas en comentarios de Commits](/repositorios_institucionales/etiqueta_commits.md)
- [.gitignore](/repositorios_institucionales/gitignore.md)

***
## 3. Arquitectura de Aplicaciones :bank:

La arquitectura definida para los sistemas en desarrollo en la OAS es módelo por microservicios.

### Microservicios

- [Definición](https://github.com/udistrital/arquitectura_docs/tree/master/aplicaciones#micro-servicios-que-son)
- [Lineamientos](https://github.com/udistrital/arquitectura_docs/tree/master/aplicaciones#lineamientos-generales-de-arquitectura)

### Microclientes
- [Introducción](/single_spa/single_spa.md)
- [Root](/single_spa/root_config.md)
- [Parcel](/single_spa/parcel.md)
- [Core](/single_spa/core.md)
- [Shared](/single_spa/shared.md)


***
## 4. Modelos de Datos :floppy_disk:

- [Lineamientos](/modelo_de_datos/estandar.md)

***
## 5. APIS Beego :mortar_board:

> ### Generación API CRUD

Los API CRUDs son servicios RESTful desarrollados en Go utilizando el framework API Beego. Están diseñados para realizar operaciones CRUD (`Crear`, `Leer`, `Actualizar`, `Eliminar`) en la base de datos y proporcionar una interfaz de acceso a datos para los microservicios (API MIDs). El criterio para dividir el proyecto en CRUDs es el siguiente:

1. **Entidades de Dominio**: Cada CRUD se encarga de la gestión de una o varias entidades de dominio específicas. Por ejemplo, usuarios, asignaturas, proyectos, etc.

2. **Operaciones CRUD**: Los CRUDs proporcionan endpoints RESTful para realizar operaciones CRUD en las entidades de dominio correspondientes. Es importante recordar que por temas de auditoria y trazalabilidad la operación DELETE, no se realiza como tal, en lugar de esto se debe realizar un borrado lógico, inactivando el registro correspondiente.

3. **Interacción con Microservicios**: Los CRUDs son consumidos por los microservicios (micro_mids) para acceder y manipular datos de manera eficiente, para permitir la generación de funcionalidades complejas y encapsular procesos de acuerdo con las necesidades de negocio.

A continuación se detalla a nivel técnico el estandar definido para este tipo de APIs:

- [Generar API Beego](/generacion_de_apis/generar_api.md)
- [Refactorizar API Beego (Contol de Errores)](/generacion_de_apis/control_error_json_crud.md)
- [Versionar BD en API Beego (Beego Migrations)](/generacion_de_apis/beego_migrations.md)
- [Variables de Entorno en API Beego (Beego Migrations)](/generacion_de_apis/variables_en_api.md)
- [(health check) validación de estado en APIs](/generacion_de_apis/endpoint_validacions.md)

> ### Generación API MID

Los microservicios (micro_mids) son componentes desarrollados en Go y están diseñados para manejar lógica de negocio específica y orquestar interacciones con los CRUDs correspondientes. El criterio para dividir el proyecto en microservicios se basa en:

1. **Dominio de Negocio**: Cada microservicio se centra en un área específica del dominio de negocio. Por ejemplo, gestión de periodos, registro de notas, etc.

2. **Acoplamiento Bajo**: Se busca minimizar la dependencia entre microservicios para promover la escalabilidad y la independencia del ciclo de vida.

3. **Funcionalidad Coherente**: Los microservicios se definen en función de la funcionalidad coherente que ofrecen y los recursos que consumen.

4. **Interacción con CRUDs**: Los micro_mids interactúan con los CRUDs correspondientes para acceder y manipular datos de manera eficiente.

A nivel técnico podemos ver al forma esperada de realizar su implementación:

- [Generar API MID](/generacion_de_apis/create_api_mid.md)
- [Lógica Orientada a Funciones en API MID](/generacion_de_apis/logica_orientada_a_funciones.md)
- [Refactorizar API MID (Control de Errores)](/generacion_de_apis/control_error_json_mid.md)

> ### Generación Reglas de Negocio (RULE)
- [Generar Reglas de Negocio-(Falta)]()

> ### Configuraciones Adicionales y Utilidades
- [Generar Logs en API Beego](/generacion_de_apis/logs_api.md)
- [Migrar Modelo de API a bd Nuevas](/generacion_de_apis/migrar.md)
- [Refactorizar APIs MID y CRUD (Monitoreo de APIs con AWS X-Ray)](/generacion_de_apis/AWS_XRay.md)

> ### Plantillas para la creación de APIS GO
- [Creación API MID en GO con Hygen](https://github.com/udistrital/plantilla_api_mid)
- [Creación API CRUD en GO con Hygen](https://github.com/udistrital/plantilla_api_crud)


## 5.1. Pruebas Unitarias API Beego :mag:

- [Lineamientos](/pruebas_unitarias_api_beego/unit_test_beego.md)

> ### Pruebas Unitarias API CRUD
- [Pruebas Unitarias en API CRUD](/pruebas_unitarias_api_beego/crud_test.md)

> ### Pruebas Unitarias API MID
- [Paso de Parametros en Test API MID](/pruebas_unitarias_api_beego/paso_parametro_test_mid.md)
- [Smoke Testing API MID](/pruebas_unitarias_api_beego/smoke_test_mid.md)

***
## 6. APIS NestJS (NEW)
> ### Generación API
- [Generar API NestJS](/api_nest/api_nest.md)
- [Variables de Entorno API NestJS](/api_nest/XX.md)
- [(health check) validación de estado en APIs](/api_nest/XX.md)
- [Pruebas Unitarias](/api_nest/XX.md)

***
## 7. Clientes Angular nuevos

- [Lineamientos](/clientes_nuevos/clientes_nuevos.md)
- [Plantilla para creación de Cliente en AngularJS y TypeScript](https://github.com/udistrital/plantilla_cliente_oas)

<!-- ***
## 7.1 Pruebas Unitarias de Clientes Angular

- Lineamientos
-->

***
## 8. Despliegues
- [Lineamientos (Actualizar)](/despliegues/lineamientos.md)

***
## 9. Aseguramiento de la Calidad (QA) y Seguridad Informática

### Aseguramiento de la Calidad (QA)

> #### Pruebas Funcionales
- [Pruebas unitarias (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-unitarias)
- [Pruebas de humo (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-humo)
- [Pruebas de componentes](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-componentes)
- [Pruebas de integración](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-integración)
- [Pruebas de regresión](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-regresión)
- [Pruebas de cordura](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-cordura)
- [Pruebas de aceptación (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa.md#pruebas-de-aceptación)

> #### Pruebas No Funcionales
- [Pruebas de carga (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa_no_funcional.md)
- [Pruebas de estrés (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa_no_funcional.md)
- [Pruebas de volumen](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa_no_funcional.md)
- [Pruebas de configuración (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa_no_funcional.md)
- [Pruebas de seguridad (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/qa_no_funcional.md)

### Seguridad Informática

> #### Evaluacion de vulnerabilidades
- [Evaluacion de vulnerabilidades (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#evaluacion-de-vulnerabilidades)
- [Análisis de codigo estático (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#anállisis-de-código-estatico)
- [Implementar evaluaciones periódicas (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#implementar-evaluaciones-periódicas-de-evaluacion-de-vulnerabilidades)

> #### Pentesting (Penetration Testing)
- [Pentesting (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#pentesting)
- [Fases de un Pentesting (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#fases-de-un-pentesting)
- [Por qué Realizar Pentesting (:heavy_check_mark:)](https://github.com/udistrital/seguridad_calidad_oas/blob/master/seguridad.md#por-qué-realizar-pentesting)

### Como Solicitar Pruebas para mi proyecto

> #### Proceso
- [Requerimientos para Solicitud de Pruebas (Actualizar)](/qa/requerimiento_pruebas.md)

***
## 10. Metodología
- [Lineamientos](/metodologias/lineamientos.md)
#### Formatos
- [Historia de usuario](/metodologias/formatos/Plantilla_Historias_Usuario-OAS_v2.xlsx)
- [Historia de usuario en Drive](https://docs.google.com/spreadsheets/d/1eAAnzjovKnLKAkk0tLFSCTGDnS_8K5pV0Fs-2Qmvrg0/edit#gid=713905461)

## 11. Definición de endpoints para APIs REST
- [Hoja resumen de buenas prácticas](https://udistritaleduco-my.sharepoint.com/:p:/g/personal/computo_udistrital_edu_co/EYwQbkAKVCJCqrmJ7NgnjQ4B8WSd81vxGVx-hqi0WBAcfQ?e=lJZdx8)
- [Aclaración y ejemplos de nombres adecuados para endpoints](/generacion_de_apis/lineamientos-endpoints.md)
