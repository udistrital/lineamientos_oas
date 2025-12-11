# Configuración del archivo sonar-project.properties

Este archivo permite definir los parámetros con los cuales SonarQube analiza la calidad del código fuente, reporta vulnerabilidades, errores y problemas de mantenibilidad.

Cada proyecto debe incluir en su raíz un archivo llamado **`sonar-project.properties`**, con la siguiente estructura base:

---

## Estructura general del archivo



```properties
# === Identificación del proyecto ===
sonar.projectKey=<nombre_del_proyecto>
sonar.projectName=<nombre_del_proyecto>
sonar.projectVersion=1.0

# === Directorios del código fuente ===
sonar.sources=<ruta_codigo_fuente>

# === Exclusiones (archivos o carpetas que no se analizan) ===
sonar.exclusions=**/node_modules/**,**/*.spec.*,**/*.test.*,**/build/**,**/dist/**

# === Configuración de pruebas ===
sonar.tests=<ruta_pruebas>
sonar.test.inclusions=**/*.spec.*,**/*.test.*

# === Lenguaje y codificación ===
sonar.sourceEncoding=UTF-8
```

## Descripción de cada sección

| Parámetro               | Descripción                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `sonar.projectKey`      | Identificador del proyecto dentro de SonarQube. Se debe usar el mismo nombre del repositorio.             |
| `sonar.projectName`     | El mismo nombre del repositorio.                                                                           |
| `sonar.projectVersion`  | Versión del proyecto analizado.                                                                           |
| `sonar.sources`         | Carpeta raíz que contiene el código fuente.                                                               |
| `sonar.exclusions`      | Archivos o carpetas que se deben omitir en el análisis.                                                   |
| `sonar.tests`           | Carpeta donde se ubican las pruebas automatizadas.                                                        |
| `sonar.test.inclusions` | Patrones de archivos de prueba.                                                                           |
| `sonar.sourceEncoding`  | Codificación de archivos fuente. Siempre `UTF-8`.                                                         |


## ¡Nota importante!

Cada proyecto tiene una estructura interna diferente y se deben ajustar los parametros según sea el caso, tener en cuenta las siguientes recomendaciones:

- **`sonar.sources`** debe apuntar al directorio donde esté el código fuente del proyecto. Si no tiene una carpeta definida o si el código se encuentra distribuido se puede usar **`.`** para que analice la carpeta raíz del proyecto.
- **`sonar.tests`** y **`sonar.test.inclusions`** pueden eliminarse del archivo de configuración si el proyecto no cuenta con pruebas unitarias o de integración definidas.
- **`sonar.exclusions`** debe ajustarse según las carpetas, dependencias o archivos que no deban analizarse dentro del proyecto (por ejemplo: `node_modules`, `dist`, `vendor`, archivos generados automáticamente, etc.).


# Ejemplos según el tipo de proyecto 

A continuación se incluyen ejemplos del archivo `sonar-project.properties` para los lenguajes de programación más comunes. Estos ejemplos sirven como referencia y deben ajustarse según la estructura real de cada repositorio:

## (Angular)

```properties
sonar.projectKey=nombre_proyecto_mf
sonar.projectName=nombre_proyecto_mf
sonar.projectVersion=1.0

sonar.sources=src
sonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.scss
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts

sonar.sourceEncoding=UTF-8
```

## (Go)

```properties
sonar.projectKey=nombre_proyecto
sonar.projectName=nombre_proyecto
sonar.projectVersion=1.0

sonar.sources=.
sonar.exclusions=**/vendor/**, **/test/**, **/build/**
sonar.tests=.
sonar.test.inclusions=**/*_test.go

sonar.sourceEncoding=UTF-8
```

## (Python)

```properties
sonar.projectKey=nombre_proyecto_mf
sonar.projectName=nombre_proyecto_mf
sonar.projectVersion=1.0

sonar.sources=.
sonar.exclusions=**/__pycache__/**,**/*.pyc,venv/**,env/**
sonar.tests=.
sonar.test.inclusions=**/test_*.py,**/*_test.py

sonar.sourceEncoding=UTF-8
```

## (php)

```properties
sonar.projectKey=nombre_proyecto_mf
sonar.projectName=nombre_proyecto_mf
sonar.projectVersion=1.0

sonar.sources=.
sonar.exclusions=**/vendor/**,**/*.md
sonar.tests=src
sonar.test.inclusions=tests/**/*.php

sonar.sourceEncoding=UTF-8
```