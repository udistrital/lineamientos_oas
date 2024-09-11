# Comentarios Campos de una Tabla

Cuando sea posible, crear la estructura de la base de datos con la descripción de los campos
mediante comentarios. Esto permite que el diccionario de datos pueda ser generado de forma
automática mediante herramientas o consultas a la base de datos.

1. Los comentarios almacenados en el campo COMMENTS, o el que haga sus veces, debe ser en español, siempre que sea posible.
2. Los comentarios deben describir breve y claramente el dato que se almacena en el campo.
3. No se deben utilizar caracteres especiales en los comentarios.
4. No se debe utilizar la letra Ñ o ñ.
5. No es necesario describir el tipo de dato que se almacena (Number, Varchar, Etc), esto se obtiene de la estructura de la tabla.
6. Para el caso de los campos llave, (Primaria, Foranea, Etc) se recomienda indicar la descripción y característica de la lleva en el comentario. También, describir la relación.
7. El campo ESTADO, no necesita ser comentado.
8. Si la tabla implementa un campo ESTADO adicional, por necesidad o por funcionalidad, este debe ser comentado y descrito.
9. Si el campo es un arreglo, indicar en los comentarios, de manera breve y concisa, los datos que se almacenan.
10. Si el campo en un Json, indicar en los comentarios, de manera breve y concisa, los datos que se almacenan.
11. Si el campo corresponde a un autonumerico, por favor indicarlo en el comentario.
12. Si el campo se obtiene automáticamente de una secuencia, por favor indicarlo en el comentario e incluir el nombre de la misma.
