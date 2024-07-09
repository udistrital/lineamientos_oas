# Generación de API Flask  

Para el debido procedimiento del API Flask se tendrá en cuenta un entorno de desarrollo por medio de WSL de ubuntu 22.04, de manera local con el uso de Docker la cual se realizará los siguientes prerrequisitos para la generación correcta del API FLASK 

 - [Instalaciones previas](/api_flask/lineamientos_previos.md)

Una vez se tengan los requerimientos previos mencionados anteriormente, se debe realizar los siguientes pasos:  

1. Creamos y asignamos el nombre de nuestra API_FLASK 
 
```
mkdir my_flask_api   
cd my_flask_api
``` 

2 . Después de ello creamos la estructura de directorios y archivos basados al proyecto, el siguiente modelo es una breve idea que se puede tener como referencia de la creacion del API de FLASK 
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
│   ├── document.py 
│   ├── error.py 
│   └── healthCheck.py 
├── entrypoint.sh 
├── imagedef.json 
├── models/ 
│   ├── __init__.py 
│   ├── eval_doc_crud_res.py 
│   ├── model_params.py 
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

3. Despues de tener la estrutura del proyecto definida correctamente, se procede a configurar Flask y Swagger, en los siguientes archivos

* ` api.py`  Configura la aplicación, inicia el servidor y registra los Blueprints (componentes modulares de Flask). Este archivo es obligatorio y necesario para definir y arrancar tu aplicación Flask

```python
from flask import Flask
from flasgger import Swagger
from routers import router

app = Flask(__name__)
swagger = Swagger(app)

app.register_blueprint(router, url_prefix='/api')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```

* `conf/conf.py` Almacena la configuración de tu aplicación Flask en un lugar centralizado, facilita el mantenimiento y escalabilidad
  
```python
import os

class Config:
    DEBUG = True
    TESTING = False
    SECRET_KEY = os.urandom(24)

config = Config()


```

* `routers/router.py` Organiza y registra las rutas de tu aplicación. Usa Blueprints para modularizar la aplicación.

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

* `controllers/healthCheck.py` Mejora la organización, define las funciones para manejar las rutas específicas.
```python
from flask import jsonify

def get_health():
    return jsonify({"status": "UP"})

```
  
* `controllers/document.py` Este archivo maneja las solicitudes relacionadas con documentos y define las funciones para los endpoints de documentos.
  
```python
from flask import request, jsonify

def add_document():
    data = request.get_json()
    # Implement logic to add document
    return jsonify({"message": "Document added", "data": data})

```  
  
* `swagger/swagger.yml` Define la documentación de la API usando el estándar Swagger/OpenAPI.
```python

swagger: "2.0"
info:
  description: "API documentation"
  version: "1.0.0"
  title: "My Flask API"
paths:
  /api/health:
    get:
      tags:
      - "Health"
      summary: "Health check endpoint"
      description: ""
      responses:
        200:
          description: "Successful operation"
  /api/document:
    post:
      tags:
      - "Document"
      summary: "Add a document"
      description: ""
      parameters:
      - in: "body"
        name: "body"
        description: "Document object"
        required: true
        schema:
          type: "object"
          properties:
            name:
              type: "string"
            content:
              type: "string"
      responses:
        200:
          description: "Document added"


```

4. Realizar configuracion de Docker con el archivo de texto Dockerfile con instrucciones para construir una imagen de Docker
  
```Docker
FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["sh", "entrypoint.sh"]

```
5.  entrypoint.sh, es un script de shell que se ejecuta cuando el contenedor se inicia activando el entorno virtual de Python

```python
#!/bin/bash
source venv/bin/activate
exec gunicorn -b 0.0.0.0:5000 api:app

```
6.  Crear requirements.txt para que el archivo liste todas las dependencias de Python que tu aplicación necesita.
```
flask
flasgger
gunicorn
```


7. Probar la API, se realiza por medio de la terminal, debido a que se debe construir y correr el contenedor Docker, acceder a la API y la documentación de Swagger:
```Docker

docker build -t my_flask_api .
docker run -p 5000:5000 my_flask_api

```
  - API: http://localhost:5000/api/health
Swagger: http://localhost:5000/apidocs
