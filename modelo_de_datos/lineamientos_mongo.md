# Modelos de Datos en Mongo


## Lineamientos de nombramiento en general

Para el nombramiento de Colecciones, Documentos y Campos tenga en cuenta:
-	Los nombres deben ser descriptivos, intuitivos y simples, de forma que pueda identificarse fácilmente qué representan.
-	La longitud debe ser de entre 10 y 30 caracteres.
-	Use nombres en español.
-	El nombramiento debe ser siempre en singular.
-	Si el nombre está compuesto por dos o más palabras, cada palabra debe ir en singular y debe utilizarse notación snake case, haciendo uso de _ como separador.
-	Evite redundancia en los nombres. 


## Tipos de datos

Considere estos tipos de datos como sugerencia para el almacenamiento de los datos:

-	ObjectId - "objectId": actúa como una llave principal. MongoDB automáticamente genera un objetoId para el _id. Los valores de ObjectId son de 12 bytes de longitud. 

```sql
  -- Ejemplo:
  "_id": ObjectId("507f191e810c19729de860ea")
  ```
- String - "string": conjunto de caracteres codificado en UTF-8.  

```sql
  -- Ejemplo:
  “nombre”: “Pedro Perez”
  ```
- Integer: valores numéricos enteros.
 o	“int”: longitud de 32 bits. 
 o	“long”: longitud de 64 bits. 

```sql
  -- Ejemplo:
  "edad": 30.
  ```
- Double - "double": valores numéricos decimales. 

```sql
  -- Ejemplo:
  "nota": 30.5.
  ```
-	Boolean - "bool": representa valores lógicos true o false. 

```sql
  -- Ejemplo:
  "activo": true
  ```
-	Date - "date": valores asociados a fecha, con una longitud de 32 bits.  

```sql
  -- Ejemplo:
  "fecha_creacion": ISODate("2024-08-08T12:34:56Z")
  ```
-	Timestamp - "timestamp": valores asociados a fecha y hora, con una longitud de 64 bits. Utilizado internamente por MongoDB para operaciones relacionadas con la replicación y sharding.

```sql
  -- Ejemplo:
  {"$timestamp": { "t": 1624000000, "i": 1 }}
  ```
-	Array – “array”: lista de elementos.  

```sql
  -- Ejemplo:
  "materias": ["cálculo", "física", "programación"]
  ```
-	Binary data - "binData": Permite almacenar datos binarios, como imágenes, archivos o cualquier otro tipo de datos en formato binario.  

```sql
  -- Ejemplo:
  BinData(0, "base64encodedData")
  ```
-	Object - "object": Almacena estructuras jerárquicas como documentos embebidos. 

```sql
  -- Ejemplo:
  "ubicacion": { 
    "direccion": " Calle 13 # 31 -75", 
    "ciudad": "Bogotá", 
    "pais": "Colombia"
  }

  ```
Mayor información puede consultarse en: https://www.mongodb.com/docs/manual/reference/bson-types/ 

## Modelado de datos orientado a consultas y esquemas flexibles

Considere esquemas flexibles con estructuras comunes entre los documentos de una misma colección, podrá adicionar campos de acuerdo con la necesidad u objetivo de la colección. 

```sql
-- Ejemplo: Una colección de matrículas donde algunas matriculas tienen un campo descuento, pero otros no.

---- Matricula sin descuento
{
  "_id": 1,
  "nombre": "Pedro Pérez",
  "matricula": 100000
}
---- Matricula con descuento
{
  "_id": 2,
  "nombre": "Ana Díaz",
  "precio": 80000,
  "descuento": 10
} 

```
Diseñe el modelo en relación a las consultas que sean más frecuentes. Almacene información relacionada en un mismo documento para evitar joins y optimizar tiempos de respuesta. Es posible desnormalizar datos y almacenarlos de forma redundante dentro de un documento para evitar la necesidad de múltiples consultas.

```sql
-- Ejemplo: Una colección separada para “evaluación” y “docentes” en que es posible almacenar los comentarios directamente dentro de los documentos de docentes.

{
  "_id": 1,
  "docente_id": 1,
  "fecha": "2024-08-08",
  "evaluacion": [
    {
      "evalucion_id": 101,
      "criterio": "dominio de temática",
      "nota": 5
    },
    {
      "evaluacion_id": 102,
      "criterio": "preparación de contenidos",
      "nota": 3
    }
  ]
}
```

## Manejo de relaciones

-	Uno a pocos: Implemente embebidos en un mismo documento.

```sql
-- Ejemplo: un proveedor con varias direcciones.

{
  "_id": 1,
  "nombre": "Pedro Perez",
  "direcciones": [
    {"calle": "Calle 1", "ciudad": "Ciudad A"},
    {"calle": "Calle 2", "ciudad": "Ciudad B"}
  ]
}
```

-	Uno a muchos: Haga uso de referencias.
-	  Los campos que asociadas a una referencia deben ser nombradas tal cual el nombre de la colección que referencian y finalizar con _id.
  
```sql
-- Ejemplo: un docente con varias publicaciones.
---- Colección "docentes"
{
  "_id": 1,
  "nombre": "María Rodríguez"
}

---- Colección "publicaciones"
{
  "_id": 1001,
  "titulo": "Lineamientos para diseño y modelado de bases de datos",
  "docente_id": 1
}
```

## Lineamientos generales de campos

Para colecciones que cuyos datos no sean paramétricos:

- Se debe incluir el campo activo de tipo boolean, el cual indica el estado del registro y se registra por defecto como TRUE.
- Se debe incluir el campo fecha_creacion de tipo timestamp, el cual indica el día y hora en el que el registro ingreso a la base de datos.
- Se debe incluir el campo fecha_modificacion de tipo timestamp, el cual indica el día y hora de la ultima modificación que se realizó al registro, en caso que el registro apenas este ingresando, este valor debe ser el mismo del campo fecha_creacion.

## Índices 

MongoDB soporta índices únicos, compuestos, geoespaciales, de texto, entre otros. Los índices deben ser diseñados en función de las consultas más comunes. 
```sql
-- Ejemplo: índice compuesto en la colección estudiante en los campos nombre, código y programa_academico para mejorar el rendimiento de las búsquedas por estos campos.
db.usuarios.createIndex({ nombre: 1, código:1, programa_academico: 1 });
```
