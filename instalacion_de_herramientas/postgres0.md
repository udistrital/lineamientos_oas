# Instalación Postgres

## En Distribuciones Debian/Ubuntu

- Actualizar repositorios

      sudo apt-get update
      sudo apt-get upgrade

- Instalar Postgresql en la version actual del repositorios

      sudo apt-get install postgresql


- Recuerde configurar la autenticación de postgresql en el archivo pg_hba.conf

      sudo nano /etc/postgresql/9.5/main/pg_hba.conf

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

- Reiniciar servicio

      sudo service postgresql restart

## En Distribuciones Red Hat/Centos

- Actualizar repositorios

      sudo yum install -y epel-release
      sudo yum -y update

- Instalar Postgresql en la version actual del repositorios

      sudo yum install -y postgresql-server

- Iniciar DB

      sudo postgresql-setup initdb

- Iniciar el servidor PostgreSQL y permitir que se inicie al momento de arranque

      sudo systemctl start postgresql
      sudo systemctl enable postgresql

- Recuerde configurar la autenticación de postgresql en el archivo pg_hba.conf

      sudo nano /var/lib/pgsql/data/pg_hba.conf

    Esta configuración solo aplica en ambientes de desarrollo

      host    all             all             127.0.0.1/32            trust
      host    all             all             ::1/128                 trust

- Reiniciar servicio

      sudo systemctl restart postgresql
