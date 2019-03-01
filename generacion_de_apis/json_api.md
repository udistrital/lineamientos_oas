# Configurar Respuestas Json en API Beego

En está sección se especificarán los ajustes pertinentes para que las API creadas en el framewor Beego respondan en JSON conforme los estandares de la Oficina Asesora de Sistemas; esto con el fin de que no genere problemas al intregarse con el administrador de servicios WSO2.

# Refactoring Controllers

Editar el **main.go** de la API a Ajustar. Agregar las plantillas de errores que se encuentran en el repositorio **[utils_oas](https://github.com/udistrital/utils_oas)** de la siguiente forma.

- Importar paquete:

      import (
        "github.com/udistrital/utils_oas/customerror"
      )

- Implementación en **func main()**:

      beego.ErrorController(&customerror.CustomErrorController{})

- El **main.go** Lucirá de la siguiente forma:

      package main

      import (
          "github.com/astaxie/beego"
          "github.com/astaxie/beego/orm"
          "github.com/astaxie/beego/plugins/cors"
          _ "github.com/jotavargas/debug_beego_request/routers"
          _ "github.com/lib/pq"
          "github.com/udistrital/utils_oas/customerror"
      )

      func init() {
          orm.RegisterDataBase("default", "postgres", "postgres://postgres:postgres@127.0.0.1/test?sslmode=disable")
      }

      func main() {
          if beego.BConfig.RunMode == "dev" {
              beego.BConfig.WebConfig.DirectoryIndex = true
              beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
          }

          beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
              AllowOrigins: []string{"*"},
              AllowMethods: []string{"PUT", "PATCH", "GET", "POST", "OPTIONS", "DELETE"},
              AllowHeaders: []string{"Origin", "x-requested-with",
                  "content-type",
                  "accept",
                  "origin",
                  "authorization",
                  "x-csrftoken"},
              ExposeHeaders:    []string{"Content-Length"},
              AllowCredentials: true,
          }))
          beego.ErrorController(&customerror.CustomErrorController{})
          beego.Run()
      }



Los cambios específicos en cada uno de los microservicios se definirán a continuación.

## Solicitud POST

### Solicitud POST Original

    // Post ...
    // @Title Post
    // @Description create Usuario
    // @Param	body		body 	models.Usuario	true		"body for Usuario content"
    // @Success 201 {int} models.Usuario
    // @Failure 403 body is empty
    // @router / [post]
    func (c *UsuarioController) Post() {
    	var v models.Usuario
    	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
    		if _, err := models.AddUsuario(&v); err == nil {
    			c.Ctx.Output.SetStatus(201)
    			c.Data["json"] = v
    		} else {
    			c.Data["json"] = err.Error()
    		}
    	} else {
    		c.Data["json"] = err.Error()
    	}
    	c.ServeJSON()
    }

### Solicitud POST con Ajustes

    // Post ...
    // @Title Post
    // @Description create Usuario
    // @Param	body		body 	models.Usuario	true		"body for Usuario content"
    // @Success 201 {int} models.Usuario
    // @Failure 400 the request contains incorrect syntax
    // @router / [post]
    func (c *UsuarioController) Post() {
    	var v models.Usuario
    	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
    		if _, err := models.AddUsuario(&v); err == nil {
    			c.Ctx.Output.SetStatus(201)
    			c.Data["json"] = v
    		} else {
    			beego.Error(err)
    			c.Abort("400")
    		}
    	} else {
    		beego.Error(err)
    		c.Abort("400")
    	}
    	c.ServeJSON()
    }

### Diff Solicitud POST

  ![Refactor Metodo Post](/generacion_de_apis/img/post.png)


## Solicitud GETONE

### Solicitud GETONE Original

    // GetOne ...
    // @Title Get One
    // @Description get Usuario by id
    // @Param	id		path 	string	true		"The key for staticblock"
    // @Success 200 {object} models.Usuario
    // @Failure 403 :id is empty
    // @router /:id [get]
    func (c *UsuarioController) GetOne() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	v, err := models.GetUsuarioById(id)
    	if err != nil {
    		c.Data["json"] = err.Error()
    	} else {
    		c.Data["json"] = v
    	}
    	c.ServeJSON()
    }

