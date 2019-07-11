# Modelo de Datos


## Bases de Datos y Esquemas

Para los sistemas en nuevas tecnologias en los que tienen bases de datos en *PostgreSQL* se manejará  inicalmente **cuatro (4)** bases de datos llamada de la siguiente manera:

```bash
academica
administrativa
core
financiera
```

Cada una de estas bases de datos contendra un esquema por funcionalidad.

  ![Crear Tabla](/modelo_de_datos/img/bd_esquemas.png)

**Nota**: Los esquemas se nombran por funcionalidad y **no** por nombre de la aplicación.

Ejemplo por nombre de aplicación:

  ![Crear Tabla](/modelo_de_datos/img/error_comun.png)

Una representación cercana a la estructura de bd seria como se muestra a continuación:

  ![Crear Tabla](/modelo_de_datos/img/bd_all.png)

Un Ejemplo de la bd de Financiera sera la siguiente:

  ![Crear Tabla](/modelo_de_datos/img/ejemplo_bd_esquemas.png)

## Tablas

Las tablas deben nombrarse utilizando _ como separador, en singular y sin utilizar espacios en blanco.

Si el nombre es compuesto las dos palabras deben ir en singular. Por ejemplo: venta_producto

```bash
cliente
estudiante
profesor_planta
```

## Columnas

Los campos de una tabla corresponden a los atributos de una entidad, describen propiedades de la misma.

Las columnas deben ser nombradas según los lineamientos a continuación:

- Los nombres deben ser simples, representativos e intuitivos.

- Los nombres de las columnas de una tabla deben estar expresados en singular, usando _ como separador.
- **El campo clave** o identificador de una tabla debe nombrarse como **id** y sebe ser:

  opción1: de tipo de dato Integer y estar asociado a una secuencia.

  Opción2: de tipo de dato serial que creará automaticamente la seguencia.

  ```sql
  -- Opción1 Para la tabla contrato el campo clave debe ser:
  id integer NOT NULL DEFAULT nextval('public.contrato_id_seq'::regclass)

  -- Opción2 Para la tabla usuario, usando tipo de dato serial:
  id serial NOT NULL,
  ```

  **Nota**: Se recomienda la Opción2, es mas rapida.

    ![Crear Tabla](/modelo_de_datos/img/001.png)

- Las columnas que hacen parte de una **llave foránea**, es decir referencian al campo ID de otra tabla, deben ser nombradas tal cual el nombre de la tabla que referencian y finalizar con **_id**.

    ![Crear Tabla](/modelo_de_datos/img/002.png)

- Los campos que almacenan un valor de moneda deben ser de tipo numeric(20,7)
- Los campos que almacenan un valor de porcentaje deben ser de tipo numeric(5,4)
- Para los campos que almacenen caracteres se recomienda usar el tipo de dato *character varying* especificando su longitud.
- Especificar la longitud del campo si aplica.

  ```sql
  --Indicar la longitud del campo si el tipo de dato es character varying:
  character varying(15)

  -- Especificar longitud y precisión del campo si el tipo de dato es Numeric:
  numeric(5,2).
  ```
- Se debe incluir el campo **activo** de tipo *boolean*, el cual indica el estado del registro y se registra por defecto como *TRUE*.

- Se debe incluir el campo **fecha_creacion** de tipo *timestamp*, el cual indica el día y hora en el que el registro ingreso a la base de datos.

- Se debe incluir el campo **fecha_modificacion** de tipo *timestamp*, el cual indica el día y hora de la ultima modificación que se realizó al registro, en caso que el registro apenas este ingresando, este valor debe ser el mismo del campo *fecha_creacion*.

    ![fechas Tabla](/modelo_de_datos/img/fechas_tablas.png)
    
## Claves primarias

La clave primaria es un conjunto de campos que identifica de forma única un registro en una tabla, debe entenderse que no es igual al concepto de columna cuya nomenclatura se explica en el punto 6. Son un caso particular de un índice, la nomenclatura para la restricción de este índice debe hacerse usando el nombre de la tabla, anteponiendo el prefijo pk y guión bajo.

```sql
pk_cliente
```

## Restricciones claves foráneas

Las claves foráneas son usadas para definir vínculos entre tablas relacionadas. Una clave foránea establece una relación entre una o más columnas de una tabla y la clave primaria de la tabla referenciada. El patrón para la nomenclatura de restricción de clave foránea es el siguiente:

```sql
fk_<tabla_que_referencia>_<tabla_referenciada>
Ejemplo:
fk_orden_pago_cliente
```

## Restricciones Unique

La nomenclatura para este tipo de restricciones es la siguiente cuando hablamos de Unique constraint:

```sql
uq_<nombre_columna>_<nombre_tabla>
Ejemplo:
uq_identificacion_persona
```

## Restricciones Check

La nomenclatura para este tipo de restricciones es la siguiente cuando hablamos de Check constraint:

```sql
ck_<nombre_columna>_<nombre_tabla>
Ejmplo:
ck_genero_persona
```

## Índices

Los índices son un mecanismo para aumentar la eficiencia de localización y acceso de un registro en una tabla en la base de datos, opcionalmente asegurando unicidad de los valores del índice. La definición de índices tiene un impacto positivo en los tiempos de consulta de registro y uno negativo en los de inserción y actualización de los campos del índice. Los índices están asociados a una tabla y a un conjunto de campos de la tabla, a su vez pueden ser únicos o no.

La nomenclatura es la siguiente ( [_aux] denota que puede ir otra palabra si se requiere una diferenciación en particular de otros índices con nombre similar):

```sql
[idx_]<tabla>_<campo>[_aux]    
Ejemplo:
idx_persona_genero
```
