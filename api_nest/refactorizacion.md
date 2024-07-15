<p align="center">
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS Icon" width="100"/>
</p>

<h1 align="center"><b>Refactorización del Proyecto</b></h1>

### 3. Refactorización del proyecto para manejar controlador, modelos y servicios

Organizar el código del proyecto en carpetas separadas para controladores, modelos y servicios.

```shell
+---src
|   |   app.controller.spec.ts
|   |   app.controller.ts
|   |   app.module.ts
|   |   app.service.ts
|   |   main.ts
|   |
|   +---config
|   +---controllers
|   +---errorhandler
|   +---logger
|   +---models
|   \---services
```

Ejemplo:

![Imagen de ejemplo](img/9.JPG)

Dentro del controlador se debe tener en cuenta la estructura de respuesta:
```typescript
type APIResponse struct {
	Success bool        `json:"success"`
	Status  int         `json:"status"`
	Message interface{} `json:"message"`
	Data    interface{} `json:"data"`
}
```
### Ejemplo de Controlador POST, GET, PUT y DELETE

### POST:

```bash
@Post()
    async post(@Res() res, @Body() colocacionEspacioAcademicoDto: ColocacionEspacioAcademicoDto) {
        this.colocacionEspacioAcademicoService.post(colocacionEspacioAcademicoDto).then(colocacionEspacioAcademico => {
            res.status(HttpStatus.CREATED).json({
                Success: true,
                Status: HttpStatus.CREATED,
                Message: 'Registration successful',
                Data: colocacionEspacioAcademico
            })
        }).catch(error => {
            res.status(HttpStatus.BAD_REQUEST).json({
                Success: false,
                Status: HttpStatus.BAD_REQUEST,
                Message: 'Error service Post: The request contains an incorrect data type or an invalid parameter',
                Data: error.message
            })
        });
    }
```
### GET:

```bash
    @Get()
    async getAll(@Res() res, @Query() filterDto: FilterDto) {
        this.colocacionEspacioAcademicoService.getAll(filterDto).then(colocacionEspacioAcademico => {
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: HttpStatus.OK,
                Message: 'Request successful',
                Data: colocacionEspacioAcademico
            })
        }).catch(error => {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: HttpStatus.NOT_FOUND,
                Message: 'Error service GetAll: The request contains an incorrect parameter or no record exist',
                Data: error.message
            })
        })
    }
```

### PUT:

```bash
 @Put('/:_id')
    async put(@Res() res, @Param('_id') _id: string, @Body() colocacionEspacioAcademicoDto: ColocacionEspacioAcademicoDto) {
        this.colocacionEspacioAcademicoService.put(_id, colocacionEspacioAcademicoDto).then(colocacionEspacioAcademico => {
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: HttpStatus.OK,
                Message: 'Update successful',
                Data: colocacionEspacioAcademico
            })
        }).catch(error => {
            res.status(HttpStatus.BAD_REQUEST).json({
                Success: false,
                Status: HttpStatus.BAD_REQUEST,
                Message: 'Error service Put: The request contains an incorrect data type or an invalid parameter',
                Data: error.message
            })
        })
    }
```

### DELETE:

```bash
    @Delete('/:_id')
    async delete(@Res() res, @Param('_id') _id: string) {
        this.colocacionEspacioAcademicoService.delete(_id).then(colocacionEspacioAcademico => {
            res.status(HttpStatus.OK).json({
                Success: true,
                Status: HttpStatus.OK,
                Message: 'Delete successful',
                Data: colocacionEspacioAcademico
            })
        }).catch(error => {
            res.status(HttpStatus.NOT_FOUND).json({
                Success: false,
                Status: HttpStatus.NOT_FOUND,
                Message: 'Error service Delete: Request contains incorrect parameter',
                Data: error.message
            })
        })
    }
```

### EJEMPLO DE UN SERVICIO:

El servicio ColocacionEspacioAcademicoService es una clase de servicio en NestJS que maneja operaciones CRUD (Crear, Leer, Actualizar y Eliminar) para un modelo de datos relacionado con la colocación de espacios académicos.