### Solicitud GETONE con Ajustes

    // GetOne ...
    // @Title Get One
    // @Description get Usuario by id
    // @Param	id		path 	string	true		"The key for staticblock"
    // @Success 200 {object} models.Usuario
    // @Failure 404 not found resource
    // @router /:id [get]
    func (c *UsuarioController) GetOne() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	v, err := models.GetUsuarioById(id)
    	if err != nil {
    		beego.Error(err)
    		c.Abort("404")
    	} else {
    		c.Data["json"] = v
    	}
    	c.ServeJSON()
    }


### Diff Solicitud GETONE

  ![Refactor Metodo GetOne](/generacion_de_apis/img/getone.png)


## Solicitud GETALL

### Solicitud GETALL Original

    // GetAll ...
    // @Title Get All
    // @Description get Usuario
    // @Param	query	query	string	false	"Filter. e.g. col1:v1,col2:v2 ..."
    // @Param	fields	query	string	false	"Fields returned. e.g. col1,col2 ..."
    // @Param	sortby	query	string	false	"Sorted-by fields. e.g. col1,col2 ..."
    // @Param	order	query	string	false	"Order corresponding to each sortby field, if single value, apply to all sortby fields. e.g. desc,asc ..."
    // @Param	limit	query	string	false	"Limit the size of result set. Must be an integer"
    // @Param	offset	query	string	false	"Start position of result set. Must be an integer"
    // @Success 200 {object} models.Usuario
    // @Failure 403
    // @router / [get]
    func (c *UsuarioController) GetAll() {
    	var fields []string
    	var sortby []string
    	var order []string
    	var query = make(map[string]string)
    	var limit int64 = 10
    	var offset int64

    	// fields: col1,col2,entity.col3
    	if v := c.GetString("fields"); v != "" {
    		fields = strings.Split(v, ",")
    	}
    	// limit: 10 (default is 10)
    	if v, err := c.GetInt64("limit"); err == nil {
    		limit = v
    	}
    	// offset: 0 (default is 0)
    	if v, err := c.GetInt64("offset"); err == nil {
    		offset = v
    	}
    	// sortby: col1,col2
    	if v := c.GetString("sortby"); v != "" {
    		sortby = strings.Split(v, ",")
    	}
    	// order: desc,asc
    	if v := c.GetString("order"); v != "" {
    		order = strings.Split(v, ",")
    	}
    	// query: k:v,k:v
    	if v := c.GetString("query"); v != "" {
    		for _, cond := range strings.Split(v, ",") {
    			kv := strings.SplitN(cond, ":", 2)
    			if len(kv) != 2 {
    				c.Data["json"] = errors.New("Error: invalid query key/value pair")
    				c.ServeJSON()
    				return
    			}
    			k, v := kv[0], kv[1]
    			query[k] = v
    		}
    	}

    	l, err := models.GetAllUsuario(query, fields, sortby, order, offset, limit)
    	if err != nil {
    		c.Data["json"] = err.Error()
    	} else {
    		c.Data["json"] = l
    	}
    	c.ServeJSON()
    }

### Solicitud GETALL con Ajustes

    // GetAll ...
    // @Title Get All
    // @Description get Usuario
    // @Param	query	query	string	false	"Filter. e.g. col1:v1,col2:v2 ..."
    // @Param	fields	query	string	false	"Fields returned. e.g. col1,col2 ..."
    // @Param	sortby	query	string	false	"Sorted-by fields. e.g. col1,col2 ..."
    // @Param	order	query	string	false	"Order corresponding to each sortby field, if single value, apply to all sortby fields. e.g. desc,asc ..."
    // @Param	limit	query	string	false	"Limit the size of result set. Must be an integer"
    // @Param	offset	query	string	false	"Start position of result set. Must be an integer"
    // @Success 200 {object} models.Usuario
    // @Failure 404 not found resource
    // @router / [get]
    func (c *UsuarioController) GetAll() {
    	var fields []string
    	var sortby []string
    	var order []string
    	var query = make(map[string]string)
    	var limit int64 = 10
    	var offset int64

    	// fields: col1,col2,entity.col3
    	if v := c.GetString("fields"); v != "" {
    		fields = strings.Split(v, ",")
    	}
    	// limit: 10 (default is 10)
    	if v, err := c.GetInt64("limit"); err == nil {
    		limit = v
    	}
    	// offset: 0 (default is 0)
    	if v, err := c.GetInt64("offset"); err == nil {
    		offset = v
    	}
    	// sortby: col1,col2
    	if v := c.GetString("sortby"); v != "" {
    		sortby = strings.Split(v, ",")
    	}
    	// order: desc,asc
    	if v := c.GetString("order"); v != "" {
    		order = strings.Split(v, ",")
    	}
    	// query: k:v,k:v
    	if v := c.GetString("query"); v != "" {
    		for _, cond := range strings.Split(v, ",") {
    			kv := strings.SplitN(cond, ":", 2)
    			if len(kv) != 2 {
    				c.Data["json"] = errors.New("Error: invalid query key/value pair")
    				c.ServeJSON()
    				return
    			}
    			k, v := kv[0], kv[1]
    			query[k] = v
    		}
    	}

    	l, err := models.GetAllUsuario(query, fields, sortby, order, offset, limit)
    	if err != nil {
    		beego.Error(err)
    		c.Abort("404")
    	} else {
    		if l == nil {
    			l = append(l, map[string]interface{}{})
    		}
    		c.Data["json"] = l
    	}
    	c.ServeJSON()
    }

