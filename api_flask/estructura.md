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
│   ├── controller.py 
│   ├── error.py 
│   └── healthCheck.py 
├── entrypoint.sh 
├── imagedef.json 
├── models/ 
│   ├── __init__.py 
│   ├── model1.py 
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

---


### Comandos para la estructura  :notebook:

En la carpeta de `models`, los archivos son ejemplos y no son obligatorios en la estructura, a excepción de `__init__.py`. Se recomiendan `model1.py` y `utils.py` ya que pueden llegar a ser muy útiles.

```
# Navegar al directorio del proyecto 
cd my_flask_api

# Crear archivos en el directorio raíz 
touch Dockerfile README.md api.py entrypoint.sh go.mod imagedef.json requirements.txt sonar-project.properties

# Crear el directorio conf y los archivos dentro de él 
mkdir -p conf
touch conf/__init__.py conf/conf.py

# Crear el directorio controllers y los archivos dentro de él 
mkdir -p controllers
touch controllers/__init__.py controllers/controller.py controller/error.py controllers/healthCheck.py 

# Crear el directorio models y los archivos dentro de él 
mkdir -p models
touch models/__init__.py  models/model1.py models/utils.py

# Crear el directorio routers y los archivos dentro de él 
mkdir -p routers
touch routers/__init__.py routers/router.py

# Crear el directorio swagger y los archivos dentro de él 
mkdir -p swagger
touch swagger/swagger.json swagger/swagger.yml
```

--- 

### Explicacion. 

Se espera una estructura semejante que cumpla con los siguientes criterios, referentes al modelo anterior: 

- :whale:: **Dockerfile**: Archivo de configuración para Docker, que contiene instrucciones para construir una imagen Docker de la aplicación.
---
  
- :open_book: **README.md**: Documento de texto que incluye una descripción del proyecto, instrucciones de instalación y uso, y otra información relevante para los desarrolladores, usuarios o licenciamiento.
---

- :card_index: **api.py**: Archivo principal de la aplicación Flask. Aquí es donde se inicializa la aplicación y se configuran las rutas principales.
---
- :card_index_dividers: **conf/**:
    - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
    - **conf.py**: Archivo de configuración donde se establecen variables y configuraciones para la aplicación.
---

- :card_index_dividers: **controllers/**:
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **controllert.py**: Controlador para manejar operaciones relacionadas. 
  - **error.py**: Controlador para manejar errores y excepciones. 
  - **healthCheck.py**: Controlador para manejar verificaciones de salud de la aplicación (por ejemplo, /health).
---

- :card_index: **entrypoint.sh**: Script de shell que se ejecuta cuando se inicia un contenedor Docker. Generalmente se utiliza para configurar el entorno y ejecutar la aplicación. 
---

- :camera_flash: **imagedef.json**: Archivo de definición de imagen, posiblemente utilizado para la configuración de despliegue o CI/CD.
---

- :card_index_dividers:  **models/**: 
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **model1.py**: Archivo que define parámetros de los modelos. 
  - **utils.py**: Utilidades y funciones auxiliares para los modelos.
---

- :books: **requirements.txt**: Archivo que lista las dependencias de Python que necesita la aplicación. Se utiliza para instalar los paquetes necesarios usando pip.
---

- :bookmark_tabs:  **routers/**: 
  - **\_\_init\_\_.py**: Indica que este directorio es un paquete de Python. 
  - **router.py**: Archivo que define las rutas de la aplicación, asociando URLs con funciones controladoras.
---

- :balance_scale: **sonar-project.properties**: Archivo de configuración para SonarQube, una herramienta de análisis estático de código. Contiene propiedades y configuraciones para el análisis del proyecto.
---

- :memo: **swagger/**: 
  - **swagger.json**: Archivo de definición de la API en formato JSON para Swagger. 
  - **swagger.yml**: Archivo de definición de la API en formato YAML para Swagger. 

---

Esta estructura modular y organizada facilita la mantenibilidad y escalabilidad del proyecto, permitiendo a los desarrolladores trabajar de manera eficiente en diferentes aspectos de la aplicación.
