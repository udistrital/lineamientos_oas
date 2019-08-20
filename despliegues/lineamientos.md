## Despliegue en Ambiente de desarrollo ##

    Este ambiente es de responsabilidad del grupo de desarrollo
    Pre requisitos para el despliegue:
      Definición de Swagger actualizado en repositorio de GITHUB
      Refactor de APIS

  - Pasos para el despliegues APIS o Clientes nuevos:
      1. Registrar job en Jenkins **(Líder de Desarrollo)**
      2. Solicitar Registro de Variables de Entorno en Servidor de Ambiente de Desarrollo  a Grupo de Infraestructura **(Líder de Desarrollo o Grupo de Desarrollo)**
      3. Registrar Variables de Entorno en Servidor de Ambiente de Desarrollo **(Grupo de Infraestructura)**
      4. Hacer commit en rama dev del repositorio con Swagger actualizado **(Grupo de Desarrollo)**
      5. Correr Job de Jenkins de acuerdo al tipo de api o cliente **(Líder de Desarrollo o Grupo de Desarrollo)**:
              Si el api es de tipo CRUD y tiene Beego migrations correr el job golang_api
              Si el api es de tipo CRUD y no tiene Beego migrations correr el job golang_api_no_migration
              Si el api es de tipo MID correr el job golang_api_no_migration
              Si es un cliente angularjs, crear un job basado en otro job de angularjs (titan_cliente, argo_cliente, etc)
              Si es un cliente angular, crear un job basado en otro job de angular (configuracion_cliente, presupuesto_cliente, etc)
      6. Registro en WSO2 **(Líder de Desarrollo)**:
              Si es un nuevo cliente:
                Registrar Cliente en WSO2IS local
                Crear Aplicación en WSO2AM local
                Asociar APIS a la aplicación creada
      7. Registrar el client_id en la configuración del cliente  **(Líder de Desarrollo o Grupo de Desarrollo)**

  - Pasos para el despliegues APIS o Clientes existentes:

    1. Hacer commit en rama dev del repositorio **(Grupo de Desarrollo)**
    2. Correr Job de Jenkins de acuerdo al tipo de api o cliente **(Líder de Desarrollo o Grupo de Desarrollo)**:
              Si el api es de tipo CRUD y tiene Beego migrations correr el job golang_api
              Si el api es de tipo CRUD y no tiene Beego migrations correr el job golang_api_no_migration
              Si el api es de tipo MID correr el job golang_api_no_migration  
              Si es un cliente angular correr el job creado en el paso de despliegues nuevos


  ## Despliegue en Ambiente de Pruebas ##
    Para el paso a este ambiente se tienen los siguientes pre requisitos:
      Definición de Swagger actualizado en repositorio de github
      Refactor de APIS
      Fichero .drone.yml actualizado de acuerdo a la necesidad

  - Pasos para el despliegues de APIS o Clientes nuevos:
    1. Crear Fichero .drone.yml de acuerdo a la necesidad **(Líder de Desarrollo o Grupo de Desarrollo)**
    2. Registrar Variables de Entorno en repositorio de Tuleap **(Líder de Desarrollo o Grupo de Desarrollo)**
    3. Solicitar registro de despliegue en Drone **(Líder de Desarrollo o Grupo de Desarrollo)**
    4. Registrar despliegue en Drone **(Grupo de Infraestructura)**
    5. Solicitar Registro en WSO2 **(Líder de Desarrollo)**          
    6. Realizar Registro en WSO2 **(Grupo de Arquitectura)**
        Si es un nuevo cliente:
          Registrar Cliente en WSO2IS local
          Crear Aplicación en WSO2AM local
          Asociar APIS a la aplicación creada
    7. Hacer PR a rama test del repositorio **(Líder de Desarrollo)**
    8. Verificar PR **(Grupo de Arquitectura)**
    9. Solicitar Pruebas **(Líder de Desarrollo)**
    10. Realizar Pruebas
            Pruebas Unitarias **(Líder de Desarrollo)**
            Pruebas de Carga  **(Líder de Seguridad)**
            Pruebas Funcionales **(Grupo de Soporte)**
            Pruebas de Usuario  **(Centro de Servicios)**

  - Pasos para el despliegues de APIS o Clientes existentes:
  1. Actualizar Fichero .drone.yml de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
  2. Actualizar Variables de Entorno en repositorio de Tuleap de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
  3. Solicitar actualización de registro de despliegue en Drone de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
  4. Actualizar despliegue en Drone de ser necesario **(Grupo de Infraestructura)**
  5. Solicitar Registro en WSO2 de ser necesario **(Líder de Desarrollo)**          
  6. Actualizar Registro en WSO2 de ser necesario **(Grupo de Arquitectura)**
      Si es un nuevo cliente:
        Registrar Cliente en WSO2IS local
        Crear Aplicación en WSO2AM local
        Asociar APIS a la aplicación creada
  7. Hacer PR a rama test del repositorio **(Líder de Desarrollo)**
  8. Verificar PR **(Grupo de Arquitectura)**
  9. Solicitar Pruebas **(Líder de Desarrollo)**
  10. Realizar Pruebas
          Pruebas Unitarias **(Líder de Desarrollo)**
          Pruebas de Carga  **(Líder de Seguridad)**
          Pruebas Funcionales **(Grupo de Soporte)**
          Pruebas de Usuario  **(Centro de Servicios)**



  ## Despliegue en Ambiente de Producción ##
    Para el paso a este ambiente se tienen los siguientes pre requisitos:
        Definición de Swagger actualizado en repositorio de GITHUB
        Refactor de APIS
        Fichero .drone.yml actualizado de acuerdo a la necesidad
        Resultado correcto de pruebas realizadas:
            Pruebas Unitarias **(Líder de Desarrollo)**
            Pruebas de Carga  **(Líder de Seguridad)**
            Pruebas Funcionales **(Grupo de Soporte)**
            Pruebas de Usuario  **(Centro de Servicios)**


  - Pasos para el despliegues de APIS o Clientes nuevos:
    1. Crear Fichero .drone.yml de acuerdo a la necesidad **(Líder de Desarrollo o Grupo de Desarrollo)**
    2. Registrar Variables de Entorno en repositorio de Tuleap **(Líder de Desarrollo o Grupo de Desarrollo)**
    3. Solicitar registro de despliegue en Drone **(Líder de Desarrollo o Grupo de Desarrollo)**
    4. Registrar despliegue en Drone **(Grupo de Infraestructura)**
    5. Solicitar Registro en WSO2 **(Líder de Desarrollo)**          
    6. Realizar Registro en WSO2 **(Grupo de Arquitectura)**
                  Si es un nuevo cliente:
                    Registrar Cliente en WSO2IS local
                    Crear Aplicación en WSO2AM local
                    Asociar APIS a la aplicación creada
    7. Hacer PR a rama test del repositorio **(Líder de Desarrollo)**
    8. Verificar PR **(Grupo de Arquitectura)**
    9. Solicitar Creación en  BD **(Grupo de Arquitectura)**
    10. Realizar Creación de BD **(Grupo de DBA)**

  - Pasos para el despliegues de APIS o Clientes existentes:
    1. Actualizar Fichero .drone.yml de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
    2. Actualizar Variables de Entorno en repositorio de Tuleap de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
    3. Solicitar actualización de registro de despliegue en Drone de ser necesario **(Líder de Desarrollo o Grupo de Desarrollo)**
    4. Actualizar despliegue en Drone de ser necesario **(Grupo de Infraestructura)**
    5. Solicitar Registro en WSO2 de ser necesario **(Líder de Desarrollo)**          
    6. Actualizar Registro en WSO2 de ser necesario **(Grupo de Arquitectura)**
          Si es un nuevo cliente:
           Registrar Cliente en WSO2IS local
                  Crear Aplicación en WSO2AM local
                  Asociar APIS a la aplicación creada
    7. Hacer PR a rama test del repositorio **(Líder de Desarrollo)**
    8. Verificar PR **(Grupo de Arquitectura)**
    9. Solicitar Actualización en  BD **(Grupo de Arquitectura)**
    10. Realizar Actualización de BD **(Grupo de DBA)**
