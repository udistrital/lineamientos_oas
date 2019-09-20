# Aseguramiento de la Calidad (QA)

En esta sección se definirán los requerimientos que todos los desarrollos de software deben cumplinplir en el marco de la calidad de la Oficina Asesora de Sistemas (OAS). Cada uno de los requerimientos han sido documentados y socializados dentro de los grupos de desarrollo de software y consolidadas en repositorio github de la organización.   

Estos requerimiento serán evaluados y determinarán el paso a producción del desarrollo en caso de que cumplan con los criterios mínimos definidos.

## Pruebas Funcionales


## Pruebas no Funcionales

### Calidad en el Código

#### Check list

No |Lineamiento | Documentación
--- | --- | :---:
1 | Repositorios Institucionales | [link](https://github.com/udistrital/introduccion_oas#2-repositorios-institucionales-herb)
1.1 | Nombres para Repositorios y Branches |
1.2 | Limpieza de Branches |
1.3 | Contenido README |
1.4 | .gitignore |
2 | APIS Beego | [link](https://github.com/udistrital/introduccion_oas#5-apis-beego-mortar_board)
2.1 | Contol de Errores API CRUD (Respuestas Json) |
2.2 | Contol de Errores API MID (Respuestas Json) |
3 | Pruebas Unitarias API Beego | [link](https://github.com/udistrital/introduccion_oas#6-pruebas-unitarias-api-beego-mag)
3.1 | Pruebas Unitarias en API CRUD |
3.2 | Pruebas Unitarias en API MID |
4 | Análisis de Código Estatico SonarQube |
4.1 | 0 Bugs <br> 0 Vulnerabilidades <br> Maximo 50 % de Duplications |


### Seguridad
A continuación las pruebas que se realizan en el ámbito de seguridad informática para las aplicaciones desarrolladas en la OAS.

#### Evaluación de Vulnerabilidad (Vulnerability Assesmente)

La evaluación de vulnerabilidades es el proceso de definición, identificación, clasificación y priorización de vulnerabilidades a nivel de sistemas computacionales, aplicaciones e infraestructura de red y proporcionar a la organización los conocimientos, la conciencia y los antecedentes de riesgo necesarios para comprender las amenazas en su entorno y reaccionar adecuadamente.

#### Auditoria de Seguridad (Pentesting)

El pentesting, auditoria de seguridad, hacking etico; Evalúa los niveles de seguridad de un sistema informático o red mediante la simulación, en un entorno controlado, de un ataque por parte de un usuario malicioso.
