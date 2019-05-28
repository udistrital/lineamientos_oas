# Pruebas Unitarias API CRU

## Requisitos

- Contar con una API creada según los lineamiento de la oas y que se especifican en este enlace [Generar API Beego](/generacion_de_apis/generar_api.md)

- Para propósitos de este ejercicio se ha creado el API  [api_beego_request](https://github.com/udistrital/api_beego_request)

## Test de Funcinalidades

Creamos una sencilla función llamada **Resta** que se encuentra en el paquete controllers en el archivo  usuario.go

```golang
// Resta función para prueba unitaria ...
func Resta(num1, num2 int) (result int) {
	result = num1 - num2
	return
}
```

![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_01.png)


Siguiendo los lineamientos, creamos en la carpeta *tests* la misma estructura de paquetes de nuestro proyecto. de tal forma que ahora tenemos un directorio llamado controller. Cada uno de estos directorios almacenará las pruebas unitarias de los correspondientes archivos de los paquetes del proyecto.

```bash
└── tests
    ├── calculos
    │   └── suma_test.go
    └── controllers
        └── usuario_test.go
```

![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_02.png)

El archivo *suma_test.go* contendrá la siguiente prueba unitaria:


```golang
package controllers

import (
	"testing"

	"github.com/udistrital/api_beego_request/controllers"
)

func TestResta(t *testing.T) {
	valor := controllers.Resta(4, 2)
	if valor != 2 {
		t.Error("Se espera 4 y se obtuvo", valor)
		t.Fail()
	} else {
		t.Log("TestResta Finalizado Correctamente (OK)")
	}
}
```
De la misma manera se ha creado un nuevo paquete llamado *calculos*:

![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_03.png)

```golang
package calculos

// Sumar dos numeros
func Suma(num1, num2 int) (result int) {
	result = num1 + num2
	return
}
```

Y su respectivo paquete de pruebas

![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_04.png)

```golang
package calculos
import (
	"testing"

	"github.com/udistrital/api_beego_request/calculos"
)

func TestSuma(t *testing.T) {
	valor := calculos.Suma(2, 2)
	if valor != 4 {
		t.Error("Se espera 4 y se obtuvo", valor)
		t.Fail()
	} else {
		t.Log("TestSuma Finalizado Correctamente (OK)")
	}
}
```
## Runt Test

Ingresamos a la carpeta *tests* del proyecto

```bash
cd $GOPATH/src/github.com/udistrital/api_beego_request/tests/
```
Correr Tests

```bash
go test ./... -v
```
Resultados

```bash
=== RUN   TestSuma
--- PASS: TestSuma (0.00s)
    suma_test.go:15: TestSuma Finalizado Correctamente (OK)
PASS
ok  	github.com/udistrital/api_beego_request/tests/calculos	0.001s
=== RUN   TestResta
--- PASS: TestResta (0.00s)
    usuario_test.go:15: TestResta Finalizado Correctamente (OK)
PASS
ok  	github.com/udistrital/api_beego_request/tests/controllers	0.003s
```
