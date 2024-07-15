<p align="center">
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS Icon" width="100"/>
</p>

<h1 align="center"><b>Ejemplo del uso de las variables de entorno</b></h1>

### 2. Configuración de variables de entorno

### Archivo configuration.ts:
- Define un objeto environment que contiene configuraciones obtenidas de las variables de entorno (process.env).
- Estas configuraciones incluyen las credenciales y detalles de conexión para una base de datos MongoDB.

####Ejemplo:

```shell
export const environment = {
    USER: process.env.HORARIOS_CRUD_USER,
    PASS: process.env.HORARIOS_CRUD_PASS,
    HOST: process.env.HORARIOS_CRUD_HOST,
    PORT: process.env.HORARIOS_CRUD_PORT,
    DB: process.env.HORARIOS_CRUD_DB,
    HTTP_PORT: process.env.HORARIOS_CRUD_HTTP_PORT,
    AUTH_DB: process.env.HORARIOS_CRUD_AUTH_DB
};
```
### Archivo app.module.ts:
- Importa el módulo de configuración de Mongoose utilizando los valores definidos en configuration.ts para establecer la conexión a la base de datos MongoDB.
- Utiliza MongooseModule.forRoot() para configurar la conexión a la base de datos con la URI de conexión construida a partir de las propiedades del objeto environment.
- Utiliza MongooseModule.forFeature() para definir los esquemas que se utilizarán en la aplicación.

#### Ejemplo:

```shell
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${environment.USER}:${environment.PASS}@` +
      `${environment.HOST}:${environment.PORT}/${environment.DB}?authSource=${environment.AUTH_DB}`),
    MongooseModule.forFeature([
      { name: ColocacionEspacioAcademico.name, schema: ColocacionEspacioAcademicoSchema },
      { name: EstadoCreacionSemestre.name, schema: EstadoCreacionSemestreSchema },
      { name: EstadoCreacion.name, schema: EstadoCreacionSchema },
      { name: GrupoEstudio.name, schema: GrupoEstudioSchema },
      { name: HorarioSemestreGrupoEstudio.name, schema: HorarioSemestreGrupoEstudioSchema },
      { name: HorarioSemestreColocacionEspacioAcademico.name, schema: HorarioSemestreColocacionEspacioAcademicoSchema },
      { name: HorarioSemestre.name, schema: HorarioSemestreSchema },
      { name: Horario.name, schema: HorarioSchema },
    ])
  ],
  controllers: [
    AppController,
    ColocacionEspacioAcademicoController,
    EstadoCreacionSemestreController,
    EstadoCreacionController,
    GrupoEstudioController,
    HorarioSemestreColocacionEspacioAcademicoController,
    HorarioSemestreGrupoEstudioController,
    HorarioSemestreController,
    HorarioController
  ],
  providers: [
    AppService,
    ColocacionEspacioAcademicoService,
    EstadoCreacionSemestreService,
    EstadoCreacionService,
    GrupoEstudioService,
    HorarioSemestreColocacionEspacioAcademicoService,
    HorarioSemestreGrupoEstudioService,
    HorarioSemestreService,
    HorarioService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

### Relación entre configuration.ts y app.module.ts
- Configuración de la Base de Datos: El archivo configuration.ts proporciona las credenciales y detalles de conexión de la base de datos a través de variables de entorno. Estas configuraciones se usan en app.module.ts para establecer la conexión a la base de datos MongoDB.
- Modularidad y Reutilización: Al separar la configuración en configuration.ts, se facilita la gestión de configuraciones, especialmente cuando se despliega la aplicación en diferentes entornos (desarrollo, pruebas, producción).
- Inyección de Dependencias: Los controladores y servicios definidos en app.module.ts utilizan los esquemas de Mongoose configurados para interactuar con la base de datos.

### Flujo de Ejecución
- Cargar Variables de Entorno: Al iniciar la aplicación, las variables de entorno se cargan y el objeto environment se completa con esos valores.
- Configurar Mongoose: AppModule utiliza estos valores para construir la URI de conexión y configurar Mongoose con MongooseModule.forRoot().
- Registrar Esquemas: AppModule también registra los esquemas de Mongoose con MongooseModule.forFeature().
- Iniciar Aplicación: La aplicación NestJS se inicializa con las configuraciones y dependencias necesarias para interactuar con la base de datos y manejar las solicitudes HTTP.
