# Generar API MID

En está sección se encuentra documentado el paso a paso o los distintos comandos para generar un api mid.   
Esta documentación es tomada la documentación oficial del framework, el propósito es crear un `api_mid` que será utilizada en apartados posteriores de esta documentación.

> ### **Repositorio:** [api_mid_beego_request](https://github.com/udistrital/api_mid_beego_request)

## 1. Crear API
El siguiente comando generará un api, No se especifica la cadena de conexión a bd ya que según la arquitectura, los `api_mid` realizan una funcion de intermediación entre otras apis que corresponde a otros modelos de negocio.
```bash
# crear api
bee api api_mid_beego_request
```
El framework porporciona la siguiente salida
```bash
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.10.0
2019/06/17 16:22:21 INFO     ▶ 0001 Creating API...
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/conf
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/controllers
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/tests
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/conf/app.conf
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/models
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/routers/
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/controllers/object.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/controllers/user.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/tests/default_test.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/routers/router.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/models/object.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/models/user.go
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/main.go
2019/06/17 16:22:21 SUCCESS  ▶ 0002 New API successfully created!
```
Estructura del proyecto
```bash
tree
.
├── conf
│   └── app.conf
├── controllers
│   ├── object.go
│   └── user.go
├── main.go
├── models
│   ├── object.go
│   └── user.go
├── routers
│   └── router.go
└── tests
    └── default_test.go
```

## 2. Crear Controlador
Para crear los controladores que realizarán el trabajo fuerte dentro de nuestras aplicaciones MID utilizaremos el comando `bee generate`.   
[Tomado De bee generate](https://beego.me/docs/install/bee.md#command-generate)
```bash
# generar un controlador con nombre estudiante
bee generate controller estudiante
```
```bash
______
| ___ \
| |_/ /  ___   ___
| ___ \ / _ \ / _ \
| |_/ /|  __/|  __/
\____/  \___| \___| v1.10.0
2019/06/19 14:11:20 INFO     ▶ 0001 Using 'Estudiante' as controller name
2019/06/19 14:11:20 INFO     ▶ 0002 Using 'controllers' as package name
	create	 /home/jjvargass/go/src/github.com/udistrital/api_mid_beego_request/controllers/estudiante.go
2019/06/19 14:11:20 SUCCESS  ▶ 0003 Controller successfully generated!
```

Este comando creará un controlador con lo métodos CRUD por defecto y su respectiva documentación
```go

// Post ...
// @Title Create
// @Description create Estudiante
// @Param	body		body 	models.Estudiante	true		"body for Estudiante content"
// @Success 201 {object} models.Estudiante
// @Failure 403 body is empty
// @router / [post]
func (c *EstudianteController) Post() {

}

// GetOne ...
// @Title GetOne
// @Description get Estudiante by id
// @Param	id		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Estudiante
// @Failure 403 :id is empty
// @router /:id [get]
func (c *EstudianteController) GetOne() {

}

// GetAll ...
// @Title GetAll
// @Description get Estudiante
// @Param	query	query	string	false	"Filter. e.g. col1:v1,col2:v2 ..."
// @Param	fields	query	string	false	"Fields returned. e.g. col1,col2 ..."
// @Param	sortby	query	string	false	"Sorted-by fields. e.g. col1,col2 ..."
// @Param	order	query	string	false	"Order corresponding to each sortby field, if single value, apply to all sortby fields. e.g. desc,asc ..."
// @Param	limit	query	string	false	"Limit the size of result set. Must be an integer"
// @Param	offset	query	string	false	"Start position of result set. Must be an integer"
// @Success 200 {object} models.Estudiante
// @Failure 403
// @router / [get]
func (c *EstudianteController) GetAll() {

}

// Put ...
// @Title Put
// @Description update the Estudiante
// @Param	id		path 	string	true		"The id you want to update"
// @Param	body		body 	models.Estudiante	true		"body for Estudiante content"
// @Success 200 {object} models.Estudiante
// @Failure 403 :id is not int
// @router /:id [put]
func (c *EstudianteController) Put() {

}

// Delete ...
// @Title Delete
// @Description delete the Estudiante
// @Param	id		path 	string	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 id is empty
// @router /:id [delete]
func (c *EstudianteController) Delete() {

}
```
De esta forma podrá personalizar a las necesidades.

## 3. Correr API MID
Las API MID corrern como cualquier otra api desarrollada en beego. Lo unico a tener en cuenta es que estas reciben los endpoint de las otras apis de las cuales consume servicios.
```
bee run ENDPOINT_AGORA ENDPOINT_ARGO
```

## Tomado

[https://beego.me/docs/install/bee.md](https://beego.me/docs/install/bee.md)
