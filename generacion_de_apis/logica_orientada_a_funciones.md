# Lógica orientada a Funciones (Para API MID)
En esta sección se mostrará cómo estructurar adecuadamente la logica de negocio en las Api Mid desarrolladas en la OATI.

## Orientado a Funciones
Las `API MID` o Middleware están orientadas a contener la lógica de negocio que interopera con otros microservicios. En este sentido  `consultan`, `agrupan`, `ordenan`, `procesan` y `exponen` la información  requerida por el módulo.  
Dadas estas características, es apropiado la optimización de estos procesos por medio de funciones orientadas a cada servicio.


### Estructura de los proyecto para estandarizar el manejo de funcionalidades
Con el fin de ordenar y estandarizar los desarrollos de cada mid, se plantea seguir la siguiente estructura:


```bash
├── conf
│   └── app.conf
├── controllers
│   └── certificacion_controller.go
├── helpers
│   └── certificaciones_helper.go
├── routers
│   ├── commentsRouter_controllers.go
│   └── router.go
├── services
│   └── certificaciones_service.go
├── swagger
│   ├── swagger.json
│   └── swagger.yml
└── tests
│   ├── default_test.go
│   └── helpers
│       └── certificacionesHelper
│           └── certificaciones_test.go
├── .env
├── main.go
├── models
├── README.md
├── sonar-project.properties
├── docker-compose.yml
└── Dockerfile
```

En el archivo `main.go` se deberá inicializar el proyecto y se configurar los filtros por defecto.

En la carpeta `routers` se encuentra dos archivos:
- `router.go` indica el controlador asociado para resolver los endpoints asociados al proyecto. En este archivo tambien se debe especificar el comportamiento que se tiene cuando se intenta acceder a una URL no configurada, para esto basta con agregar la siguiente sentencia:

