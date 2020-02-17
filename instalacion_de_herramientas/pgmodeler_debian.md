# Instalación pgModeler En Distribuciones Debian/Ubuntu

- Actualizar repositorios

  ```bash
  sudo apt-get update
  sudo apt-get upgrade
  ```

- Instalar Complementos

  ```bash
  sudo apt-get install gcc libxml2-dev libpq-dev postgresql qtchooser qt5-default libqt5svg5*
  ```

- Asegurarse de que QT está instalado correctamente

  ```bash
  pkg-config libpq --cflags --libs
  # -I/usr/include -L/usr/lib64/libpq.so

  pkg-config libxml-2.0 --cflags --libs
  # -I/usr/include/libxml2 -lxml2
  ```

- Descargar fuentes de pgModeler

  Descargar la Verison [v0.9.1](https://github.com/pgmodeler/pgmodeler/archive/v0.9.1.tar.gz)

  ```bash
  cd Downloads/
  tar -zxvf pgmodeler-*.tar.gz
  ```

  Ingresar a la carpeta descomprimida segun la version descargada

  ```bash
  cd pgmodeler-0.9.1/
  ```

- Instalacion del binario

  ```bash
  qmake pgmodeler.pro
  make
  sudo make install
  ```

- Crear launcher shortcut

  ```bash
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
  ```

## Tomado de:

- Instalación Ubuntu 12.04-14.04-16.04 [www.simonholywell.com](https://www.simonholywell.com/post/2016/10/install-pgmodeler-ubuntu/)
