# Lineamiento para la definición de endpoints en las APIs

En esta sección se encuentran las buenas prácticas para la definición de endpoints en los controladores de las APIs siguiendo el estándar REST.

## Verbos HTTP

- GET Recupera una representación de un recurso de datos.​
- HEAD Recupera la cabecera de una respuesta.​
- POST Crea un nuevo recurso de datos.​
- PUT Actualiza un recurso existente o lo crea si no existe previamente.​
- PATCH Realiza una actualización parcial de un recurso.​
- DELETE Elimina un recurso de datos existente.​
- OPTIONS Recupera opciones de comunicación para el recurso solicitado.​

El método GET es el más habitual para el acceso y descarga de datos.​

## URI

La URI es la estrategia empleada para la identificación única de un recurso. Por ejemplo, si estamos hablando de traer los contratos con el estado de finalizado para las licitaciones, podríamos tener la siguiente URI: https://datos.ejemplo.com/v1/licitaciones/contratos?estado=finalizado. Nótese que la anatomía para identificar el recurso está dada por los elementos:

- _https_ es el esquema.
- _datos.ejemplo.com_ es la autoridad.
- _v1_ es la versión del API.
- _licitaciones_ es el contexto.
- _contratos_ es el **recurso**.
- _estado=finalizado_ es la consulta.

Un recurso es todo aquello que se obtiene como respuesta (response) al hacer la petición (request). Debe usar URIs para identificar los recursos.

## Estrategia para el nombrado de recursos (definición de endpoints)

- Distingue Documentos, Colecciones, Almacenes y controladores.​
- Usa convenciones de lenguaje del tipo:​
  - Usa términos sencillos, intuitivos y coherentes.​
  - Los términos deben ser suficientemente auto-explicativos. ​
  - Evita la ambigüedad para la denominación de recursos en las URIs.​
  - Usa términos que no requieran un conocimiento especifico del contexto​.
  - Evita nombres que puedan entrar en conflicto con palabras clave.​
  - Sé coherente con el uso del plural o singular: el uso del plural es habitual​.
- Usa '/' para indicar relaciones de jerarquía​.
- No incluir el separador '/' como carácter final de la URI​.
- Usa el carácter "-" para mejorar la legibilidad de la URI​.
- No usar el carácter "_".​
- Usa minúsculas para expresar los términos de la URI​.
- No incluir extensiones de archivo​.
- NO USAR NOMBRES DE OPERACIONES CRUD EN LAS URIS.

## Ejemplos y aclaración

- Recuerde que debe usar URIs para la identificación de los recursos.

- Cada método/verbo HTTP es específico para cada operación. Utilice el adecuado.

- Use los códigos de respuesta o estado (status code) para indicar éxito o fracaso.

- Para el caso de la OATI, se ha establecido que se trabajen en **idioma español** la definición de los endpoints. No use carácteres especiales (ñ, acentos, etc.).

### Ejemplos básicos

| HTTP method  | Bad                 | Good              |
|:-------------|:--------------------|:------------------|
| POST         | /login              | /login-sessions   |
| POST         | /crear-libro        | /libros           |
| GET          | /traer-libros       | /libros           |
| PUT          | /actualizar-libro/5 | /libros/5         |
| DELETE       | /eliminar-libro/7   | /libros/7         |
| GET          | /traer-top-10-libros| /top-10-libros    |
| POST         | /crear-usuario      | /usuarios         |
| GET          | /login_sessions     | /login-sessions   |

### Ejemplos con consultas y/o jerarquías

| HTTP method  | Bad                              | Good                         |
|:-------------|:---------------------------------|:-----------------------------|
| GET          | /traer-usuario/5                 | /usuarios/5                  |
| GET          | /usuarios/paginas/1              | /usuarios?pagina=1           |
| GET          | /usuarios/genero/fem             | /usuarios?genero=fem         |
| GET          | /usuarios/edad/18                | /usuarios?edad=18            |
| GET          | /usuarios/???                    | /usuarios?genero=fem&edad=18 |
| GET          | /usuarios/2/traerMascotas        | /usuarios/2/mascotas         |
| POST         | /usuarios/5/logs_ses             | /usuarios/5/logs-ses         |
| GET          | /usuarios/{usuario-id}/mis_amigos| /usuarios/{usuario-id}/amigos|
| GET          | /usuarios/{obj-id}/todos-likes   | /usuarios/{obj-id}/likes     |

## Códigos de respuesta (status code), categoría e interpretación

| Status code  | Tipo                       | Descripción                                                            |
|:-------------|:---------------------------|:-----------------------------------------------------------------------|
| 1xx          | Informativo                | Solicitud recibida, el proceso de respuesta está en marcha.​            |
| 2xx          | Éxito                      | La petición del cliente se ha recibido, entendido y aceptado con éxito.​|
| 3xx          | Redirección                | Se deben tomar medidas adicionales para completar la solicitud.​        |
| 4xx          | Error del cliente          | La solicitud contiene una sintaxis incorrecta o no se puede cumplir.​   |
| 5xx          | Error del servidor         | El servidor no pudo resolver una solicitud aparentemente válida.​       |

​Es recomendable definir interpretaciones comprensibles de códigos de estado, incluyendo mensajes de error legibles por las personas, informativos y útiles, así como enlaces a detalles complementarios.

Recuerde que una petición que traiga información vacía, por ejemplo un array sin elementos [], debe responder a un status code 2xx. Que no exista información no significa que la petición no sea válida o no responda. Simplemente no contiene información pero como petición llega a su destino y responde al origen.
