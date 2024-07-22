<p align="center">
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS Icon" width="100"/>
</p>

<h1 align="center"><b>Documentación para la generación y definición de la estructura de proyecto en APIs con base de datos no relacionales (MongoDB) bajo la tecnología NestJs</b></h1>

### Introducción

Este documento tiene como objetivo establecer los lineamientos para la generación y definición de la estructura de proyecto en APIs con base de datos no relacionales (MongoDB) bajo la tecnología NestJs. Se detallan las subtareas necesarias para la creación de una API robusta y escalable.

---

### 1. Generación del API (Uso del CLI)

#### Creación del proyecto NestJs:

- Instalar el CLI de NestJs globalmente, Utilizar el comando
```bash
  npm install -g @nestjs/cli
```

![Imagen de ejemplo](img/2.png)

- Crear un nuevo directorio para el proyecto:
```bash
mkdir hola-mundo-nestjs
```
![Imagen de ejemplo 2](img/3.png)

- Inicializar el proyecto NestJs:
```bash
nest new hola-mundo-nestjs
```
<div>
    <img src="img/6.png" alt="Imagen de ejemplo 3" style="float: left; margin-right: 20px; width: 500px;"/>
    <img src="img/4.png" alt="Imagen de ejemplo 4" style="float: right; margin-left: 20px; width: 500px;"/>
</div>

#### Instalación de dependencias:

- Instalar las dependencias necesarias para trabajar con MongoDB en NestJs, como
```bash
npm install mongoose class-validator @nestjs/swagger
```
![Imagen de ejemplo 2](img/7.png)
