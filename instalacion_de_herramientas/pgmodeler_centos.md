# Instalación pgModeler En Distribuciones Red Hat/Centos

- Actualizar repositorios

      sudo yum update -y

- Instalar complementos

      sudo yum install libmpc-devel mpfr-devel gmp-devel glibc-static freeglut-devel glew-devel libpng-devel numpy freetype-devel tkinter libxml2-devel libxslt-devel postgresql-devel -y

- Comprobar si está instalado Gcc

      whereis gcc
      # gcc: /usr/bin/gcc /usr/lib/gcc /usr/libexec/gcc /usr/share/man/man1/gcc.1.gz

    Tambien

      gcc --version
      # gcc (GCC) 4.8.5 20150623 (Red Hat 4.8.5-11)
      # Copyright (C) 2015 Free Software Foundation, Inc.
      # Esto es software libre; vea el código para las condiciones de copia.  NO hay
      # garantía; ni siquiera para MERCANTIBILIDAD o IDONEIDAD PARA UN PROPÓSITO EN PARTICULAR

    En caso de no tener Gcc, para Instalar:

      sudo yum group install "Development Tools"
      sudo yum group mark install "Development Tools"

- Configurar PostgreSQL Client Library (libpq)

      sudo nano /usr/lib64/pkgconfig/libpq.pc

    Agregar

      prefix=/usr
      exec_prefix=${prefix}
      libdir=${prefix}/lib64/pgsql
      includedir=${prefix}/include/pgsql

      Name: LibPQ
      Version: 5.0.0
      Description: Library PQ
      Requires:
      Libs: -L${libdir} -lpq
      Cflags: -I${includedir


- Comprobar instalacion XML2 library

      pkg-config libxml-2.0 --cflags --libs
      # -I/usr/include/libxml2  -lxml2

- Comprobar instalacion libpq library

      pkg-config libpq --cflags --libs
      # -I/usr/include/pgsql  -L/usr/lib64/pgsql -lpq

- Instalar QT

      sudo yum install qt5-qtbase-devel qt5-qtsvg-devel -y

    Crear varialbes de Qt al PATH

      sudo nano /etc/profile.d/qt5.sh

    Agregar

      PATH=/usr/lib64/qt5/bin:$PATH
      export PATH

    Actualizar

      source /etc/profile.d/qt5.sh

- Verificar Instalacion QT

      which qmake
      # /usr/lib64/qt5/bin/qmake


- Descargar fuentes de pgModeler

  Descargar la versión **v0.9.1** con extención **.tar.gz** del siguiente link [https://github.com/pgmodeler/pgmodeler/releases](https://github.com/pgmodeler/pgmodeler/releases)

  Descomprimir el fuente de extención .tar.gz

      cd Downloads/
      tar -zxvf pgmodeler-*.tar.gz

  Ingresar a la carpeta descomprimida segun la version descargada

      cd pgmodeler-0.9.1/

- Instalacion del binario

      qmake pgmodeler.pro
      make
      sudo make install

- Crear launcher shortcut

      sudo nano /usr/share/applications/pgmodeler.desktop

      [Desktop Entry]
      Name=pgModeler
      Type=Application
      Exec=pgmodeler
      Terminal=false
      Icon=/usr/local/share/pgmodeler/conf/pgmodeler_logo.png
      Comment=Integrated Development Environment
      NoDisplay=false
      Categories=Development;IDE;
      Name[en]=pgModeler

## Tomado de

  [Instalar Gcc en Centos](https://www.cyberciti.biz/faq/centos-rhel-7-redhat-linux-install-gcc-compiler-development-tools/)

  [Configurar libpq](https://bugzilla.redhat.com/show_bug.cgi?id=977115)

  [Descargar Qt](https://www.qt.io/download-open-source/)

  [Configurar Qt](https://wiki.qt.io/How-to-Install-Qt-5-and-Qwt-on-CentOS-6)
