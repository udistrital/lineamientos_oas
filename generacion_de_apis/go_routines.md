# Manejo de Hilos con Go Routines
Go Routines nos ofrece la implementación de hilos ligeros de ejecución en Go que permiten ejecutar varias tareas simultáneamente sin preocuparse por la sobrecarga de recursos, de esta manera se pueden ejecutar una a varias tareas de manera paralela.

## 1. Usabilidad
Para una implementación correcta y sencilla de comprender se recomienda el uso del paquete **errgroup** de Go, el cual nos permite manejar la ejecución paralela de hilos (Go Routines).

**Documentación:** https://pkg.go.dev/golang.org/x/sync/errgroup

## 2. Aspectos a tener en cuenta
Para evitar errores, es fundamental que una misma variable no sea modificada simultáneamente por varias rutinas de manera directa. Por ejemplo, en lugar de definir un valor booleano en una variable que se encuentra fuera de las rutinas, es mejor utilizar funciones independientes. Estas funciones, aunque retornen o modifiquen valores, no deben generar concurrencia sobre objetos de manera directa sin el uso de una función adecuada. Por esta razón, se utiliza la función 'append()' para completar los mapas, en lugar de asignarles un valor directo.

Si es absolutamente necesario manejar un valor global y no se pueden utilizar funciones seguras, se recomienda usar canales (channels), que están diseñados específicamente para estos casos.

Por otro lado, este enfoque se recomienda exclusivamente para peticiones de tipo GET, ya que estas solicitudes solo recuperan datos y no los modifican, lo que minimiza el riesgo de errores y condiciones de carrera. En contraste, las peticiones que alteran datos, como POST, PUT o DELETE, son susceptibles a cambios delicados e inesperados en los datos, lo que puede provocar inconsistencias y problemas de concurrencia. Por lo tanto, para estas peticiones que modifican el estado del sistema, es crucial implementar mecanismos de control más rigurosos para garantizar la integridad y coherencia de los datos.

## 3. Ejemplo Práctico
En este caso, se realiza una iteración por cada uno de los calendarios que existen, es por esto que al interior del ciclo 'for', se utiliza una rutina, para agilizar la respuesta.

```golang
func GetAll() (interface{}, error) {
	var resultados []map[string]interface{}
	var calendarios []map[string]interface{}
	var errorGetAll bool
	var message string
	wge := new(errgroup.Group)
        var mutex sync.Mutex

	errCalendario := request.GetJson("http://"+beego.AppConfig.String("EventoService")+"calendario?limit=0&sortby=Id&order=desc", &calendarios)
	if errCalendario == nil {
		if len(calendarios[0]) > 0 && fmt.Sprintf("%v", calendarios[0]["Nombre"]) != "map[]" {
			fmt.Println(len(calendarios))
			//Limitación de la cantidad de hilos a utilizar, valores negativas representan sin limite
			wge.SetLimit(-1)
			for _, calendario := range calendarios {
				//Declaración función anonima
				wge.Go(func() error {
					fmt.Println("Entra al hilo")
					var ListarCalendario bool = false
					var periodo map[string]interface{}
					var errPeriodo error

					if calendario["CalendarioPadreId"] == nil {
						ListarCalendario = true
					} else if calendario["Activo"].(bool) == true && calendario["CalendarioPadreId"].(map[string]interface{})["Activo"].(bool) == false {
						ListarCalendario = true
					} else {
						ListarCalendario = false
					}
					if calendario["AplicaExtension"].(bool) == false {

						if ListarCalendario {
							periodoID := fmt.Sprintf("%.f", calendario["PeriodoId"].(float64))
							errPeriodo = request.GetJson("http://"+beego.AppConfig.String("ParametroService")+"periodo/"+periodoID, &periodo)
							if errPeriodo == nil {
								periodoNombre := ""
								if periodo["Status"] == "200" {
									periodoNombre = periodo["Data"].(map[string]interface{})["Nombre"].(string)
								}
								resultado := map[string]interface{}{
									"Id":      calendario["Id"].(float64),
									"Nombre":  calendario["Nombre"].(string),
									"Nivel":   calendario["Nivel"].(float64),
									"Activo":  calendario["Activo"].(bool),
									"Periodo": periodoNombre,
								}
                                                                mutex.Lock()
								resultados = append(resultados, resultado)
                                                                mutex.Unlock()
							} else {
								errorGetAll = true
								message += errPeriodo.Error()
							}
						}
						fmt.Println("Sale del hilo")

					}
					//Retorna error de las peticiones
					return errPeriodo
					//wg.Done()
				})

			}
			//Si existe error, se realiza
			if err := wge.Wait(); err != nil {
				errorGetAll = true
			}
		} else {
			errorGetAll = true
			message += "No data found"
		}
	} else {
		errorGetAll = true
		message += errCalendario.Error()
	}

	if !errorGetAll {
		return requestresponse.APIResponseDTO(true, 200, resultados), nil
	} else {
		return nil, errors.New("error del servicio GetAll: La solicitud contiene un tipo de dato incorrecto o un parámetro inválido")
	}
}
```

### 3.1 Explicación por Partes
1. Declaración objeto errgroup
```golang
wge := new(errgroup.Group)
```
2. Limitando numero maximo de rutinas
```golang
wge.SetLimit(-1) //un numero negativo indica sin limite
wge.SetLimit(2)  // un numero positivo entero, indica la cantidad máxima de rutinas que se pueden alcanzar
```
3. Declaración rutinas mediante el objeto de errgroup
```golang
wge.Go(func() error {
        //Codigo de la rutina
})
```
4. Función wait, permite esperar a que todas las rutinas finalicen y luego continuar
```golang
if err := g.Wait(); err == nil {
		//Realizar manejo de errores
	}
```
5. (Si se requiere) En caso tal que se requiera acceder a una variable externa a la rutina es necesario declarar un 'mutex' qué nos ayude a bloquear y desbloquear el acceso a esta variable. Esto con el objetivo de que cada hilo o rutina espere a que el anterior termine para asignar un nuevo valor a la respectiva variable.
```golang
var mutex sync.Mutex
//Dentro de la rutina
  mutex.Lock()
  resultados = append(resultados, resultado)
  mutex.Unlock()
```
