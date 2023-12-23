# Instalación de GIT

> No tiene requisitos previos

## En Sistemas Operativos GNU/Linux basados en Debian, Ubuntu o Mint...
```sh
sudo apt install git -y
```
De ser otro SO, usar el gestor de paquetes respectivo. Si necesitas ayuda busca aquí: [Descargar Git para Linux y Unix](https://git-scm.com/download/linux) 

## En Sistemas Windows
Descarga el instalador desde [la página oficial](https://git-scm.com/download/win) y ejecutalo. A continuación te daremos algunas consideraciones a gusto personal:
- Agregar Perfil Git Bash en la terminal de windows
- No crear una carpeta en el menu de inicio
- Puedes cambiar el editor de texto para los commits


# Comprobar instalacion

```sh
$ git --version
git version 2.39.2
```

# Post-instalacion
Posteriormente a la instalación se hace la configuración básica de git con los siguientes comandos

```sh
$ git config --global user.name "nombre"
$ git config --global user.email correo@example.com
```

También se debe generar una clave ssh para poder utilizarla con tu cuenta de GitHub. Para ello, ejecuta los siguientes comandos
```sh
$ mkdir $HOME/.ssh    # Crear carpeta .ssh
$ cd $HOME/.ssh       # Acceder a la carpeta .ssh
$ ssh-keygen -t ed25519 # Crear llave ssh con el algoritmo ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/user/.ssh/id_ed25519):
```
En este punto presiona enter para dejar el nombre por defecto. Luego va a pedir una clave que es opcional por si deseas ingresar una clave al hacer cualquier commit.

Esto generará 2 claves, una pública y una privada. Vamos a utilizar la llave pública(el archivo generado que termina en .pub) y la vamos a agregar en la configuración de GitHub, esto se hace mediante la consola web accediendo a [Configuracion y Claves SSH](https://github.com/settings/ssh/new) donde en el apartado de key se pega el contenido del archivo `.pub`, y agregamos la llave SSH.

Ahora podemos eliminar la llave pública:
```sh
$ rm $HOME/.ssh/id_ed25519.pub
```

# Probar connexión por ssh
Y para comprobar que hemos agregado la llave correctamente, podemos verificar utilizando el siguiente comando:
```sh
$ ssh -T git@github.com
Hi user! You've successfully authenticated, but GitHub does not provide shell access.
```
Donde, si sale tu nombre de usuario de GitHub en lugar de `user`, se realizó la configuración con exito.