# Instalar Oh My ZSH

ZSH (Z Shell) es una alternativa a la común terminal de bash. ZSH es una terminal diseñada para uso interactivo que cuenta con mucho más funcionalidades y mejoras de eficiencia.  
El Oh My ZSH es un framework para gestionar la configuraciones de ZSH. Permite el uso de temas diversos compartidos por la comunidad.

## Instalación

1. Instalamos ZSH y git-core
```bash
sudo apt-get install -y  zsh git-core
```
2. Descargamos el instalador de Oh My ZSH y lo ejecutamos
```bash
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh
```
3. Cambiamos el shell a ZSH
```bash
chsh -s `which zsh`
```
4. Reiniciamos
```bash
sudo init 0
# o
sudo shutdown -r 0
```
### Configurar Tema

5.  Instalamos Powerline Fonts para los caracteres especiales
```bash
sudo apt-get install fonts-powerline
```
6. abrimos el archivo ~/.zshrc
```bash
nano ~/.zshrc
```
7.  Buscamos la variable ZSH_THEME, le damos el valor “agnoster” y guardamos.
```bash
ZSH_THEME="agnoster"
```

## Fuentes
[ohmyz.sh](https://ohmyz.sh/)  
[Themes para Oh My ZSH](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes)  
[Instalación](https://platzi.com/tutoriales/1170-git-github/2304-instalar-oh-my-zsh-en-ubuntu/)
