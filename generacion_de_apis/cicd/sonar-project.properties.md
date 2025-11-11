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


## Ejemplo según el tipo de proyecto (Angular)

```properties
sonar.projectKey=nombre_proyecto_mf
sonar.projectName=nombre_proyecto_mf
sonar.projectVersion=1.0

sonar.sources=src
sonar.exclusions=**/node_modules/**,**/*.spec.ts,**/*.scss,**/environments/**
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts

sonar.sourceEncoding=UTF-8
```