# Instalación Postgres

## En Distribuciones Debian/Ubuntu

- Actualizar repositorios

  ```bash
  sudo apt-get update
  sudo apt-get upgrade
  ```

- Instalar Postgresql en la version actual del repositorios

  ```bash
  sudo apt-get install postgresql
  ```
- Recuerde configurar la autenticación de postgresql en el archivo pg_hba.conf

  ```bash
  sudo nano /etc/postgresql/9.5/main/pg_hba.conf
  ```

    Esta configuración solo aplica en ambientes de desarrollo

  ```bash
  # DO NOT DISABLE!
  # If you change this first entry you will need to make sure that the
  # database superuser can access the database using some other method.
  # Noninteractive access to all databases is required during automatic
  # maintenance (custom daily cronjobs, replication, and similar tasks).
  #
  # Database administrative login by Unix domain socket
  local   all             postgres                                trust

  # TYPE  DATABASE        USER            ADDRESS                 METHOD

  # "local" is for Unix domain socket connections only
  local   all             all                                     trust
  # IPv4 local connections:
  host    all             all             127.0.0.1/32            trust
  # IPv6 local connections:
  host    all             all             ::1/128                 trust
  # Allow replication connections from localhost, by a user with the
  # replication privilege.
  #local   replication     postgres                                peer
  #host    replication     postgres        127.0.0.1/32            md5
  #host    replication     postgres        ::1/128                 md5
  ```

- Reiniciar servicio

  ```bash
  sudo service postgresql restart
  ```

## En Distribuciones Red Hat/Centos

- Agregar repositorios

  ```bash
  sudo rpm -Uvh https://yum.postgresql.org/10/redhat/rhel-7-x86_64/pgdg-centos10-10-2.noarch.rpm
  ```

- Actualizar repositorios

  ```bash
  sudo yum install epel-release -y
  sudo yum update -y
  ```

- Instalar Postgresql 10 en Centos7

  ```bash
  sudo yum install postgresql10-server postgresql10 -y
  ```

- Inicializar PGDATA

  ```bash
  sudo /usr/pgsql-10/bin/postgresql-10-setup initdb
  ```

- Iniciar el servidor PostgreSQL y permitir que se inicie al momento de arranque

  ```bash
  systemctl start postgresql-10.service
  systemctl enable postgresql-10.service
  ```

- Verificar version

  ```bash
  sudo su - postgres -c "psql"

  # psql (10.0)
  # Type "help" for help.
  # postgres=#
  ```
- Recuerde configurar la autenticación de postgresql en el archivo pg_hba.conf

  ```bash
  sudo nano /var/lib/pgsql/10/data/pg_hba.conf

  Esta configuración solo aplica en ambientes de desarrollo

  # DO NOT DISABLE!
  # If you change this first entry you will need to make sure that the
  # database superuser can access the database using some other method.
  # Noninteractive access to all databases is required during automatic
  # maintenance (custom daily cronjobs, replication, and similar tasks).
  #
  # Database administrative login by Unix domain socket
  local   all             postgres                                trust

  # TYPE  DATABASE        USER            ADDRESS                 METHOD

  # "local" is for Unix domain socket connections only
  local   all             all                                     trust
  # IPv4 local connections:
  host    all             all             127.0.0.1/32            trust
  # IPv6 local connections:
  host    all             all             ::1/128                 trust
  # Allow replication connections from localhost, by a user with the
  # replication privilege.
  #local   replication     postgres                                peer
  #host    replication     postgres        127.0.0.1/32            md5
  #host    replication     postgres        ::1/128                 md5
  ```

- Reiniciar servicio

  ```bash
  sudo systemctl restart postgresql-10.service
  ```
