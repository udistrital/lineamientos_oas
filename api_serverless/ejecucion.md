# Ejecución en local

1. **Instalación de dependencias:** Antes de correr la aplicación localmente, es una práctica común instalar librerías de terceros o dependencias que la aplicación deberá utilizar. Estas dependencias están definidas en un archivo que varía dependiendo del lenguaje, por ejemplo, **requirements.txt** para Python. 
    ```
      cd ~/environment/sam-app/hello_world
      pip3 install -r requirements.txt
    ```

2. **Ejecutar un servidor local HTTP que simula un API Gateway:**
    ```
      cd ~/environment/sam-app
      sam local start-api --port 8080
    ```

3. **Probar endpoint:** Una vez que tu servidor local está ejecutándose, puede enviar peticiones HTTP para probar, usando una ventana de navegador. O usando curl:
    ```
      curl http://localhost:8080/hello
    ```