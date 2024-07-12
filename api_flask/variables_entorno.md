# Ejecucion del API FLASK 

En el siguiente espacio se asignarán los pasos a seguir para ejecutar un API con Flask con variables de entrono 
 
1. Moverse a la carpeta del repositorio u API diseñado 

```cd my_flask_api```
 
2. Alimentar todas las variables de entorno que utiliza el proyecto, ya sea por medio de comando o cargando un archivo .env 
```
export API_PORT=8080 NUXEO_URL=https://xxxxxx/nuxeo/ NUXEO_USERNAME=xxxxxxx NUXEO_PASSWORD=xxxxxxx DOCUMENTOS_CRUD_URL=http://xxxxxxxxx/v1/ 
source .ev // en caso de cargar las variables por archivo
```
3. Instalar dependencias de python segun el listado del archivo
```pip install -r requirements.txt ```
 
4. Ejecutar el api 
```python api.py ```

5. Implementamos el swagger para la Documentación, para ello debemos instalar flasgger
```pip install flasgger```

6. Luego se debe edita tu api.py para incluir flasgger, de la siguiente forma:

```python
from flask import Flask, jsonify
from flasgger import Swagger
import os

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/')
def home():
    return "API Flask funcionando"

@app.route('/v1/')
def api_info():
    """
    Información de la API
    ---
    responses:
      200:
        description: Un diccionario con las variables de entorno
    """
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
Nota: se puede acceder a la documentación de Swaggercon la URL(http://localhost:8080/apidocs/)

