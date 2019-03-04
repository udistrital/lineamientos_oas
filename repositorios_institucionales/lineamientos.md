# Lineamiento Para Repositorios Institucionales

En está sección se establecerán las convenciones para los **nombres de repositorios**  y **branch** que se deben implementar para la Oficina Asesora de Sistemas (OAS).

## Nombre de Repositorios

Se debe establecer inicialmente el nombre del negocio separado por un guión bajo ( _ ) seguido del nombre del contexto.

Todo el nombre debe estar en minúscula

El contexto está dado por este el siguiente dominio:
- cliente
- mid
- crud

![Crear BD](/repositorios_institucionales/img/repo_01.png)

Ejemplos:

    admisiones_crud
    adminsiones_mid
    admisiones_cliente

## Nombres de Branch

Los nombres de los branch establecidos para el **Continuous Integration (CI)** son:
- dev
- test
- master

  ![Crear BD](/repositorios_institucionales/img/repo_02.png)

### Branch dev (development)
Branch dedicado al despliegue en la infraestructura local

### Branch test (testing)
Branch dedicado al despliegue en preproducción

### Branch master (master)
Branch dedicado al despliegue en producción
