Generación de API Flask  

Para el debido procedimiento del API Flask se tendrá en cuenta un entorno de desarrollo por medio de WSL de ubuntu 22.04, la cual se realizará los siguientes prerrequisitos para la generación correcta del API FLASK 

LINK DE PRE REQUISITOS (.MD) 

Una vez se tengan los requerimientos previos mencionados anteriormente, se debe realizar los siguientes pasos:  

#1. Creamos y asignamos el nombre de nuestra API_FLASK 
 
```mkdir my_flask_api```  
```cd my_flask_api ```
>#### comando para instalación de venv y crear el entorno virtual de Python 
```sudo apt install python3-venv ```
```python3 -m venv venv``` 

#2 . Después de ello creamos la estructura de directorios y archivos basados al proyecto, el siguiente modelo es una breve idea que se puede tener como referencia de la creacion del API de FLASK 
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
    
LINK, EXPLICACION DE LA ESTRUCTURA  





