# Generación de API Flask  :snake:

Para el debido procedimiento del API Flask se tendrá en cuenta un entorno de desarrollo por medio de WSL de ubuntu 22.04, de manera local con el uso de Docker la cual se realizará los siguientes prerrequisitos para la generación correcta del API FLASK 

 - [Instalaciones previas](/api_flask/lineamientos_previos.md)

--- 

Una vez se tengan los requerimientos previos mencionados anteriormente, se debe realizar los siguientes pasos:  

## :one: Creamos y asignamos el nombre de nuestra API_FLASK 
 
```
mkdir my_flask_api   
cd my_flask_api
```

--- 

## :two: Después de ello creamos la estructura de directorios y archivos basados al proyecto, el siguiente modelo es una breve idea que se puede tener como referencia de la creacion del API de FLASK 
``` 
my_flask_api/ 
├── Dockerfile 
├── README.md 
├── api.py 
├── conf/ 
│   ├── __init__.py 
│   └── conf.py 
├── controllers/ 
│   ├── __init__.py 
│   ├── controller.py 
│   ├── error.py 
│   └── healthCheck.py 
├── entrypoint.sh 
├── imagedef.json 
├── models/ 
│   ├── __init__.py 
│   ├── modelo1.py 
│   └── utils.py 
├── requirements.txt 
├── routers/ 
│   ├── __init__.py 
│   └── router.py 
├── sonar-project.properties 
└── swagger/ 
    ├── swagger.json 
    └── swagger.yml
```
    
 -[Guia sobre la estrucutra del api flask](/api_flask/estrucutra.md)

--- 

## :three: Despues de tener la estrutura del proyecto definida correctamente, se procede a configurar Flask y Swagger, en los siguientes archivos


### 3.1. ` api.py`  Configura la aplicación, inicia el servidor y registra los Blueprints (componentes modulares de Flask). Este archivo es obligatorio y necesario para definir y arrancar tu aplicación Flask

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

### 3.2. `conf/conf.py` Almacena la configuración de tu aplicación Flask en un lugar centralizado, facilita el mantenimiento y escalabilidad
  
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

### 3.3. `routers/router.py` Organiza y registra las rutas de tu aplicación. Usa Blueprints para modularizar la aplicación.

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

### 3.4. `controllers/healthCheck.py` Mejora la organización, define las funciones para manejar las rutas específicas.
```python
from flask import jsonify

def get_health():
    return jsonify({"status": "UP"})

```

--- 
  
### 3.5. `controllers/document.py` Este archivo maneja las solicitudes relacionadas con documentos y define las funciones para los endpoints de documentos.
  
```python
from flask import request, jsonify

def add_document():
    data = request.get_json()
    # Implement logic to add document
    return jsonify({"message": "Document added", "data": data})

```

--- 

### 3.6. `DockerFile` descripcion de para que sirve este archivo.
  
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

### 3.7. `swagger/swagger.yml` Define la documentación de la API usando el estándar Swagger/OpenAPI.
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

# Uso de local

- [Manejo de variables de entorno](/api_flask/variables_entorno.md)

# Uso de Docker <img src=" " alt="Flask Icon" width="25"/>
## :four: Realizar configuracion de Docker con el archivo de texto Dockerfile con instrucciones para construir una imagen de Docker
  
```Docker
FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["sh", "entrypoint.sh"]

FROM python:3.8

COPY entrypoint.sh entrypoint.sh

COPY conf/** /conf/

COPY controllers/** /controllers/

COPY models/** /models/

COPY routers/** /routers/

COPY swagger/** /swagger/

```

--- 

## :five:  entrypoint.sh, es un script de shell que se ejecuta cuando el contenedor se inicia activando el entorno virtual de Python

```python
#!/bin/bash
source venv/bin/activate
exec gunicorn -b 0.0.0.0:5000 api:app

```
--- 

## :six: Crear requirements.txt para que el archivo liste todas las dependencias de Python que tu aplicación necesita.
```
flask
flasgger
gunicorn
```
--- 

## :seven: Probar la API, se realiza por medio de la terminal, debido a que se debe construir y correr el contenedor Docker, acceder a la API y la documentación de Swagger:
```Docker

docker build -t my_flask_api .
docker run -p 5000:5000 my_flask_api

```
  - API: http://localhost:5000/api/health
Swagger: http://localhost:5000/apidocs
