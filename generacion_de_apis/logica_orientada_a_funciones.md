# Lógica_Orientada a Funciones (Para API MID)
En esta sección se mostrará cómo estructurar adecuadamente la logica de negocio en las Api Mid desarrolladas en la OAS.

## Orientado a Funciones
Las `API MID` o Middleware están orientadas a contener la lógica de negocio que interopera con otros microservicios. En este sentido  `consultan`, `agrupan`, `ordenan`, `procesan` y `exponen` la información  requerida por el módulo.  
Dadas estas características, es apropiado la optimización de estos procesos por medio de funciones orientadas a cada servicio.


### 1 Modulo helpers
Se deberá definir un módulo llamado `helpers`, el cual  tendrá como propósito contener los archivos de lógica de negocio por cada uno de los controladores desarrolladores.

Como se puede observar, el módulo de `controllers` contiene su archivo `certificacion.go` y de la misma manera el módulo `helpers` contiene su archivo `certificaciones.go`.

```bash
├── conf
│   └── app.conf
├── controllers
│   └── certificacion.go
├── helpers
│   └── certificaciones.go
├── routers
│   ├── commentsRouter_controllers.go
│   └── router.go
├── swagger
│   └── swagger.json
└── tests
│   ├── default_test.go
│   └── helpers
│       └── certificacionesHelper
│           └── certificaciones_test.go
├── main.go
├── models
├── README.md
├── sonar-project.properties
├── docker-compose.yml
└── Dockerfile
```

### 2 controllers
>##### [Codigo Fuente controllers](https://github.com/udistrital/cumplidos_mid/blob/develop/controllers/certificacion.go)

En los controladores del MID se deberá desarrollar las comprobaciones para los posibles  flujos alternos de la lógica de negocio y errores de parámetro para que no bloquee el funcionamiento de los demás servicios expuesto por el API.

#### 2.1 Control de errores y Validación de Parámetros

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

### 3 helpers
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
