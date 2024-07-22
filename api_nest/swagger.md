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
Dentro del archivo principal de tu aplicación (generalmente main.ts), agrega la configuración de Swagger.

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

El archivo .drone.yml define un pipeline de CI/CD para una aplicación NestJS. Este pipeline realiza diversas tareas como la validación de la estructura del repositorio, la construcción del proyecto, la ejecución de análisis estáticos de código, la publicación de imágenes Docker a Amazon ECR y la actualización de servicios en AWS ECS. Además, notifica el estado del build a través de Telegram.

#### Ejemplo de Horarios Crud:

```typescript
workspace:
  base: /go
  path: src/github.com/udistrital/${DRONE_REPO##udistrital/}
  when:
    branch:
    - develop
    - release/*
    - master

kind: pipeline
name: oas_api_ci

steps:
- name: check_readme
  image: jjvargass/qa_develoment:latest
  commands:
  - python /app/check_readme.py
  when:
    branch:
    - develop
    - feature/*
    - release/*
    event:
    - push

- name: check_branch
  image: jjvargass/qa_develoment:latest
  commands:
  - python /app/check_branch.py -H ${DRONE_GIT_HTTP_URL}
  when:
    branch:
    - develop
    - feature/*
    - release/*
    event:
    - push

- name: check_commits
  image: jjvargass/qa_develoment:latest
  commands:
  - python /app/check_commits.py
  when:
    branch:
    - develop
    - feature/*
    - release/*
    event:
    - push

- name: nest_build
  image: node:lts-alpine
  commands:
  - node --version
  - npm install
  - npm run build
  when:
    branch:
    - develop
    - release/*
    - master
    event:
    - push

- name: run_sonar_scanner
  image: aosapps/drone-sonar-plugin
  settings:
    sonar_host:
      from_secret: SONAR_HOST
    sonar_token:
      from_secret: SONAR_TOKEN

- name: publish_to_ecr_release
  image: plugins/ecr
  settings:
    access_key:
      from_secret: AWS_ACCESS_KEY_ID
    secret_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    region:
      from_secret: AWS_REGION
    repo: ${DRONE_REPO##udistrital/}
    tags:
      - ${DRONE_COMMIT:0:7}
      - release
  when:
    branch:
    - release/*
    event:
    - push

- name: publish_to_ecr_master
  image: plugins/ecr
  settings:
    access_key:
      from_secret: AWS_ACCESS_KEY_ID
    secret_key:
      from_secret: AWS_SECRET_ACCESS_KEY
    region:
      from_secret: AWS_REGION
    repo: ${DRONE_REPO##udistrital/}
    tags:
      - ${DRONE_COMMIT:0:7}
      - latest
  when:
    branch:
    - master
    event:
    - push

- name: update_aws_ecs
  image: golang:1.18
  environment:
    AWS_ACCESS_KEY_ID:
      from_secret: AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY:
      from_secret: AWS_SECRET_ACCESS_KEY
    AWS_CONTAINER:
      from_secret: AWS_CONTAINER
  commands:
  - case ${DRONE_BRANCH} in
       release/*)
         AMBIENTE=test
         CLUSTER=test
         MYCONTAINER=$${AWS_CONTAINER}/${DRONE_REPO##udistrital/}:release
         ;;
       master)
         AMBIENTE=prod
         CLUSTER=oas
         MYCONTAINER=$${AWS_CONTAINER}/${DRONE_REPO##udistrital/}:latest
         ;;
    esac
  - AWS_REGION=us-east-1
  - SERVICE=${DRONE_REPO##udistrital/}_$AMBIENTE
  - MYCONTAINER=oas0/${DRONE_REPO##udistrital/}:${DRONE_COMMIT:0:7}
  - container_name=${DRONE_REPO##udistrital/}
  - apt-get update
  - apt-get install unzip
  - wget https://github.com/Autodesk/go-awsecs/releases/download/v1.1/update-aws-ecs-service-linux-amd64.zip
  - unzip update-aws-ecs-service-linux-amd64.zip -d /go/bin
  - AWS_ACCESS_KEY_ID=$${AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=$${AWS_SECRET_ACCESS_KEY} AWS_REGION=$AWS_REGION
    $GOPATH/bin/update-aws-ecs-service -cluster $CLUSTER -service $SERVICE -container-image $MYCONTAINER
  when:
    branch:
    - release/*
    - master
    event:
    - push

- name: notify_telegram
  image: appleboy/drone-telegram
  settings:
    token:
      from_secret: telegram_token
    to:
      from_secret: telegram_to
    format: html
    message: >
      {{#success build.status}}
        ✅ <a href="{{build.link}}">SUCCESS</a> <b>Build #{{build.number}}</b>
        <b>type: </b><code>{{ build.event }}</code>
        <b>Repo: </b><code>{{repo.name}}</code>
        <b>Branch: </b><code>{{commit.branch}}</code>
        <b>Commit: </b><a href="{{commit.link}}">{{truncate commit.sha 7}}</a>
        <b>Autor: </b>{{commit.author}} <code>&#128526 </code>
      {{else}}
        ❌ <a href="{{build.link}}">FAILURE</a> <b>Build #{{build.number}}</b>
        <b>type: </b><code>{{ build.event }}</code>
        <b>Repo: </b><code>{{repo.name}}</code>
        <b>Branch: </b><code>{{commit.branch}}</code>
        <b>Commit: </b><a href="{{commit.link}}">{{truncate commit.sha 7}}</a>
        <b>Autor: </b>{{commit.author}} <code>&#128549 </code>
      {{/success}}
  when:
    branch:
    - develop
    - release/*
    - master
    event:
    - push
    status:
    - failure
    - success
```
