# Contenido README

En esta sección se establece los contenidos mínimos en el README para la descriptivos de un repositorio Github para la OAS.

```bash
├── Nombre de Repositorio
│   └── Descripción de Repositorio
├── Especificaciones Técnicas
│   ├── Tecnologías Implementadas y Versiones
│   ├── Variables de Entorno
│   ├── Ejecución del Proyecto
|   │   ├── Ejecución Docker
|   │   ├── Ejecución docker-compose
│   ├── Ejecución Pruebas
└── Estado CI
└── Modelo de Datos
└── Licencia
```

## Nombre de Repositorio
Se debe nombrar el repositorios de acuerdo al lineamiento del capítulo anterior [nombramiento de repositorios](nombre_repos.md#nombre-de-repositorios)

### Descripción del Repositorio
Se debe especificar el propósito o la funcionalidad del repositorios en la descripción inicial, como  se observa en la imagen siguiente:

![Crear BD](/repositorios_institucionales/img/descri_repo.png)


## Especificaciones Técnicas
Se debe documentar los aspecto técnicos del componente de software como: *Tecnologías Implementadas y Versiones*, *Instalación*, *Variables de Entorno*, *Ejecución del Proyecto*, *Modelo de Datos*, pero estas no son las únicas; puedes agregar secciones para la ejecución del docker o puertos y endpoint para mayor descripción.
La idea principal es brindar una introducción para los desarrolladores, devops y equipos de infraestructuras acerca del componente de software que alberga dicho repositorio.

![README Especificacion Técnica](/repositorios_institucionales/img/espec_tec.png)


### Tecnologías Implementadas y Versiones
Se crean links o enlaces del fabricante oficial acerca las tecnologías implementadas y en ocasiones se proporciona su versión específica

![REAME  Tecnologias implementadas y Versiones](/repositorios_institucionales/img/tec_implementadas_y_versiones.png)

### Variables de Entorno
Define las variables implementadas y una breve descripción del valor que almacenan.   
![REAME Variables de Entorno](/repositorios_institucionales/img/variables_entorno.png)

### Ejecución del Proyecto
Define la serie de pasos y comandos para ejecutar el repositorio en ambiente local.   
![REAME Ejecución del Proyecto](/repositorios_institucionales/img/ejecución_proyecto.png)

### Ejecución Docker
Define la serie de pasos y comandos para ejecutar el repositorio en ambiente dockerizado.   

![REAME Ejecución Docker](/repositorios_institucionales/img/docker1.png)


### Ejecución docker-compose
Define la serie de pasos y comandos para ejecutar el repositorio en ambiente dockerizado.   

![REAME Ejecución docker-compose](/repositorios_institucionales/img/docker2.png)


### Estado CI
Son links que dirigen hacia los resultado del sistema de integración continua.   

![REAME Modelo de Datos](/repositorios_institucionales/img/estado_ci.png)

## Modelo de Datos
Los modelos de datos, mockups o modelos de interfaces gráficas por ser imágenes tan extensas, **se establece** crear enlaces a las imágenes, para que no extiendan el contenido del readme.   

![REAME Modelo de Datos](/repositorios_institucionales/img/modelo_datos.png)

## Licencia
Se debe definir la licencia del repositorio, como  se observa en la imagen siguiente:

![Crear BD](/repositorios_institucionales/img/licencia.png)


## Descargar README DEMO
[README DEMO](/repositorios_institucionales/README_DEMO.md)