### Diff Solicitud GETALL

  ![Refactor Metodo GetAll](/generacion_de_apis/img/getall.png)


### Solicitud PUT

### Solicitud PUT Original

    // Put ...
    // @Title Put
    // @Description update the Usuario
    // @Param	id		path 	string	true		"The id you want to update"
    // @Param	body		body 	models.Usuario	true		"body for Usuario content"
    // @Success 200 {object} models.Usuario
    // @Failure 403 :id is not int
    // @router /:id [put]
    func (c *UsuarioController) Put() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	v := models.Usuario{Id: id}
    	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
    		if err := models.UpdateUsuarioById(&v); err == nil {
    			c.Data["json"] = "OK"
    		} else {
    			c.Data["json"] = err.Error()
    		}
    	} else {
    		c.Data["json"] = err.Error()
    	}
    	c.ServeJSON()
    }

### Solicitud PUT con Ajustes

    // Put ...
    // @Title Put
    // @Description update the Usuario
    // @Param	id		path 	string	true		"The id you want to update"
    // @Param	body		body 	models.Usuario	true		"body for Usuario content"
    // @Success 200 {object} models.Usuario
    // @Failure 400 the request contains incorrect syntax
    // @router /:id [put]
    func (c *UsuarioController) Put() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	v := models.Usuario{Id: id}
    	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
    		if err := models.UpdateUsuarioById(&v); err == nil {
    			c.Data["json"] = v
    		} else {
    			beego.Error(err)
    			c.Abort("400")
    		}
    	} else {
    		beego.Error(err)
    		c.Abort("400")
    	}
    	c.ServeJSON()
    }

### Diff Solicitud PUT
  ![Refactor Metodo Post](/generacion_de_apis/img/put.png)


### DELETE

### Solicitud DELETE Original

    // Delete ...
    // @Title Delete
    // @Description delete the Usuario
    // @Param	id		path 	string	true		"The id you want to delete"
    // @Success 200 {string} delete success!
    // @Failure 403 id is empty
    // @router /:id [delete]
    func (c *UsuarioController) Delete() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	if err := models.DeleteUsuario(id); err == nil {
    		c.Data["json"] = "OK"
    	} else {
    		c.Data["json"] = err.Error()
    	}
    	c.ServeJSON()
    }

### Solicitud DELETE con Ajustes

    // Delete ...
    // @Title Delete
    // @Description delete the Usuario
    // @Param	id		path 	string	true		"The id you want to delete"
    // @Success 200 {string} delete success!
    // @Failure 404 not found resource
    // @router /:id [delete]
    func (c *UsuarioController) Delete() {
    	idStr := c.Ctx.Input.Param(":id")
    	id, _ := strconv.Atoi(idStr)
    	if err := models.DeleteUsuario(id); err == nil {
    		c.Data["json"] = map[string]interface{}{"Id": id}
    	} else {
    		beego.Error(err)
    		c.Abort("404")
    	}
    	c.ServeJSON()
    }

### Diff Solicitud DELETE
  ![Refactor Metodo Post](/generacion_de_apis/img/delete.png)
