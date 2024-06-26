# Versionado de APIs

Se emplea como lineamiento para el versionado de APIs el sistema Semantic Versioning (SemVer). Este proporciona un esquema claro y consistente para identificar los cambios en una API, lo que facilita a los desarrolladores comprender el impacto de las actualizaciones y tomar decisiones informadas sobre su adopción.

## Sobre Semantic Versioning

SemVer se basa en un formato de versión compuesto por tres números separados por puntos: MAJOR.MINOR.PATCH (X.Y.Z). Cada número tiene un significado específico:

* MAJOR: Indica cambios incompatibles con versiones anteriores. Estos cambios pueden requerir que los desarrolladores realicen modificaciones significativas en su código para adaptarse a la nueva API. También se puede tratar cuando es una versión nueva del API dentro de un contexto general, dado su tamaño o cambios implementados.

* MINOR: Indica la adición de nuevas funcionalidades que mantienen la compatibilidad con versiones anteriores. Los desarrolladores pueden optar por integrar estas nuevas funciones sin necesidad de realizar cambios en su código existente.

* PATCH: Indica correcciones de errores que no introducen cambios en la funcionalidad o la compatibilidad de la API. Los desarrolladores generalmente deben actualizar a la última versión de parche para garantizar un funcionamiento correcto y seguro.

La siguiente gráfica resume lo anteriormente mencionado:

![image](https://github.com/udistrital/lineamientos_oas/assets/24207969/e9dce155-42d8-4160-8ff0-432e81ade6b1)

Nótese que MAJOR es para cambios fuertes, actualizaciones "pesadas"; MINOR son apenas funcionalidades nuevas o mejoradas; PATCH es todo lo relacionado a bugfixes y hotfixes.

Adicionalmente es posible incluir (opcionalmente) una etiqueta de pre-release. Incluso, hasta información de build. Por ejemplo:

![image](https://github.com/udistrital/lineamientos_oas/assets/24207969/5e3ef282-02aa-4d78-bfd3-71cdcd325a72)

![image](https://github.com/udistrital/lineamientos_oas/assets/24207969/4e10cd78-e154-4db7-8320-ed5dcadad60c)

### Ejemplo

Miremos un ejemplo para aclarar:

Supongamos que tenemos un API en su versión 2.6.8. Existirán tres posibilidad de actualización (versionamiento) del API de acuerdo con el cambio incluido:

![image](https://github.com/udistrital/lineamientos_oas/assets/24207969/c6de797b-03f0-484f-8f49-51cdc00d0e9a)

El valor de X, Y y Z dependerá del cambio mismo del API. En el ejemplo pasa a 2.6.9 si se tratara de un bug o hot fix. Pasaría a 2.7.0 si se está añadiendo una nueva funcionalidad. Y quedará en 3.0.0 si el cambio es mayor, genera incompatibilidades o rompe con el versionado anterior.

## Lineamiento

Para la Oficina Asesora de Tecnologías e Información debe seguirse esta estructura. Recuerde que las APIs están en constante actualización así que es pertinente tener un versionado adecuado.

* Cuando se despliega por primera vez un API en ambiente de producción, quedará por defecto en el versionado 0.1.0. Si ya es una versión completamente estable en producción debe considerarse el versionado 1.0.0.
* En el caso que el API aún no se encuentre estable en ambiente de producción y vaya a ser actualizado, se seguirá el versionado 0.Y.Z, donde Y y Z estarán modificándose según se va construyendo el API. Por ejemplo, 0.2.0; 0.2.1; 0.62.0; 0.62.12; etc.
* En el caso que el API ya se encuentre estable en ambiente de producción y se vaya a disponer para su primer uso completo oficial por parte de los usuarios, se seguirá el versionado 1.Y.Z, donde Y y Z estarán modificándose según se va actualizando el API. Por ejemplo, 1.1.0; 1.24.0; 1.25.10; etc.
* Para actualizaciones mayores posteriores el API seguirá el SemVer. Por ejemplo, 2.0.0; 3.0.0; etc.

## A nivel de sistema

Si bien las API tienen su versionado, debe considerarse que el sistema también debe satisfacerse de un "versionado" a nivel macro, esto es, en palabras sencillas "la versión del sistema". Un sistema de información como SISGPLAN, Cumplidos o Resoluciones (de recientes tecnologías en la OATI) es la suma de API de tipo MID, CRUD e incluso de repositorios asociados a clientes (recuerde que en la arquitectura de micro-clientes y micro-mids un sistema puede tener n cantidad de clientes y m cantidad de API MID o CRUD). Para indicar la versión del sistema, debe considerarse la funcionalidad que éste va sumando, es decir, según vaya "creciendo" el sistema.

Por ejemplo, el sistema ABC se despliega a producción con una serie de funcionalidades, que representan en su momento el producto mínimo viable. Lo componen cierta cantidad de micro-clientes y micro-mids, así como un par de CRUD. Es la primera versión del sistema, por ende ha de tener el versionado 1.0.0. Si se presenta algún bugfix o hotfix, aunque sea apenas sobre un micro-cliente, micro-mido o CRUD que se realizan los ajustes, el sistema cambia automáticamente de versión; en nuestro ejemplo, cambiaría al versionado 1.0.1, y así sucesivamente. Supongamos que se desarrolla una nueva funcionalidad; ésta afecta algunas de las API micro-mid y CRUD, y un par de micro-clientes. Aunque cada uno de estos involucrados cambian su versionado, el sistema solo aumentará en un valor y representará la suma de todos los desarrollos en cuestión; para nuestro ejemplo, cambiaría al versionado 1.1.0. Ahora, asumiendo que se desarrollan un buen número de nuevas funcionalidades, que afectan a varias de las API y micro-clientes que componen al sistema, como se puede intuir, hablamos ya de una nueva versión del sistema; en nuestro caso el versionado pasaría a ser 2.0.0.

En resumen, cada API debe seguir su ciclo de vida con su propio versionado. A nivel de sistema, aunque se versionen varias API al tiempo, el sistema debe manejar su propia versión como elemento software que es. 

El siguiente cuadro muestra información adicional que ayuda en el versionado del sistema de información:


