# Lógica_Orientada a Funciones (Para API MID)
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
- `router.go` indica el controlador asociado para resolver los endpoints asociados al proyecto.
- `commentsRouter_controllers.go` se actualiza de forma automatica y permite establecer de forma simple cada una las rutas de los endpoints expuestos.

En la carpeta `controllers` se encuentran los controladores asociados en la carpeta de `routers`, aquí no se debe especificar lógica de negocio, simplemente se debe realizar un llamado a un `service` asociado al controlador y mapear la respuesta.

En la carpeta `services` se encuentran los servicios asociados a cada controlador que permiten resolver la lógica de negocio requerida para cada funcionalidad, para esto puede interactuar con otros servicios de tipo API CRUD o incluso otros de tipo API MID.

En la carpeta `helpers` se encuentran aquellas funcionalidades especificas que pueden ser reutilizadas por uno o mas servicios, por lo que con el fin de no tener que repetir lógica, se disponibilizan de forma tranversal y pueden ser llamados en una o varias partes de la lógica de cada sericio, de acuerdo con la necesidad particular.

Teniendo en cuenta lo anterior, la interacción entre los diferentes submodulos de cada proyecto deberá seguir la siguiente ruta>

```bash
├── main.go
│   └── routers
│       └── controllers
│           └── services
│                └── helpers
```

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

#### 1.1 Control de errores y Validación de Parámetros

##### defer func()
Existirá una función `defer` por cada controlador encargada de actuar como `try…catch`, al existir un error la función `defer` estructurará el JSON de respuesta de error para el servicio.

```go
defer func() {
	if err := recover(); err != nil {
		logs.Error(err)
		localError := err.(map[string]interface{})
		c.Data["mesaage"] = (beego.AppConfig.String("appname") + "/" + "CertificacionController" + "/" + (localError["funcion"]).(string))
		c.Data["data"] = (localError["err"])
		if status, ok := localError["status"]; ok {
			c.Abort(status.(string))
		} else {
			c.Abort("404")
		}
	}
}()
```

##### Validación de Parámetros
Se deberán validar cada uno de los  parámetros de entrada de las funciones y en caso de error con el método panic se hará el llamado de la función defer.

```go
_, err1 := strconv.Atoi(dependencia)
mess, err2 := strconv.Atoi(mes)
_, err3 := strconv.Atoi(ano)
if (mess == 0) || (len(ano) != 4) || (mess > 12) || (err1 != nil) || (err2 != nil) || (err3 != nil) {
	panic(map[string]interface{}{"funcion": "GetCertificacionDocumentosAprobados", "err": "Error en los parametros de ingreso", "status": "400"})
}

// llamado a los metodos helpers
if personas, err := helpers.CertificacionDocumentosAprobados(dependencia, ano, mes); err == nil {
	c.Ctx.Output.SetStatus(200)
	c.Data["json"] = map[string]interface{}{"Success": true, "Status": "200", "Message": "Successful", "Data": personas}
} else {
	panic(err)
}
```

##### Controlador Completo
```go
// AprobacionPagoController ...
// @Title CertificacionDocumentosAprobados
// @Description create CertificacionDocumentosAprobados  trae
// @Param dependencia path int true "Dependencia del contrato en la tabla ordenador_gasto"
// @Param mes path int true "Mes del pago mensual"
// @Param ano path int true "Año del pago mensual"
// @Success 200 {object} []models.Persona
// @Failure 404 not found resource
// @router /documentos_aprobados/:dependencia/:mes/:ano [get]
func (c *CertificacionController) GetCertificacionDocumentosAprobados() {

	dependencia := c.GetString(":dependencia")
	mes := c.GetString(":mes")
	ano := c.GetString(":ano")

	defer func() {
		if err := recover(); err != nil {
			logs.Error(err)
			localError := err.(map[string]interface{})
			c.Data["mesaage"] = (beego.AppConfig.String("appname") + "/" + "CertificacionController" + "/" + (localError["funcion"]).(string))
			c.Data["data"] = (localError["err"])
			if status, ok := localError["status"]; ok {
				c.Abort(status.(string))
			} else {
				c.Abort("404")
			}
		}
	}()

	_, err1 := strconv.Atoi(dependencia)
	mess, err2 := strconv.Atoi(mes)
	_, err3 := strconv.Atoi(ano)
	if (mess == 0) || (len(ano) != 4) || (mess > 12) || (err1 != nil) || (err2 != nil) || (err3 != nil) {
		panic(map[string]interface{}{"funcion": "GetCertificacionDocumentosAprobados", "err": "Error en los parametros de ingreso", "status": "400"})
	}

	if personas, err := helpers.CertificacionDocumentosAprobados(dependencia, ano, mes); err == nil {
		c.Ctx.Output.SetStatus(200)
		c.Data["json"] = map[string]interface{}{"Success": true, "Status": "200", "Message": "Successful", "Data": personas}
	} else {
		panic(err)
	}

	c.ServeJSON()

}
```

