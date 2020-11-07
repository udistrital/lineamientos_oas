# Etiquetas en Comentarios de Commits

Este lineamiento establece que los commits deban contener un tag previos para proporcionar información valiosa y mantenibilidad al código.

**feat**: Describe si trabajaste en un nuevo feature.   
**fix**: Describe si solucionaste un bug.   
**docs**: Dice si hiciste algún cambio en la documentación.   
**test**: Indica si añadiste un test   
**refactor**: Nos muestra que se ejecutó algún refactor en el código.   
**devops**: En este se engloban las tareas de DevOps ya sea, Monitoreo, Automatización, etc.   
**management**: En esta categoría se agrupan todas las tareas de merge de los commits en las ramas, creación de ramas hotfix, release, etc. Este tag es para el uso exclusivo de las personas que tienen el rol de Master/Maintainer del proyecto.

![Etiqueta Commits](/repositorios_institucionales/img/etiqueta_commit.jpeg)


## Como Comentar los commits:
```bash
git commit -m "devops: ajustes formato ...."
git commit -m "fix: se realiza ....."
```
