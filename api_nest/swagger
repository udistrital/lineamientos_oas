<p align="center">
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS Icon" width="100"/>
</p>

<h1 align="center"><b>Generación de Swagger en NestJS</b></h1>

#### Instalación de Dependencias:

Asegúrate de tener instaladas las dependencias necesarias para Swagger:
```typescript
npm install --save @nestjs/swagger swagger-ui-express
```
#### Configuración de Swagger:
Dentro del archivo principal de tu aplicación (generalmente main.ts), agrega la configuración de Swagger:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { environment } from './config/configuration';
import { GlobalExceptionFilter } from './errorhandler/error';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());
  
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Horarios_crud')
    .setDescription('API CRUD para la gestion de horarios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./swagger/swagger.json', JSON.stringify(document, null, 4));
  fs.writeFileSync('./swagger/swagger.yml', yaml.dump(document));
  SwaggerModule.setup('swagger', app, document);

  await app.listen(parseInt(environment.HTTP_PORT, 10) || 8080);
}
bootstrap();
```

<h1 align="center"><b>Configuración de .drone.yml para Despliegue</b></h1>

