
## :three: Refactorización del proyecto para manejo de los diferentes componentes y archivos de una aplicación Flask estructurada de manera modular.

### :diamond_shape_with_a_dot_inside: 3.1. ` api.py`  Configura la aplicación, inicia el servidor y registra los Blueprints (componentes modulares de Flask). Este archivo es obligatorio y necesario para definir y arrancar tu aplicación Flask

```python
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return "API Flask funcionando"

@app.route('/v1/')
def api_info():
    return jsonify({
        "API_PORT": os.getenv('API_PORT'),
        "NUXEO_URL": os.getenv('NUXEO_URL'),
        "NUXEO_USERNAME": os.getenv('NUXEO_USERNAME'),
        "NUXEO_PASSWORD": os.getenv('NUXEO_PASSWORD'),
        "DOCUMENTOS_CRUD_URL": os.getenv('DOCUMENTOS_CRUD_URL')
    })

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    app.run(host='0.0.0.0', port=port)

```

--- 

### :diamond_shape_with_a_dot_inside: 3.2. `conf/conf.py` Almacena la configuración de tu aplicación Flask en un lugar centralizado, facilita el mantenimiento y escalabilidad
  
```python

import os
from dotenv import load_dotenv

class Config:
    load_dotenv()  # Carga las variables de entorno desde el archivo .env

    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    TESTING = os.getenv('TESTING', 'False') == 'True'
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))

    API_PORT = os.getenv('API_PORT')
    NUXEO_URL = os.getenv('NUXEO_URL')
    NUXEO_USERNAME = os.getenv('NUXEO_USERNAME')
    NUXEO_PASSWORD = os.getenv('NUXEO_PASSWORD')
    DOCUMENTOS_CRUD_URL = os.getenv('DOCUMENTOS_CRUD_URL')
    ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')

config = Config()

```

--- 

### :diamond_shape_with_a_dot_inside: 3.3. `routers/router.py` Organiza y registra las rutas de tu aplicación. Usa Blueprints para modularizar la aplicación.

```python
from flask import Blueprint
from controllers import healthCheck, document

router = Blueprint('api', __name__)

@router.route('/health', methods=['GET'])
def health():
    return healthCheck.get_health()

@router.route('/document', methods=['POST'])
def add_document():
    return document.add_document()

```

--- 

### :diamond_shape_with_a_dot_inside: 3.4. `controllers/healthCheck.py` Mejora la organización, define las funciones para manejar las rutas específicas.
```python
from flask import jsonify

def get_health():
    return jsonify({"status": "UP"})

```

--- 
  
### :diamond_shape_with_a_dot_inside: 3.5. `controllers/document.py` Este archivo maneja las solicitudes relacionadas con documentos y define las funciones para los endpoints de documentos.
  
```python
from flask import request, jsonify

def add_document():
    data = request.get_json()
    # Implement logic to add document
    return jsonify({"message": "Document added", "data": data})

```

--- 

### :diamond_shape_with_a_dot_inside: 3.6. `DockerFile` descripcion de para que sirve este archivo.
  
```docker
# Utiliza la imagen base de Python 3.8
FROM python:3.8

# Instala AWS CLI (si es necesario)
RUN pip install awscli

# Copia y configura el script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Crea el directorio de documentos y un archivo PDF vacío
RUN mkdir /documents
RUN touch /documents/document.pdf

# Copia el archivo de requisitos e instala las dependencias
ADD requirements.txt 
RUN pip install -r requirements.txt

# Actualiza e instala las utilidades poppler-utils
RUN apt-get update && apt-get install -y poppler-utils

# Copia los directorios necesarios a la imagen de Docker
COPY conf/** /conf/
COPY controllers/** /controllers/
COPY models/** /models/
COPY routers/** /routers/
COPY swagger/** /swagger/

# Copia el archivo principal de la API
ADD api.py

# Establece el script de entrada por defecto
ENTRYPOINT ["/entrypoint.sh"]


```

--- 

