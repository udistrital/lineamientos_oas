
# Prerrequisitos

Principalmente es necesario contar con una cuenta de Amazon Web Services (AWS), la cual nos permitirá gestionar todo tipo de servicios que nos ofrece.  

Luego, se requiere de las siguientes herramientas para el desarrollo en local: 

1. **AWS CLI (Command Line Interface):** Utilizada para interactuar con los servicios de AWS desde la línea de comandos.
&nbsp; 
Para instalar la AWS CLI, ejecute los siguientes comandos:
[Documentación oficial](https://docs.aws.amazon.com/es_es/cli/latest/userguide/getting-started-install.html)
&nbsp;
    ``` 
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
    unzip awscliv2.zip
    sudo ./aws/install 
    ``` 

    Comprobar la instalación:
    ``` aws --version ``` 
&nbsp;

2. **Python:** Necesario para ejecutar y desarrollar funciones Lambda basadas en Python.
    &nbsp;
    Comando de versionamiento
    ``` 
    python3 --version 
    ``` 

    Comando de instalación de no tenerlo instalado  

    ``` 
    sudo apt install python3 
    ``` 

3. **Docker:** Necesario para creación de imagen, para emular el entorno de AWS Lambda en tu máquina local. 
[Documentación oficial](https://www.docker.com/)
&nbsp;

4. **AWS SAM (Serverless Application Model):** Framework que facilita el despliegue y la gestión de aplicaciones serverless. 
[Documentación oficial](https://docs.aws.amazon.com/es_es/serverless-application-model/latest/developerguide/install-sam-cli.html)
&nbsp;
    1. Descargue el [archivo .zip de AWS SAM CLI](https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip).
    &nbsp;
    
    2. Descomprima los archivos de instalación en el directorio que prefiera. 
        ``` 
        unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
        ``` 

    3. Instale la CLI de AWS SAM ejecutando el install ejecutable. 
        ``` 
        sudo ./sam-installation/install
        ``` 
    4. Verifique la instalación
        ``` 
        sam --version
        ``` 