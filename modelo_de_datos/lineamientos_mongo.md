# Modelos de Datos en Mongo


## Lineamientos de nombramiento en general

Para el nombramiento de Colecciones, Documentos y Campos tenga en cuenta:
-	Los nombres deben ser descriptivos, intuitivos y simples, de forma que pueda identificarse fácilmente qué representan.
-	La longitud debe ser de entre 10 y 30 caracteres.
-	Use nombres en español.
-	El nombramiento debe ser siempre en singular.
-	Si el nombre está compuesto por dos o más palabras, cada palabra debe ir en singular y debe utilizarse notación snake case, haciendo uso de _ como separador.
-	Evite redundancia en los nombres. 


## Tipo de datos

Considere estos tipos de datos como sugerencia para el almacenamiento de los datos:
-	ObjectId - "objectId": actúa como una llave principal. MongoDB automáticamente genera un objetoId para el _id. Los valores de ObjectId son de 12 bytes de longitud. 

```sql
  -- Ejemplo:
  "_id": ObjectId("507f191e810c19729de860ea")
  ```
