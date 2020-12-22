# Lineamientos OAS :eyeglasses:

Este repositorio es un conglomerado de buenas prácticas, lineamientos, configuraciones a realizar en el entorno de desarrollo de las nuevas tecnologias de la Oficina Asesora de Sistemas (OAS)

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

- [Definición](https://github.com/udistrital/arquitectura_docs/tree/master/aplicaciones#micro-servicios-que-son)
- [Lineamientos](https://github.com/udistrital/arquitectura_docs/tree/master/aplicaciones#lineamientos-generales-de-arquitectura)

***
## 4. Modelos de Datos :floppy_disk:

- [Lineamientos](/modelo_de_datos/estandar.md)

***
## 5. APIS Beego :mortar_board:

> ### Generación API CRUD
- [Generar API Beego](/generacion_de_apis/generar_api.md)
- [Refactorizar API Beego (Contol de Errores)](/generacion_de_apis/control_error_json_crud.md)
- [Versionar BD en API Beego (Beego Migrations)](/generacion_de_apis/beego_migrations.md)
- [Variables de Entorno en API Beego (Beego Migrations)](/generacion_de_apis/variables_en_api.md)
- [EndPoint de validacion estado en APIs](/generacion_de_apis/endpoint_validacions.md)

> ### Generación API MID
- [Generar API MID](/generacion_de_apis/create_api_mid.md)
- [lógicca Orientado a Funciones en API MID](/generacion_de_apis/lineamiento_api_mid.md)
- [Refactorizar API MID (Control de Errores)](/generacion_de_apis/control_error_json_mid.md)

> ### Generación Reglas de Negocio (RULE)
- [Generar Reglas de Negocio-(Falta)]()

> ### Configuraciones Adicionales y Utilidades
- [Generar Logs en API Beego](/generacion_de_apis/logs_api.md)
- [Migrar Modelo de API a bd Nuevas](/generacion_de_apis/migrar.md)


## 5.1. Pruebas Unitarias API Beego :mag:

- [Lineamientos](/pruebas_unitarias_api_beego/unit_test_beego.md)

> ### Pruebas Unitarias API CRUD
- [Pruebas Unitarias en API CRUD](/pruebas_unitarias_api_beego/crud_test.md)

> ### Pruebas Unitarias API MID
- [Paso de Parametros en Test API MID](/pruebas_unitarias_api_beego/paso_parametro_test_mid.md)
- [Smoke Testing API MID](/pruebas_unitarias_api_beego/smoke_test_mid.md)

***
## 6. Clientes Angular

- Lineamientos
- Calidad

## 6.1 Pruebas Unitarias de Clientes Angular

- Lineamientos

***
## 7. Despliegues
- [Lineamientos (Actualizar)](/despliegues/lineamientos.md)

***
## 8. Aseguramiento de la Calidad (QA) y Seguridad Informática

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
## 9. Metodología
- [Lineamientos](/metodologias/lineamientos.md)
#### Formatos
- [Historia de usuario](/metodologias/formatos/Plantilla_Historias_Usuario-OAS_v2.xlsx)
- [Historia de usuario en Drive](https://docs.google.com/spreadsheets/d/1eAAnzjovKnLKAkk0tLFSCTGDnS_8K5pV0Fs-2Qmvrg0/edit#gid=713905461)
