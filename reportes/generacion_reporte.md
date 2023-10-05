# Reportes

Se tiene el siguiente reporte como ejemplo: [Ejemplo](/reportes/reporte_demo.rptdesign)

## Crear Reporte
Para crear un reporte, se debe ir a File -> New -> New Report...

![Crear Reporte](/reportes/img/crear_1.jpeg)

Allí se asigna un nombre y una ubicación al archivo.

## Construcción de reporte

Para este ejemplo, se construirá un reporte que consulta los detalles básicos de un trabajo de grado específico. Para determinar el trabajo de grado, el usuario ingresará el id del trabajo de grado como parámetro.

### Parámetros

El parámetro se crea así:

![Crear Parámetro 1](/reportes/img/parametro_1.jpeg)

Luego, se asigna un nombre y valor por defecto:

![Crear Parámetro 2](/reportes/img/parametro_2.jpeg)

### Data Sources

La utilidad principal de esta herramienta es crear un reporte a partir de la conexión directa a las bases de datos. Para ello, se deben crear dichas conexiones, las cuales en este contexto se llaman **Data Sources**

Para crear un data source, se requieren los datos de la conexión, esto es: credenciales y host. Una vez se tengan estos datos, se crea el Data Source así:

![Crear Data Source 1](/reportes/img/data_source_1.jpeg)

Se selecciona el tipo de data source. Para la conexiones a bases de datos como postgres, se selecciona JDBC:
![Crear Data Source 2](/reportes/img/data_source_2.jpeg)

A continuación, se indican los datos propios para la conexión a la base de datos:
![Crear Data Source 3](/reportes/img/data_source_3.jpeg)

### Data Sets

Una vez establecida la conexión, se procede a definir la consulta que traerá los datos necesarios para el reporte. Se cre el data set así:

![Crear Data Set 1](/reportes/img/data_source_1.jpeg)

Lugo, se selecciona la conexión o Data Source:

![Crear Data Set 2](/reportes/img/data_set_2.jpeg)

Finalmente, se define el script que traerá los datos:

![Crear Data Set 3](/reportes/img/data_set_3.jpeg)

Se selecciona el o los parámetros según sea el caso:

![Crear Data Set 4](/reportes/img/data_set_4.jpeg)

Se visualizan los datos que devuelve la consulta:

![Crear Data Set 5](/reportes/img/data_set_5.jpeg)

### Joint Data Sets

En algunos casos, por la naturaleza de la infraestructura de los sistemas, no todos los datos estarán en la misma base de datos. En estos casos, se debe cruzar la información de varios **Data Sets**, lo cual se hace mediante un **Joint Data Set**

Se crean de la siguiente manera:

![Crear Joint 1](/reportes/img/joint_1.jpeg)

Se seleccionan los dos data sets sobre los que se hará el cruce de información y las columnas sobre las que se hará el join, así:

![Crear Joint 2](/reportes/img/joint_2.jpeg)

### Interfaz

Lo más común es que el reporte requiera de una tabla en la que se listen una serie de datos, ello se logra creando una tabla así:

![Crear Joint 1](/reportes/img/tabla_1.jpeg)

Se selecciona el data set y las columnas que se quieren visualizar:

![Crear Joint 2](/reportes/img/tabla_2.jpeg)

El resultado es el siguiente:

![Crear Joint 3](/reportes/img/tabla_3.jpeg)

Finalmente, al final de la tabla se puede agregar una suma o un conteo de las filas, etc. Ello se hace agregando esta información al footer de la tabla así:

![Crear Joint 4](/reportes/img/tabla_4.jpeg)

Se selecciona la operación que se evaluará, en este caso será **COUNT**

![Crear Joint 5](/reportes/img/tabla_5.jpeg)

Por último: El título de las columnas se puede editar así:

![Crear Joint 6](/reportes/img/tabla_6.jpeg)

Al final, se ve así:

![Crear Joint 7](/reportes/img/tabla_7.jpeg)

## Styles

Además, se puede cambiar el tamaño de la fuente, bordes, etc, así:

![Styles 1](/reportes/img/styles_1.jpeg)

## Imágenes

Las imágenes que se quieran incluir en el reporte, se deben agregar así:

![Img 1](/reportes/img/img_1.jpeg) ![Img 2](/reportes/img/img_2.jpeg)

## Vista Previa

Finalmente, el la vista previa del reporte se genera de la siguiente manera:

![Prev 1](/reportes/img/prev_1.jpeg)

Y, en este caso, se ve así:

![Prev 2](/reportes/img/prev_2.jpeg)

