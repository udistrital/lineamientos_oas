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