```go
beego.ErrorController(&errorhandler.ErrorHandlerController{})
```
Para mas detalle revise el [codigo fuente de ejemplo de un router](https://github.com/udistrital/sga_tercero_mid/blob/develop/routers/router.go)

- `commentsRouter_controllers.go` se actualiza de forma automatica y permite establecer de forma simple cada una las rutas de los endpoints expuestos.

En la carpeta `controllers` se encuentran los controladores asociados en la carpeta de `routers`, aquí no se debe especificar lógica de negocio, simplemente se debe realizar un llamado a un `service` asociado al controlador y mapear la respuesta.

En la carpeta `services` se encuentran los servicios asociados a cada controlador que permiten resolver la lógica de negocio requerida para cada funcionalidad, para esto puede interactuar con otros servicios de tipo API CRUD o incluso otros de tipo API MID.

En la carpeta `helpers` se encuentran aquellas funcionalidades especificas que pueden ser reutilizadas por uno o mas servicios, por lo que con el fin de no tener que repetir lógica, se disponibilizan de forma tranversal y pueden ser llamados en una o varias partes de la lógica de cada sericio, de acuerdo con la necesidad particular.

Teniendo en cuenta lo anterior, la interacción entre los diferentes submodulos de cada proyecto deberá seguir la siguiente ruta>

``` main > routers > controllers > services > helpers ```

### 1 controllers
>##### [Codigo Fuente ejemplo de un controller](https://github.com/udistrital/sga_tercero_mid/blob/develop/controllers/tercero_controller.go)

En los controladores del MID se deberá relizar el llamado al servicio correspondiente y mapear la respuesta en la siguiente estructura:

```json
{
  "success": true,
  "status": 200,
  "message": "Solicitud exitosa",
  "data": [
    {
      ...
    }
  ]
}
```

Para facilitar el manejo de esta estructura, es necesario utilizar la libreria `"github.com/udistrital/utils_oas/requestresponse"`, de la siguiente manera:
```go
if err == nil {
	c.Ctx.Output.SetStatus(200)
	c.Data["json"] = requestresponse.APIResponseDTO(true, 200, resultado)
} else {
	c.Ctx.Output.SetStatus(404)
	c.Data["json"] = requestresponse.APIResponseDTO(true, 404, nil, err.Error())
}

c.ServeJSON()
```

##### Controlador Completo
```go
// ActualizarPersona ...
// @Title ActualizarPersona
// @Description Actualizar datos de persona
// @Param	body		body 	{}	true		"body for Actualizar datos de persona content"
// @Success	200	{}
// @Failure	404	not found
// @router / [put]
func (c *TerceroController) ActualizarPersona() {
	defer errorhandler.HandlePanic(&c.Controller)

	data := c.Ctx.Input.RequestBody

	resultado, err := services.ActualizarPersona(data)

	if err == nil {
		c.Ctx.Output.SetStatus(200)
		c.Data["json"] = requestresponse.APIResponseDTO(true, 200, resultado)
	} else {
		c.Ctx.Output.SetStatus(404)
		c.Data["json"] = requestresponse.APIResponseDTO(true, 404, nil, err.Error())
	}

	c.ServeJSON()
}
```

### 2 services
>##### [Codigo Fuente ejemplo de un service](https://github.com/udistrital/sga_tercero_mid/blob/develop/services/tercero_service.go)

los script consolidados en el módulo services serán lógica de negocio para cada uno de los controladores, esto con el propósito de modularizar la lógica de negocio y no consolidar funciones de controladores tan extensas.

#### 2.1 Control de errores

##### defer func()
De la misma manera que en los controladores, se deberá estructurar el objeto de error con una función `defer`.
```go
defer func() {
	if err := recover(); err != nil {
		outputError = map[string]interface{}{"funcion": "/CertificacionDocumentosAprobados", "err": err, "status": "502"}
		panic(outputError)
	}
}()
```

##### Función helpers Completa
```go
func ActualizarPersona(data []byte) (interface{}, error) {
	var body map[string]interface{}
	response := make(map[string]interface{})
	if err := json.Unmarshal(data, &body); err == nil {

		if idTercero, ok := body["Tercero"].(map[string]interface{})["hasId"].(float64); ok {
			var updateTercero map[string]interface{}
			if body["Tercero"].(map[string]interface{})["hasId"] != nil {
				errtercero := request.GetJson("http://"+beego.AppConfig.String("TercerosService")+"tercero/"+fmt.Sprintf("%.f", idTercero), &updateTercero)
				if errtercero == nil && updateTercero["Status"] != 404 {
					dataToUpdate := body["Tercero"].(map[string]interface{})["data"].(map[string]interface{})
					if PrimerNombre, ok := dataToUpdate["PrimerNombre"]; ok {
						updateTercero["PrimerNombre"] = PrimerNombre
					}
					if SegundoNombre, ok := dataToUpdate["SegundoNombre"]; ok {
						updateTercero["SegundoNombre"] = SegundoNombre
					}
					if PrimerApellido, ok := dataToUpdate["PrimerApellido"]; ok {
						updateTercero["PrimerApellido"] = PrimerApellido
					}
					if SegundoApellido, ok := dataToUpdate["SegundoApellido"]; ok {
						updateTercero["SegundoApellido"] = SegundoApellido
					}
					updateTercero["NombreCompleto"] = updateTercero["PrimerNombre"].(string) + " " + updateTercero["SegundoNombre"].(string) + " " + updateTercero["PrimerApellido"].(string) + " " + updateTercero["SegundoApellido"].(string)
					if FechaNacimiento, ok := dataToUpdate["FechaNacimiento"]; ok {
						updateTercero["FechaNacimiento"] = time_bogota.TiempoCorreccionFormato(FechaNacimiento.(string))
					}
					if UsuarioWSO2, ok := dataToUpdate["UsuarioWSO2"]; ok {
						updateTercero["UsuarioWSO2"] = UsuarioWSO2
					}

					var updateTerceroAns map[string]interface{}
					errUpdateTercero := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"tercero/"+fmt.Sprintf("%.f", idTercero), "PUT", &updateTerceroAns, updateTercero)
					if errUpdateTercero == nil {
						response["tercero"] = updateTerceroAns
					} else {
						logs.Error("Error --> ", errUpdateTercero)
						return nil, errors.New(errUpdateTercero.Error())
					}
				} else {
					logs.Error("Error --> ", errtercero)
					return nil, errors.New(errtercero.Error())
				}
			}

			var updateIdentificacion map[string]interface{}
			if body["Identificacion"].(map[string]interface{})["hasId"] != nil {
				idIdentificacion := body["Identificacion"].(map[string]interface{})["hasId"].(float64)
				erridentificacion := request.GetJson("http://"+beego.AppConfig.String("TercerosService")+"datos_identificacion/"+fmt.Sprintf("%.f", idIdentificacion), &updateIdentificacion)
				if erridentificacion == nil && updateIdentificacion["Status"] != 404 {
					dataToUpdate := body["Identificacion"].(map[string]interface{})["data"].(map[string]interface{})
					if FechaExpedicion, ok := dataToUpdate["FechaExpedicion"]; ok {
						updateIdentificacion["FechaExpedicion"] = time_bogota.TiempoCorreccionFormato(FechaExpedicion.(string))
					}

					var updateIdentificacionAns map[string]interface{}
					errUpdateIdentificacion := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"datos_identificacion/"+fmt.Sprintf("%.f", idIdentificacion), "PUT", &updateIdentificacionAns, updateIdentificacion)
					if errUpdateIdentificacion == nil {
						response["identificacion"] = updateIdentificacionAns
					} else {
						logs.Error("Error --> ", errUpdateIdentificacion)
						return nil, errors.New(errUpdateIdentificacion.Error())
					}
				} else {
					logs.Error("Error --> ", erridentificacion)
					return nil, errors.New(erridentificacion.Error())
				}
			}

			complementarios := body["Complementarios"].(map[string]interface{})

			if generoAns, ok := helpers.UpdateOrCreateInfoComplementaria("Genero", complementarios, idTercero); ok {
				response["genero"] = generoAns
			}

			if estadoCivilAns, ok := helpers.UpdateOrCreateInfoComplementaria("EstadoCivil", complementarios, idTercero); ok {
				response["estadoCivil"] = estadoCivilAns
			}

			if orientacionSexualAns, ok := helpers.UpdateOrCreateInfoComplementaria("OrientacionSexual", complementarios, idTercero); ok {
				response["orientacionSexual"] = orientacionSexualAns
			}

			if identidadGeneroAns, ok := helpers.UpdateOrCreateInfoComplementaria("IdentidadGenero", complementarios, idTercero); ok {
				response["identidadGenero"] = identidadGeneroAns
			}

			if body["Complementarios"].(map[string]interface{})["Telefono"].(map[string]interface{})["hasId"] != nil {
				idInfComp := body["Complementarios"].(map[string]interface{})["Telefono"].(map[string]interface{})["hasId"].(float64)
				var updateInfoComp map[string]interface{}
				errUpdtInfoComp := request.GetJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero/"+fmt.Sprintf("%v", idInfComp), &updateInfoComp)
				if errUpdtInfoComp == nil && updateInfoComp["Status"] != 404 {
					updateInfoComp["Dato"] = body["Complementarios"].(map[string]interface{})["Telefono"].(map[string]interface{})["data"]

					formatdata.JsonPrint(updateInfoComp)

					var updateAnswer map[string]interface{}
					errupdateAnswer := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero/"+fmt.Sprintf("%.f", idInfComp), "PUT", &updateAnswer, updateInfoComp)
					if errupdateAnswer == nil {
						response["telefono"] = updateAnswer
					}
				}
			} else {
				IdTelefono, _ := models.IdInfoCompTercero("10", "TELEFONO")
				ItTel, _ := strconv.ParseFloat(IdTelefono, 64)
				newInfo := map[string]interface{}{
					"TerceroId":            map[string]interface{}{"Id": idTercero},
					"InfoComplementariaId": map[string]interface{}{"Id": ItTel},
					"Dato":                 body["Complementarios"].(map[string]interface{})["Telefono"].(map[string]interface{})["data"],
					"Activo":               true,
				}

				formatdata.JsonPrint(newInfo)
				var createinfo map[string]interface{}
				errCreateInfo := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero", "POST", &createinfo, newInfo)
				if errCreateInfo == nil && fmt.Sprintf("%v", createinfo) != "map[]" && createinfo["Id"] != nil {
					response["telefono"] = createinfo
				}
			}
			return response, nil

		} else {
			return nil, errors.New("error del servicio ActualizarPersona: La solicitud contiene un tipo de dato incorrecto o un parámetro inválido")
		}

	} else {
		logs.Error("Error --> ", err)
		return nil, errors.New("error del servicio ActualizarPersona: La solicitud contiene un tipo de dato incorrecto o un parámetro inválido" + err.Error())
	}
}
```

### 3 helpers
>##### [Codigo Fuente ejemplo de un helper](https://github.com/udistrital/sga_tercero_mid/blob/develop/helpers/tercero_helper.go)

los script consolidados en el módulo helpers serán lógica de negocio reutilizable entre servicios.

```go
func UpdateOrCreateInfoComplementaria(tipoInfo string, infoComp map[string]interface{}, idTercero float64) (map[string]interface{}, bool) {
	resp := map[string]interface{}{}
	ok := false

	if infoComp[tipoInfo].(map[string]interface{})["hasId"] != nil {
		idInfComp := infoComp[tipoInfo].(map[string]interface{})["hasId"].(float64)
		var updateInfoComp map[string]interface{}
		errUpdtInfoComp := request.GetJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero/"+fmt.Sprintf("%v", idInfComp), &updateInfoComp)
		if errUpdtInfoComp == nil && updateInfoComp["Status"] != 404 {
			dataToUpdate := infoComp[tipoInfo].(map[string]interface{})["data"].(map[string]interface{})
			updateInfoComp["InfoComplementariaId"] = dataToUpdate

			var updateAnswer map[string]interface{}
			errupdateAnswer := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero/"+fmt.Sprintf("%.f", idInfComp), "PUT", &updateAnswer, updateInfoComp)
			if errupdateAnswer == nil {
				resp = updateAnswer
				ok = true
			}
		}
	} else {
		newInfo := map[string]interface{}{
			"TerceroId":            map[string]interface{}{"Id": idTercero},
			"InfoComplementariaId": infoComp[tipoInfo].(map[string]interface{})["data"].(map[string]interface{}),
			"Activo":               true,
		}
		var createinfo map[string]interface{}
		errCreateInfo := request.SendJson("http://"+beego.AppConfig.String("TercerosService")+"info_complementaria_tercero", "POST", &createinfo, newInfo)
		if errCreateInfo == nil && fmt.Sprintf("%v", createinfo) != "map[]" && createinfo["Id"] != nil {
			resp = createinfo
			ok = true
		}
	}

	return resp, ok
}
```