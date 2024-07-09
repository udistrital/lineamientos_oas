## Estructura API FLASK :file_folder:

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

Se espera una estructura semejante que cumpla con los siguientes criterios, referentes al modelo anterior: 

- **Dockerfile**: Archivo de configuración para Docker, que contiene instrucciones para construir una imagen Docker de la aplicación. 
- **README.md**: Documento de texto que incluye una descripción del proyecto, instrucciones de instalación y uso, y otra información relevante para los desarrolladores, usuarios o licenciamiento.  
- **api.py**: Archivo principal de la aplicación Flask. Aquí es donde se inicializa la aplicación y se configuran las rutas principales. 
- **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
- **conf.py**: Archivo de configuración donde se establecen variables y configuraciones para la aplicación. 
- **controllers/**:
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **document.py**: Controlador para manejar operaciones relacionadas con documentos. 
  - **error.py**: Controlador para manejar errores y excepciones. 
  - **healthCheck.py**: Controlador para manejar verificaciones de salud de la aplicación (por ejemplo, /health). 
- **entrypoint.sh**: Script de shell que se ejecuta cuando se inicia un contenedor Docker. Generalmente se utiliza para configurar el entorno y ejecutar la aplicación. 
- **imagedef.json**: Archivo de definición de imagen, posiblemente utilizado para la configuración de despliegue o CI/CD. 
- **models/**: 
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **eval_doc_crud_res.py**: Archivo que define el modelo para la evaluación de documentos CRUD. 
  - **model_params.py**: Archivo que define parámetros de los modelos. 
  - **utils.py**: Utilidades y funciones auxiliares para los modelos. 
- **requirements.txt**: Archivo que lista las dependencias de Python que necesita la aplicación. Se utiliza para instalar los paquetes necesarios usando pip. 
- **routers/**: 
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **router.py**: Archivo que define las rutas de la aplicación, asociando URLs con funciones controladoras. 
- **sonar-project.properties**: Archivo de configuración para SonarQube, una herramienta de análisis estático de código. Contiene propiedades y configuraciones para el análisis del proyecto. 
- **swagger/**: 
  - **swagger.json**: Archivo de definición de la API en formato JSON para Swagger. 
  - **swagger.yml**: Archivo de definición de la API en formato YAML para Swagger. 

Esta estructura modular y organizada facilita la mantenibilidad y escalabilidad del proyecto, permitiendo a los desarrolladores trabajar de manera eficiente en diferentes aspectos de la aplicación.