### :diamond_shape_with_a_dot_inside: 3.7. `swagger/swagger.yml` Define la documentación de la API usando el estándar Swagger/OpenAPI.
```python

swagger: '2.0'  # Versión de la especificación Swagger que se está utilizando.

info:  # Información sobre la API.
  description: Api mid para la autenticacion de documentos en Nuxeo  # Descripción de la API.
  title: gestor_documental_mid  # Título de la API.
  version: '1.0'  # Versión de la API.

basePath: /v1  # Ruta base para todas las URL de la API.
consumes:
- application/json  # Tipo de contenido que la API puede consumir (enviar en el cuerpo de las solicitudes).
produces:
- application/json  # Tipo de contenido que la API puede producir (enviar en las respuestas).

tags:
- name: example
  description: Ejemplo de operaciones

definitions:
  upload_resquest:
    type: object
    properties:
      IdTipoDocumento:
        type: integer
      descripcion:
        type: string
      file:
        type: string
      metadatos:
        type: object
        properties:
          dato_a:
            type: string
          dato_b:
            type: string
      nombre:
        type: string

paths:  # Definiciones de rutas y sus correspondientes métodos HTTP.
  /example_endpoint:
    get:  # Método HTTP GET
      tags:
      - example
      summary: Ejemplo de endpoint GET  # Resumen del endpoint.
      description: |
        Este es un endpoint de ejemplo para mostrar cómo se estructura una operación GET.
      operationId: get_example  # Identificador único de la operación.
      parameters:  # Parámetros que acepta este endpoint.
      - name: param1
        in: query
        description: Ejemplo de parámetro de consulta
        required: false
        type: string
      responses:  # Posibles respuestas del endpoint.
        '200':
          description: Success
        '400':
          description: Bad request
        '404':
          description: Not found
        '500':
          description: Error del servidor

    post:  # Método HTTP POST
      tags:
      - example
      summary: Ejemplo de endpoint POST  # Resumen del endpoint.
      description: |
        Este es un endpoint de ejemplo para mostrar cómo se estructura una operación POST.
      operationId: post_example  # Identificador único de la operación.
      parameters:  # Parámetros que acepta este endpoint.
      - name: payload
        in: body
        required: true
        schema:
          $ref: '#/definitions/upload_resquest'
      responses:  # Posibles respuestas del endpoint.
        '200':
          description: Success
        '400':
          description: Bad request
        '500':
          description: Error del servidor


```

---

## Instrucciones para incluir un archivo .drone.yml en el proyecto

:one: Crear un .drone.ymlarchivo en el directorio raíz de su proyecto

:two: Configurar varaibles de entorno o secrets en Drone agregue los siguientes secrets a la configuración de Drone CI:

```
SONAR_HOST: URL del servidor de SonarQube.
SONAR_TOKEN: Token de autenticación de SonarQube.
docker_username: Nombre de usuario de Docker Hub.
docker_password: Contraseña de Docker Hub.
AWS_ACCESS_KEY_ID: ID de clave de acceso de AWS.
AWS_SECRET_ACCESS_KEY: Clave secreta de acceso de AWS.
AWS_CONTAINER: Contenedor AWS.
telegram_token: Token de Telegram para enviar notificaciones.
telegram_to: ID del chat de Telegram para enviar notificaciones.
```

:three: Activar el repositorio en Drone CI y comenzar a ejecutar pipelines, asegurandose de que el repositorio esté activado e integrado con Drone CI.

:large_blue_diamond: tomando como referencia el siguiente el README.md del siguiente api [Instalaciones previas](https://github.com/udistrital/gestor_documental_mid)

----

### Si el repositorio en Drone CI no esta activo seguir lo siguiente pasos 

:one: Acceder a la Interfaz de Drone CI:

:large_blue_diamond: Abre tu navegador y navega a la interfaz de Drone CI.

:large_blue_diamond: Inicia sesión con las credenciales correspondientes (GitHub, GitLab, Bitbucket, etc.).

:two: Buscar el Repositorio:

:large_blue_diamond: En el tablero de Drone, busca y selecciona el repositorio que deseas activar.

:large_blue_diamond: Si el repositorio no está visible, es posible que necesites sincronizar tu cuenta. Busca una opción como "Sync" o "Sincronizar" en la interfaz de Drone.

:three: Activar el Repositorio:

:large_blue_diamond: En la lista de repositorios, localiza el repositorio que deseas activar y haz clic en el botón "Activate" (Activar).

:large_blue_diamond: Si Drone te solicita permisos adicionales para acceder al repositorio, otorga los permisos necesarios.

:four: Configuración de Repositorio:

:large_blue_diamond: Una vez activado, puedes acceder a la configuración del repositorio para ajustar parámetros adicionales como secretos (si no lo has hecho ya), configuración de webhook, etc.

:five: Probar la Configuración:

:large_blue_diamond: Realiza un push a tu repositorio para disparar un build en Drone CI.

:large_blue_diamond: Verifica en la interfaz de Drone CI que el pipeline se ejecuta correctamente según la configuración de tu archivo .drone.yml.

---

