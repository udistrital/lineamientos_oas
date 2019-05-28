# Pruebas Unitarias API MID


## Requisitos

- Contar con una API creada según los lineamiento de la oas y que se especifican en este enlace [Generar API MID Beego]()
- Para propósitos de este ejercicio se ha creado el API MID [api_beego_request_mid]()

## Paso de parametros para los Test Mid

- Se debe especificar el parametro con la primera letra en mayuscula

Ejemplo:

    Endpoint1
    Endpoint2

```bash
Endpoint1=https://hola1.com   Endpoint2=https://hola2.com go test ./... -v
```

- Se definirá una  estructura que almacena los parámetros para ser utilizadas en las funciones de los test.

```go
var parameters struct {
	Endpoint1 string
}
```

- En cada uno de los archivos xx_test.go se debe definir una función **TestMain** que capture el parámetro

```go
func TestMain(m *testing.M) {
	parameters.Endpoint1 = os.Getenv("Endpoint1")
	flag.Parse()
	os.Exit(m.Run())
}
```

- Función que Implementa el parametro

```go
func TestEndPointSuma(t *testing.T) {
	t.Log("AAAAAAAAAAAAAAAA")
	t.Log(parameters.Endpoint1)
	t.Log("AAAAAAAAAAAAAAAA")
}
```

### Código completo


```go
package calculos

import (
	"flag"
	"os"
	"testing"

	"github.com/udistrital/api_beego_request/calculos"
)

var parameters struct {
	Endpoint1 string
}

func TestMain(m *testing.M) {
	parameters.Endpoint1 = os.Getenv("Endpoint1")
	flag.Parse()
	os.Exit(m.Run())
}

func TestSuma(t *testing.T) {
	valor := calculos.Suma(2, 2)
	if valor != 4 {
		t.Error("Se espera 4 y se obtuvo", valor)
		t.Fail()
	} else {
		t.Log("TestSuma Finalizado Correctamente (OK)")
	}
}

func TestEndPointSuma(t *testing.T) {
	t.Log("AAAAAAAAAAAAAAAA")
	t.Log(parameters.Endpoint1)
	t.Log("AAAAAAAAAAAAAAAA")
}
```

### Rut Test

```bash
Endpoint1=https://localhost:8080/v1/hola01   Endpoint2=https://localhost:8080/v1/hola02 go test ./... -v
```

Se obtiene:

```bash
=== RUN   TestSuma
--- PASS: TestSuma (0.00s)
    suma_test.go:27: TestSuma Finalizado Correctamente (OK)
=== RUN   TestEndPointSuma
--- PASS: TestEndPointSuma (0.00s)
    suma_test.go:32: AAAAAAAAAAAAAAAA
    suma_test.go:33: https://localhost:8080/v1/hola01
    suma_test.go:34: AAAAAAAAAAAAAAAA
PASS
ok  	github.com/udistrital/api_beego_request/tests/calculos	0.001s
=== RUN   TestResta
--- PASS: TestResta (0.00s)
    usuario_test.go:27: TestResta Finalizado Correctamente (OK)
=== RUN   TestEndPointResta
--- PASS: TestEndPointResta (0.00s)
    usuario_test.go:32: AAAAAAAAAAAAAAAA
    usuario_test.go:33: https://localhost:8080/v1/hola02
    usuario_test.go:34: AAAAAAAAAAAAAAAA
PASS
ok  	github.com/udistrital/api_beego_request/tests/controllers	0.003s
```


## Tomado

[https://semaphoreci.com/community/tutorials/how-to-test-in-go](https://semaphoreci.com/community/tutorials/how-to-test-in-go)

[https://golang.org/pkg/testing/#hdr-Main](https://golang.org/pkg/testing/#hdr-Main)
