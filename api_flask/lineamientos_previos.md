
# Uso de Python 

1. Para ello se debe tener como primera instancia, verificar si se tiene el lenguaje de Python instala en el WSL ya que es “explicación breve de la relación de Python con flask”. En caso contrario de no tenerlo en WSL se realizará su instalación desde la terminal 

>#### comando de versiona miento 

``` python3 --version ``` 

>#### comando de instalación de no tenerlo instalado  

``` sudo apt install python3 ``` 

 
2. Se debe tener el gestor de paquetes para Python para instalar y gestionar bibliotecas y dependencias de software que no forman parte de la biblioteca estándar de Python, por eso de realizar la instalación del mismo con: 


>#### comando de instalación de pip 

``` sudo apt install python3-pip ``` 

>#### comando de verificación sobre la instalación de pip  

``` pip3 --version ```

# Uso de Docker

1. Como primer objeivo se debe realizar la instalacion de Docker e iniicar su servicio 
```
sudo apt update
sudo apt install docker.io
sudo service docker start
```

2. Luego se debew configurar Docker para que se inicie al arrancar y verificar su instalacion 
```
sudo systemctl enable docker
docker --version
```

3. Y probar que todo este en ejecucion de forma correcta
```
docker run -p 5000:5000 my_flask_api
```
