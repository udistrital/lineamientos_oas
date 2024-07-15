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

-[Guia de refactorizacion del API Flask](/api_flask/refactorizacion_api_flask.md)

--- 

# Uso de local :computer:

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
