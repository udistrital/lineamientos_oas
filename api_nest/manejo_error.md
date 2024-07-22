<p align="center">
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS Icon" width="100"/>
</p>

<h1 align="center"><b>Documentación para la generación y definición de la estructura de proyecto en APIs con base de datos no relacionales (MongoDB) bajo la tecnología NestJs</b></h1>

### 4. Manejo de error, filtros (query), logger, healtcheck

#### Logger:
Organizar el código del Logger en carpeta separada llamada `logger`. Este código define un middleware en NestJS para registrar las solicitudes HTTP entrantes y las respuestas salientes. A continuación, se explica cada sección del código:

#### Importaciones

```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
```
- `@nestjs/common`: Importa los decoradores y las clases básicas de NestJS.
- `express`: Importa las interfaces Request, Response y NextFunction de Express.

#### Decorador @Injectable
`@Injectable()`

- Este decorador marca la clase LoggerMiddleware como un servicio que puede ser inyectado y gestionado por el contenedor de dependencias de NestJS.

#### Clase LoggerMiddleware
```typescript
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');
```
- `LoggerMiddleware`: Implementa la interfaz NestMiddleware de NestJS.

- `Logger`: Se usa para registrar los mensajes de log. Se instancia con el contexto 'HTTP'.

#### Método `use`
```typescript
use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, body } = request;
    this.logger.log(`[REQ] ${method} ${originalUrl} ${JSON.stringify(body)}`);
```
- `use`: Método obligatorio que se ejecuta para cada solicitud HTTP. Toma tres parámetros:

	- `request`: La solicitud HTTP.
  
	- `response`: La respuesta HTTP.
  
	- `next`: La función que se llama para pasar el control al siguiente middleware.

- Extrae el método HTTP (`method`), la URL original (`originalUrl`) y el cuerpo de la solicitud (`body`).

- Registra la solicitud entrante con el método log del Logger.

#### Sobrescritura de response.write y response.end
```typescript
    var oldWrite = response.write;
    var oldEnd = response.end;
    var chunks = [];
    response.write = function (chunk: any) {
        chunks.push(chunk);
        return oldWrite.apply(response, arguments);
    };
    response.end = function (chunk: any) {
        if (chunk) {
            chunks.push(chunk);
        }
        return oldEnd.apply(response, arguments);
    };
```
- Almacena las referencias originales de los métodos `write` y `end` de `response`.
- Sobrescribe estos métodos para capturar los datos que se envían en la respuesta:
	- `response.write`: Añade los fragmentos (`chunks`) de datos a un array.
	- `response.end`: Añade cualquier fragmento adicional y luego llama al método original.

 #### Evento response.on('finish')
 ```typescript
    response.on('finish', () => {
        const { statusCode } = response;
        const responseBody = Buffer.concat(chunks).toString('utf8');
        this.logger.log(
            `[RESP] ${method} ${originalUrl} ${statusCode} ${responseBody}`,
        );
    });

    next();
}
```

- Se registra un evento `finish` en `response` que se dispara cuando la respuesta se completa.

- Dentro del evento:
	- Se obtiene el código de estado (`statusCode`) de la respuesta.
	- Se concatena y convierte a texto UTF-8 el contenido de la respuesta capturado en `chunks`.
	- Se registra la respuesta saliente con el método `log` del `Logger`.

- Finalmente, se llama a `next()` para pasar el control al siguiente middleware o controlador en la cadena de procesamiento.

#### Healtcheck:
El siguiente código se ubica en src/app.service.ts, Este código define un servicio simple en NestJS para realizar una verificación de salud de la aplicación. A continuación, se explica cada sección del código:

#### Importaciones
 ```typescript
import { Injectable } from '@nestjs/common';
```
- `@nestjs/common`: Importa el decorador `Injectable` de NestJS.

#### Decorador @Injectable
```typescript
@Injectable()
```
Este decorador marca la clase AppService como un servicio que puede ser inyectado y gestionado por el contenedor de dependencias de NestJS.

#### Clase AppService
```typescript
export class AppService {
  healthcheck(): Object {
    return {
      Status: "Ok",
      checkCount: check.count++
    };
  }
}
```
- `AppService`: Clase que proporciona métodos de servicio para la aplicación.

- `healthcheck`: Método que realiza una verificación de salud y retorna un objeto con el estado actual y un contador de verificaciones.

#### Método healthcheck
```typescript
healthcheck(): Object {
  return {
    Status: "Ok",
    checkCount: check.count++
  };
}
```

- `healthcheck`: Método que devuelve un objeto con dos propiedades:
	- `Status`: Una cadena de texto que indica que el estado es "Ok".
	- `checkCount`: Un contador que incrementa en uno cada vez que se llama al método.

#### Clase check
```typescript
export class check {
  static count: number = 0;
}
```
`check`: Clase auxiliar que contiene una propiedad estática `count` utilizada para llevar un conteo de las veces que se ha realizado la verificación de salud.

`static count: number = 0`: Inicializa `count` en 0 y permite que se acceda y modifique de manera global en el contexto de la clase `AppService`.

