# Pruebas Unitarias API CRU

## Requisitos

Contamos con una API creada según lineamiento [Generar API Beego](/generacion_de_apis/generar_api.md), para propósitos de este ejercicio se ha creado el API  [api_beego_request](https://github.com/udistrital/api_beego_request)

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

Siguiendo los lineamientos, creamos en la carpeta test un directorio llamado controller de la siguiente manera [*tests/controllers*], que  almacena las pruebas unitarias de los archivos correspondientes a los controller.

![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_02.png)

Este archivo contendrá la siguiente prueba unitaria:


```golang
package test

import (
	"testing"

	"github.com/udistrital/api_beego_request/controllers"
)

func TestResta(t *testing.T) {
	valor := controllers.Resta(4, 2)
	if valor != 2 {
		t.Error("Se espera 4 y es obtuvo", valor)
		t.Fail()
	} else {
		t.Log("TestResta Finalizado Correctamente (OK)")
	}
}
```
De la misma manera se ha creado un nuevo paquete llamado *Calculos*:

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

```golang
package test
import (
	"testing"

	"github.com/udistrital/api_beego_request/calculos"
)

func TestSuma(t *testing.T) {
	valor := calculos.Suma(2, 2)
	if valor != 4 {
		t.Error("Se espera 4 y es obtuvo", valor)
		t.Fail()
	} else {
		t.Log("TestSuma Finalizado Correctamente (OK)")
	}
}
```
![Prueba Unitaria 01](/pruebas_unitarias_api_beego/img/test_04.png)
