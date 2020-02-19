# Ambientes Dockerizado

En está sección se especificarán los lineamientos para el desarrollo de contenidos dockerizados para los ambientes de desarrollo de la  Oficina Asesora de Sistema.

## Archivo Dockerfile y docker-compose.yml

Cada repositorio deberá contener su correspondiente archivo  Dockerfile y docker-compose.yml y deberan encontrarse en la raíz del proyecto “Al mismo nivel que el README”.

Esto con el propósito de que la aplicación se pueda ejecutar en un ambiente local por los desarrolladores y se pueda implementar en la Integración Continua.

```bash
.
├── controllers
│   ├── elementos_movimiento.go
├── database
│   ├── migrations
│   │   ├── 20191108_131137_crear_tablas_movimientos_arka.go
│   └── scripts
│       ├── 20191108_131137_crear_tablas_movimientos_arka.down.sql
│       └── 20191108_131137_crear_tablas_movimientos_arka.up.sql
├── docker-compose.yml
├── Dockerfile
├── entrypoint.sh
├── main.go
├── models
│   ├── elementos_movimiento.go
├── README.md
├── routers
│   ├── commentsRouter_controllers.go
│   └── router.go
└── swagger
    └── swagger.json
```

![Archivos Dockerfile y docker-compose.yml](/ambientes_dockerizados/img/dockerizado_01.png)
