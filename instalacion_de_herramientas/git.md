# Instalación Git

```sh
 ________  ___  _________   
|\   ____\|\  \|\___   ___\ 
\ \  \___|\ \  \|___ \  \_| 
 \ \  \  __\ \  \   \ \  \  
  \ \  \|\  \ \  \   \ \  \ 
   \ \_______\ \__\   \ \__\
    \|_______|\|__|    \|__|
                            
```
## Instalación en Ambiente local

### Método 1: Descarga directa desde el sitio web oficial

- Abre tu navegador web y visita la página oficial de Git: https://git-scm.com/.

- Haz clic en el botón de descarga que generalmente estará en la página de inicio.


- Selecciona la versión adecuada para Windows. El instalador se descargará automáticamente.

- Una vez descargado, ejecuta el archivo de instalación (generalmente con extensión .exe).


- Sigue las instrucciones del instalador. Puedes aceptar las opciones predeterminadas, a menos que tengas razones específicas para cambiarlas.

- Durante la instalación, asegúrate de seleccionar "Use Git from the Windows Command Prompt" para poder utilizar Git desde la línea de comandos.


- Continúa con el resto del proceso de instalación.

### Método 2: Instalación con Chocolatey (gestor de paquetes para Windows)

- Abre una ventana de PowerShell como administrador. Puedes hacer esto buscando "PowerShell" en el menú de inicio, haciendo clic derecho y seleccionando "Ejecutar como administrador".

- Ejecuta el siguiente comando para instalar Chocolatey (si aún no lo has instalado):

```sh

Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

```

- Una vez instalado Chocolatey, puedes instalar Git con el siguiente comando:

```sh

choco install git

```

### Método 3: Instalación con Scoop

Scoop es otro gestor de paquetes para Windows que facilita la instalación y gestión de software. Aquí tienes los pasos:

- Abre una ventana de PowerShell como administrador (sigue el mismo paso que en el método de Chocolatey).

- Ejecuta el siguiente comando para instalar Scoop (si aún no lo has instalado):

```sh

iwr -useb get.scoop.sh | iex

```

- Después de la instalación, agrega el "bucket" (repositorio) adicional necesario para instalar Git:

```sh

scoop bucket add extras

```
- Ahora, puedes instalar Git con el siguiente comando:

```sh

scoop install git

```