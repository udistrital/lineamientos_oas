# Despliegue de la aplicación

El comando sam deploy despliega tu aplicación iniciando una pila de CloudFormation. Este comando tiene un modo interactivo guiado, que se habilita especificando el parámetro --guided. Se recomienda implementar con modo guiado por primera vez, ya que capturará la configuración para despliegues futuros.
[Documentación oficial](https://catalog.workshops.aws/complete-aws-sam/es-US/module-3-manual-deploy/30-deploy)

Ejecuta el siguiente comando en el mismo nivel de la carpeta donde se ubica el archivo template.yaml:
```
cd ~/environment/sam-app
sam deploy --guided
```

Esto te guiará a través de una serie de preguntas. Tus respuestas se guardarán en un archivo de configuración al final, lo que acelerará futuras implementaciones. Al presionar la tecla Enter se aceptará el valor predeterminado para cada pregunta que se muestra entre corchetes, por ejemplo [sam-app]. Las mayúsculas son las predeterminadas, por ejemplo, al presionar Enter en [s/N] se establecerá por defecto No. 

Este comando deberá tomar algunos minutos para terminar porque está creando los recursos (Funciones Lambda, API Gateway, Roles de IAM) en la cuenta de AWS.

Tenga en cuenta el valor de salida, el **Value** es el punto final https para su nueva API Gateway. 