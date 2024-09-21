# Cambios en el codigo (Ejemplo)

Una vez identificado la arquitectura a desarrollar (aspectos técnicos), se realiza la creación de una función lambda para cada colecciónque tengamos en nuestro modelo de datos, que atenderá las funciones básicas del CRUD (create, update, delete, get_all y get_one).

También se realizó una función más, la cual consiste en una función health para obtener el estado del API Gateway. 

El proyecto lleva la siguiente estructura (Utilizando como ejemplo [plantillas_crud_serverless](https://github.com/udistrital/plantillas_crud_serverless/tree/feature/samServerless)):

```
    📁plantillas_crud_serverless
    └── 📁database
        └── plantillas_crud.png
    └── 📁src
        └── 📁handlers
            └── 📁crud_plantilla
                └── __init__.py
                └── app.py
                └── requirements.txt
            └── 📁crud_tipo_plantilla
                └── __init__.py
                └── app.py
                └── requirements.txt
            └── 📁health
                └── __init__.py
                └── app.py
        └── __init__.py
    └── .gitignore
    └── env.example.json
    └── README.md
    └── samconfig.toml
    └── template.yaml
```

- Contiene una carpeta llamada database, la cual contiene la imagen del modelo de datos. 

- Dentro de la carpeta src, contiene los handlers, las carpetas de acuerdo con el CRUD de cada colección (plantilla y tipo_plantilla) del modelo y la función correspondiente a health para obtener el estado del API Gateway, la cual cada una contiene el código en **app.py**, donde se realizan cada una de las funciones principales contenidas en nuestra función Lambda y las dependencias en el archivo **requirements.txt**. Y la función health, la cual contiene únicamente el código en el archivo **app.py** ya que no necesita dependencias. 

- El archivo **template.yaml**, el cual contiene la configuración de la aplicación. Es un archivo clave en el que describe todos los recursos de la aplicación, como funciones Lambda, bases de datos, APIs, permisos y demás servicios de AWS que serán necesarios para desplegar y ejecutar la aplicación.