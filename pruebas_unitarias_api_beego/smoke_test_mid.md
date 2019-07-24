# Smoke Testing

```go
func TestEndPoint(t *testing.T) {
	//var data1 map[string]interface{}
	//var data2 []interface{}
	var data3 interface{}

	if response, err := request.GetJsonTest("http://localhost:8080/v1/usuario", &data3); err == nil {
		if response.StatusCode != 200 {
			t.Error("Erro TestEndPoint: Se esperava 200 y se obtuvo", response.StatusCode)
			t.Fail()
		} else {
			t.Log("TestEndPoint Finalizado Correctamente (OK)")
		}
	} else {
		t.Error("Erro EndPoint:", err.Error())
		t.Fail()
	}
}
```