```bash
@Injectable()
export class ColocacionEspacioAcademicoService {
    constructor(private readonly mainModel: any) { }

    private async checkRelated(mainDto: any) {
        // Logic to check related collections
    }

    private populatefields(): any[] {
        return [
            // List of fields to populate
        ]
    }

    async post(mainDto: any): Promise<any> {
        const dateNow = new Date();
        const newdoc = new this.mainModel(mainDto);
        newdoc.FechaCreacion = dateNow;
        newdoc.FechaModificacion = dateNow;
        await this.checkRelated(newdoc);
        return await newdoc.save();
    }

    async getAll(filterDto: any): Promise<any[]> {
        const filterService = new FiltersService(filterDto);
        let populatefields = [];
        if (filterService.isPopulated()) {
            populatefields = this.populatefields();
        }
        return await this.mainModel.find(
            filterService.getQuery(),
            filterService.getFields(),
            filterService.getLimitAndOffset()
        ).sort(
            filterService.getSortBy()
        ).populate(populatefields);
    }

    async getById(_id: string): Promise<any> {
        const doc = await this.mainModel.findById(_id);
        if (!doc) {
            throw new Error(`${_id} doesn't exist`);
        }
        return doc;
    }

    async put(_id: string, mainDto: any): Promise<any> {
        mainDto.FechaModificacion = new Date();
        if (mainDto.FechaCreacion) {
            delete mainDto.FechaCreacion;
        }
        await this.checkRelated(mainDto);
        return await this.mainModel.findByIdAndUpdate(_id, mainDto, { new: true });
    }

    async delete(_id: string): Promise<any> {
        const deleted = await this.mainModel.findByIdAndUpdate(_id, { Activo: false }, { new: true });
        if (!deleted) {
            throw new Error(`${_id} doesn't exist`);
        }
        return deleted;
    }
}
```


### Métodos del Servicio
- Constructor
	- Inyecta el modelo principal (mainModel) en el servicio, permitiendo la interacción con la base de datos.

- checkRelated(mainDto: any)
	- Un método privado que comprueba la existencia de las colecciones relacionadas antes de realizar operaciones de creación o actualización. Está preparado para ser extendido con la lógica necesaria.

- populatefields(): any[]

	- Un método privado que retorna una lista de campos de las colecciones relacionadas que deben ser pobladas. Inicialmente, está vacío y se puede personalizar según las necesidades de la aplicación.

- post(mainDto: any): Promise<any>

	- Crea un nuevo documento en la base de datos. Asigna las fechas de creación y modificación al documento antes de guardarlo.
	- Llama a checkRelated para verificar la existencia de relaciones antes de guardar el documento.

- getAll(filterDto: any): Promise<any[]>

	- Recupera todos los documentos que coinciden con los filtros proporcionados en filterDto.
	- Utiliza un servicio de filtros (FiltersService) para construir la consulta de búsqueda y determinar si se deben poblar campos relacionados.
	- Retorna la lista de documentos encontrados.

- getById(_id: string): Promise<any>

	- Recupera un documento por su ID.
	- Lanza un error si el documento no existe.

- put(_id: string, mainDto: any): Promise<any>

	- Actualiza un documento existente por su ID.
	- Actualiza la fecha de modificación del documento.
	- Elimina la fecha de creación del DTO si está presente, para evitar sobrescribirla.
	- Llama a checkRelated para verificar las relaciones antes de actualizar el documento.
	- Retorna el documento actualizado.

- delete(_id: string): Promise<any>

	- Marca un documento como inactivo en lugar de eliminarlo físicamente.
	- Lanza un error si el documento no existe.
	- Retorna el documento marcado como inactivo.

### Ejemplo de un Módelo

### DTO (Data Transfer Object)
El DTO define cómo se estructuran los datos que se envían y reciben a través de la API.

```bash
import { ApiProperty } from '@nestjs/swagger';

export class ColocacionEspacioAcademicoDto {
    readonly _id: string;

    @ApiProperty()
    readonly EspacioAcademicoId: string;

    @ApiProperty()
    readonly EspacioFisicoId: number;

    @ApiProperty()
    readonly ColocacionEspacioAcademico: object;

    @ApiProperty()
    readonly ResumenColocacionEspacioFisico: object;

    @ApiProperty()
    Activo: boolean;

    @ApiProperty()
    FechaCreacion: Date;

    @ApiProperty()
    FechaModificacion: Date;
}
```

#### ColocacionEspacioAcademicoDto:

- Define un DTO que se utiliza para transferir datos a través de la API.
- Usa decoradores de Swagger (@ApiProperty) para generar documentación automática de la API.
- Incluye propiedades necesarias para la creación y actualización de registros de colocación de espacios académicos.

### Modelo de Mongoose
El modelo define cómo se estructuran y almacenan los datos en la base de datos MongoDB.

```bash
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'colocacion_espacio_academico' })
export class ColocacionEspacioAcademico extends Document {
    _id: string;

    @Prop({ required: true })
    EspacioAcademicoId: string;

    @Prop({ required: true })
    EspacioFisicoId: number;

    @Prop({ type: Object })
    ColocacionEspacioAcademico: object;

    @Prop({ type: Object })
    ResumenColocacionEspacioFisico: object;

    @Prop({ required: true })
    Activo: boolean;

    @Prop({ required: true })
    FechaCreacion: Date;

    @Prop({ required: true })
    FechaModificacion: Date;
}

export const ColocacionEspacioAcademicoSchema = SchemaFactory.createForClass(ColocacionEspacioAcademico);
```

#### ColocacionEspacioAcademico (Modelo de Mongoose):

- Define un esquema de Mongoose para modelar los datos en una colección MongoDB llamada colocacion_espacio_academico.
- Hereda de Document para incluir las propiedades de un documento de Mongoose.
- Usa decoradores de Mongoose (@Prop) para definir los campos del esquema y sus requisitos.
- Incluye campos esenciales como EspacioAcademicoId, EspacioFisicoId, ColocacionEspacioAcademico, ResumenColocacionEspacioFisico, Activo, FechaCreacion y FechaModificacion.
- SchemaFactory.createForClass genera un esquema de Mongoose a partir de la clase definida.
