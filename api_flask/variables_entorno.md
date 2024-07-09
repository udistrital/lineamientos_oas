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
