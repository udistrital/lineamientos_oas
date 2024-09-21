# Construcción de la aplicación

Para construir el proyecto SAM utilizaremos el siguiente comando (en la raíz de la carpeta de nuestro proyecto, ejemplo: sam-app): 
```
cd ~/environment/sam-app
sam build
```

Este comando itera a lo largo de las funciones de tu aplicación buscando el archivo de manifiesto (como **requirements.txt**) que contiene dependencias y automáticamente crea los artefactos para su despliegue. 
[Documentación oficial](https://catalog.workshops.aws/complete-aws-sam/es-US/module-3-manual-deploy/20-build)

Cuando la construcción finaliza con éxito, verás un nuevo directorio creado en la raíz del proyecto llamado **.aws-sam**. Cabe mencionar que es una carpeta oculta, por lo que, si quiere verla en el IDE, asegúrese de activar la opción de: Mostrar archivos ocultos. 