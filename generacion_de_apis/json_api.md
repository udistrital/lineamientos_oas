# Configurar Respuestas Json en API Beego

En está sección se especificarán los ajustes pertinentes para que las API creadas en el framewor Beego respondan en JSON conforme los estandares de la Oficina Asesora de Sistemas; esto con el fin de que no genere problemas al intregarse con el administrador de servicios WSO2.


## Solicitud POST

### Solicitud Original

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

### Solicitud con Ajustes

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

### Solicitud Original

### Solicitud con Ajustes

### Diff Solicitud GETONE

![Refactor Metodo GetOne](/generacion_de_apis/img/getone.png)


## Solicitud GETALL

### Solicitud Original

### Solicitud con Ajustes

### Diff Solicitud GETALL

![Refactor Metodo GetAll](/generacion_de_apis/img/getall.png)



### PUT

### Solicitud Original

### Solicitud con Ajustes

### Diff Solicitud PUT
![Refactor Metodo Post](/generacion_de_apis/img/put.png)


### DELETE
### Solicitud Original

### Solicitud con Ajustes

### Diff Solicitud DELETE
![Refactor Metodo Post](/generacion_de_apis/img/delete.png)