#### Observaciones:
Se necesita hacer el llamado de LoggerMiddleware en `app.module.ts`.
```typescript
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

#### Filtros (query):

El siguiente código se ubica en src/filters/filters.service.ts, Este código define un servicio en NestJS para procesar y generar filtros de consulta basados en criterios definidos en un objeto DTO (Data Transfer Object). A continuación, se explica cada sección del código:

#### Importaciones
```typescript
import { FilterDto } from './dto/filter.dto';
```
- `FilterDto`: Importa la clase `FilterDto` que contiene los criterios de filtro.

#### Clase FiltersService
```typescript
export class FiltersService {
    constructor(private readonly filterDto: FilterDto) { }
```
- `FiltersService`: Clase que proporciona métodos para generar filtros de consulta.
  
- `filterDto`: Objeto DTO que contiene los criterios de filtro.

#### Método getQuery
```typescript
getQuery(): Object {
    let queryObj = {};
    if (this.filterDto.query) {
        const queryProperties = this.filterDto.query.split(',');
        queryProperties.forEach(function (property) {
            const tup = property.split(/:(.+)/);
            const key = tup[0].split(/__(.+)/);
            if (key[1]) {
                switch (key[1]) {
                    case "icontains":
                        queryObj[key[0]] = { $regex: new RegExp(tup[1], 'i') }
                        break;
                    case "contains":
                        queryObj[key[0]] = { $regex: new RegExp(tup[1]) }
                        break;
                    case "gt":
                        queryObj[key[0]] = { $gt: castValue(tup[1]) }
                        break;
                    case "gte":
                        queryObj[key[0]] = { $gte: castValue(tup[1]) }
                        break;
                    case "lt":
                        queryObj[key[0]] = { $lt: castValue(tup[1]) }
                        break;
                    case "lte":
                        queryObj[key[0]] = { $lte: castValue(tup[1]) }
                        break;
                    case "in":
                        let list = tup[1].split('|')
                        queryObj[key[0]] = { $in: [...list.map(v => castValue(v))] }
                        break;
                    case "not":
                        queryObj[key[0]] = { $ne: castValue(tup[1]) }
                        break;
                    case "inarray":
                        queryObj[key[0]] = { $in: [castValue(tup[1])] }
                        break;
                    case "isnull":
                        if (tup[1].toLowerCase() === 'true') {
                            queryObj[key[0]] = null;    
                        } else {
                            queryObj[key[0]] = { $ne: null }
                        }
                        break;
                    default:
                        break;
                }
            } else {
                queryObj[key[0]] = castValue(tup[1]);
            }
        });
    }
    return queryObj;
}
```
- `getQuery`: Genera un objeto de consulta basado en los criterios de filtro especificados en `filterDto.query`.
  
- `queryObj`: Objeto que almacena los criterios de filtro.
  
- `switch`: Maneja diferentes operadores de filtro como `icontains`, `contains`, `gt`, `gte`, `lt`, `lte`, `in`, `not`, `inarray`, y `isnull`.

#### Método getFields
```typescript
getFields(): Object {
    let fieldsObj = {};
    if (this.filterDto.fields) {
        let fieldsProperties = this.filterDto.fields.split(',');
        fieldsProperties.forEach(function (property) {
            fieldsObj[property] = 1;
        });
    }
    return fieldsObj
}
```
- `getFields`: Genera un objeto de proyección para seleccionar campos específicos.
- `fieldsObj`: Objeto que almacena los campos a proyectar.

#### Método getSortBy
```typescript
getSortBy(): any[]{
    let sortbyArray = [];
    if (this.filterDto.sortby) {
        let sortbyProperties = this.filterDto.sortby.split(',');
        if (this.filterDto.order) {
            let orderProperties = this.filterDto.order.split(',');
            if (orderProperties.length == 1) {
                let orderTerm = (this.filterDto.order == 'desc') ? -1 : 1;
                sortbyProperties.forEach(function (property) {
                    sortbyArray.push([property, orderTerm]);
                });
            } else if (sortbyProperties.length == orderProperties.length) {
                for (let i = 0; i < sortbyProperties.length; i++) {
                    sortbyArray.push([sortbyProperties[i], (orderProperties[i] == 'desc' ? -1 : 1)]);
                }
            } else {
                sortbyProperties.forEach(function (property) {
                    sortbyArray.push([property, 1]);
                });
            }
        } else {
            sortbyProperties.forEach(function (property) {
                sortbyArray.push([property, 1]);
            });
        }
    }
    return sortbyArray;
}
```
- `getSortBy`: Genera un array de criterios de ordenamiento.
  
- `sortbyArray`: Array que almacena los criterios de ordenamiento.

#### Método getLimitAndOffset

```typescript
getLimitAndOffset(): Object{            
    return {
        skip: parseInt(this.filterDto.offset !== undefined ? this.filterDto.offset : '0'),
        limit: parseInt(this.filterDto.limit !== undefined ? this.filterDto.limit : '10'),
    };
}
```
- `getLimitAndOffset`: Genera un objeto con los valores de skip (desplazamiento) y limit (límite de resultados).
- `skip`: Número de resultados a omitir.
- `limit`: Número máximo de resultados a devolver.

#### Método isPopulated
```typescript
isPopulated(): boolean{            
    return this.filterDto.populate === 'true';
}
```
- `isPopulated`: Indica si se debe realizar la operación de población de datos (similar a un join en SQL).

#### Función castValue
```typescript
function castValue(value: string): any {
    if (value) {
        const datatype = value.match(/<[^>]+>/);
        if (datatype === null) {
            return value;
        } else {
            const val = value.slice(0, value.length-3)
            switch (datatype[0][1]) {
                case 'n':
                    return Number(val);
                    break;
                case 'd':
                    return new Date(val);
                    break;
                case 'b':
                    return value.toLowerCase() === 'true';
                    break;
                default:
                    break;
            }
        }
    } else {
        return null;
    }
}
```
- `castValue`: Convierte el valor de un string a su tipo de dato correspondiente (`Number`, `Date`, `boolean`).