### 2 helpers
>##### [Codigo Fuente helpers](https://github.com/udistrital/cumplidos_mid/blob/develop/helpers/certificaciones.go)

los script consolidados en el módulo helpers serán la lógica de negocio para cada uno de los controladores, esto con el propósito de modularizar la lógica de negocio y no consolidar funciones de controladores tan extensas.

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

##### Especificar nombre de la funcion en error
Para proporcionar errores dicientes, documentando la función donde se ha ocasionado el error, se define el nombre de la función en la estructura de error que retorna la función helpers.
```go
} else {
	logs.Error(err)
	outputError = map[string]interface{}{"funcion": "/CertificacionDocumentosAprobados", "err": err, "status": "502"}
	return nil, outputError
}
```
##### Función helpers Completa
```go
func CertificacionDocumentosAprobados(dependencia string, anio string, mes string) (personas []models.Persona, outputError map[string]interface{}) {

	defer func() {
		if err := recover(); err != nil {
			outputError = map[string]interface{}{"funcion": "/CertificacionDocumentosAprobados", "err": err, "status": "502"}
			panic(outputError)
		}
	}()

	var contrato_ordenador_dependencia models.ContratoOrdenadorDependencia
	var pagos_mensuales []models.PagoMensual
	var persona models.Persona
	var vinculaciones_docente []models.VinculacionDocente
	var respuesta_peticion map[string]interface{}
	var mes_cer, _ = strconv.Atoi(mes)

	if mes_cer < 10 {

		mes = "0" + mes

	}

	if contrato_ordenador_dependencia, outputError = GetContratosOrdenadorDependencia(dependencia, anio+"-"+mes, anio+"-"+mes); outputError != nil {
		return nil, outputError
	}

	for _, contrato := range contrato_ordenador_dependencia.ContratosOrdenadorDependencia.InformacionContratos {

		if response, err := getJsonTest(beego.AppConfig.String("ProtocolAdmin")+"://"+beego.AppConfig.String("UrlcrudAdmin")+"/"+beego.AppConfig.String("NscrudAdmin")+"/vinculacion_docente/?limit=-1&query=NumeroContrato:"+contrato.NumeroContrato+",Vigencia:"+contrato.Vigencia, &vinculaciones_docente); (err == nil) && (response == 200) {

			for _, vinculacion_docente := range vinculaciones_docente {
				if vinculacion_docente.NumeroContrato.Valid == true {
					if response, err := getJsonTest(beego.AppConfig.String("ProtocolCrudCumplidos")+"://"+beego.AppConfig.String("UrlCrudCumplidos")+"/"+beego.AppConfig.String("NsCrudCumplidos")+"/pago_mensual/?query=EstadoPagoMensualId.CodigoAbreviacion:AP,NumeroContrato:"+contrato.NumeroContrato+",VigenciaContrato:"+contrato.Vigencia+",Mes:"+strconv.Itoa(mes_cer)+",Ano:"+anio, &respuesta_peticion); (err == nil) && (response == 200) {
						pagos_mensuales = []models.PagoMensual{}
						if len(respuesta_peticion["Data"].([]interface{})[0].(map[string]interface{})) != 0 {
							LimpiezaRespuestaRefactor(respuesta_peticion, &pagos_mensuales)
						} else {
							pagos_mensuales = nil
						}
						if pagos_mensuales == nil {
							persona.NumDocumento = contrato.Documento
							persona.Nombre = contrato.NombreContratista
							persona.NumeroContrato = contrato.NumeroContrato
							persona.Vigencia, _ = strconv.Atoi(contrato.Vigencia)
							personas = append(personas, persona)
						}
					} else { //If informacion_proveedor get
						logs.Error(err)
						outputError = map[string]interface{}{"funcion": "/CertificacionDocumentosAprobados", "err": err, "status": "502"}
						return nil, outputError
					}
				}
			}
		} else { //If vinculacion_docente get
			logs.Error(err)
			outputError = map[string]interface{}{"funcion": "/CertificacionDocumentosAprobados", "err": err, "status": "502"}
			return nil, outputError
		}
	}
	return
}
```
