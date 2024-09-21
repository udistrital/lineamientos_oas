# Configuración en AWS

**Observación:** Este apartado no es responsabilidad del desarrollador, sino de la persona encargada de la administración en AWS. 

Para el correcto funcionamiento de las funciones Lambda, es necesario que se encuentren dentro del mismo segmento de red (**VPC**). Para ello, es imprescindible crear **políticas** específicas para **cada rol** asociado a las funciones Lambda que se conecten a la base de datos, garantizando así una conexión exitosa. 

Finalmente, se debe configurar el parámetro de **VPC** para cada función Lambda que necesite conectarse a la base de datos. Los parámetros requeridos son los siguientes: 
- VPC 
- Subred 
- Grupo de seguridad

Ejemplo de [plantillas_crud_serverless](https://github.com/udistrital/plantillas_crud_serverless/tree/feature/samServerless):
![VPC](/api_serverless/img/vpc.png)


Por último, es necesario declarar todas las variables de entorno requeridas para la conexión a la base de datos. Para ello, es fundamental que la base de datos haya sido previamente creada, gestión realizada por parte de los DBAs. 

La persona encargada de la administración de AWS usualmente será quien asigne las variables de entorno correspondientes a cada función Lambda, dentro de la sección de Configuración, específicamente en el apartado de **Variables de entorno**.

Ejemplo de [plantillas_crud_serverless](https://github.com/udistrital/plantillas_crud_serverless/tree/feature/samServerless):
![Variables de entorno](/api_serverless/img/variables_entorno.png)