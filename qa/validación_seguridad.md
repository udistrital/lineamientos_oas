# Checklist de validación y verificación de seguridad previo al despliegue de aplicaciones


## 1. Objetivo

Establecer los controles mínimos que deben cumplirse antes de solicitar el despliegue de una aplicación en los ambientes productivos de la Universidad.

El proceso se divide en dos etapas:

1. **Checklist de validación:** verificaciones que debe realizar el equipo de desarrollo antes de solicitar la revisión de Seguridad.
2. **Checklist de verificación de seguridad:** controles y pruebas realizados por el equipo de Seguridad para determinar si la aplicación se encuentra en condiciones de ser desplegada.

---


# 2. Checklist 1 — Validación previa realizada por el equipo de desarrollo


* El código fuente se encuentra en el repositorio de la universidad.
* No existen contraseñas, tokens, API Keys o secretos en el código.
* No existen llaves privadas o certificados sensibles expuestos en el repositorio.
* Pruebas funcionales realizadas.
* Formularios y entradas validados.
* Validación de autenticación.
* Validación de usuarios.
* Validación de roles y permisos.
* Variables de entorno configuradas correctamente.
* La arquitectura de la aplicación está documentada.
* Las APIs están documentadas cuando corresponda.

# 3. Entrega a Seguridad

Una vez completados requerimientos anteriores, el equipo desarrollador podrá solicitar la verificación de seguridad.

Antes de iniciar la verificación de seguridad, el equipo desarrollador debe proporcionar como mínimo:

| Información | Requerido | Evidencia |
|---|---|---|
| Nombre de la aplicación | Sí | Nombre/identificador |
| URL/dominio de pruebas | Cuando aplique | URL |
| Repositorio | Sí | URL/referencia |
| Arquitectura | Sí | Diagrama/documento |
| Usuarios/roles | Cuando aplique | Credenciales |
| Tecnologías utilizadas | Sí | Documento |
| APIs | Cuando aplique | Swagger/OpenAPI |
| Manuales/ instructivos |  Sí | Documento |

---

# 4. Checklist 2 — Verificación de Seguridad

La verificación de seguridad será realizada por el equipo de ciberseguridad/Seguridad de la Información de acuerdo con la naturaleza y criticidad de la aplicación.

No todas las pruebas aplican necesariamente a todas las aplicaciones. El alcance será determinado según la arquitectura, exposición, información procesada y nivel de riesgo.

---


### Pruebas de seguridad

#### 4.1 Análisis de código

Se realiza el análisis de código estático mediante la herramienta de SonarQube. 
> **Nota:** Para el correcto funcionamiento de la herramienta se debe realizar la configuración previa en el repositorio siguiendo el procedimiento descrito a continuación:

https://github.com/udistrital/lineamientos_oas/blob/master/generacion_de_apis/cicd/.drone.yml
https://github.com/udistrital/lineamientos_oas/blob/master/generacion_de_apis/cicd/sonar-project.properties.md

Se verificará principalmente:

- Vulnerabilidades de seguridad.
- Calidad de código.
- Código inseguro.
- Validación de entradas.
- Exposición de información sensible.
- Problemas de configuración.

**Herramienta de referencia:** SonarQube u otra herramienta definida institucionalmente.

---

#### 4.2. Análisis de dependencias

Se revisarán las dependencias utilizadas por la aplicación para identificar componentes con vulnerabilidades conocidas.

Se verificará:

- Nombre y versión.
- Vulnerabilidades conocidas.
- Severidad.
- Posibilidad de actualización.
- Impacto sobre la aplicación.

**Herramienta de referencia:** Dependabot u otra herramienta definida institucionalmente.

---

#### 4.3. Pruebas de autenticación y autorización

Se verificará:

- Acceso sin autenticación a recursos protegidos.
- Acceso de usuarios con diferentes roles.
- Acceso a funcionalidades administrativas.
- Escalamiento de privilegios.
- Gestión de sesiones.

---

#### 4.4. Pruebas sobre APIs

Cuando existan APIs, se realizarán pruebas sobre los endpoints identificados.

Se podrá verificar:

- Autenticación.
- Autorización.
- Validación de parámetros.
- Manipulación de solicitudes.
- Métodos HTTP.
- Exposición de información.
- Mensajes de error.
- Acceso a recursos de otros usuarios.
- Tokens.
- CORS.
- Rate limiting, cuando corresponda.

---

#### 4.5. Pruebas de aplicaciones web

Según corresponda, se evaluarán vulnerabilidades como:

- Inyección.
- XSS.
- Fallas de control de acceso.
- Fallas de autenticación.
- Exposición de información.
- Configuraciones inseguras.
- Componentes vulnerables.
- Manejo inseguro de sesiones.
- Otras vulnerabilidades asociadas a la arquitectura.

Como referencia se podrán utilizar **OWASP Top 10**, **OWASP ASVS** y **OWASP API Security Top 10**.

---

# 5. Criterios para el resultado de seguridad

## Aprobado

La aplicación cumple los controles requeridos y no presenta vulnerabilidades que impidan su despliegue.

## Aprobado con observaciones

Se identificaron hallazgos que no representan una condición suficiente para bloquear el despliegue, pero que deben ser gestionados.


## No aprobado

La aplicación presenta vulnerabilidades o condiciones de seguridad que impiden su despliegue.

Como criterio inicial, podrán considerarse bloqueantes:

- Vulnerabilidades críticas sin tratamiento.
- Vulnerabilidades altas con explotación viable y exposición significativa.
- Credenciales o secretos expuestos.
- Fallas graves de autenticación.
- Fallas graves de autorización.
- Exposición no justificada de información sensible.
- Recursos de infraestructura expuestos innecesariamente.

La decisión definitiva deberá considerar el riesgo de la aplicación y los lineamientos institucionales vigentes.

---

# 6. Revalidación

Cuando se informe que un hallazgo fue corregido, el equipo de seguridad deberá realizar una revalidación.

La revalidación deberá comprobar:

1. Que la vulnerabilidad fue corregida.
2. Que la corrección no introdujo una nueva vulnerabilidad.
3. Que el código corregido corresponde con la versión que será desplegada.

Cuando sea necesario, se repetirá la prueba o análisis que originó el hallazgo.

---

# 7. Evidencias mínimas

La evaluación de pruebas de seguridad tiene como resultado un informe de seguridad que será socializado con el equipo de desarrollo encargado.

Dependiendo del caso, se evidenciara en el informe:

- Resultado de SonarQube.
- Resultado de Dependabot.
- Reporte de herramientas usadas.
- Evidencias de pruebas manuales.
- Evidencias de pruebas de APIs.
- Capturas de configuración.
- Reportes de vulnerabilidades clasificados según criticidad.

---



# 8. Recomendaciones para el proceso de desarrollo seguro


> **1. No almacenar contraseñas, tokens, API Keys o secretos en el repositorio.**

> **2. Corregir las vulnerabilidades identificadas antes del despliegue a producción.**

> **3. Documentar los componentes de infraestructura utilizados.**

> **4. Todo hallazgo debe tener seguimiento hasta su cierre o aceptación formal del riesgo.**

---
