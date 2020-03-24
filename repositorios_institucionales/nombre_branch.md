# Lineamiento Para Repositorios Institucionales

Siendo la OAS una dependencia que dentro sus múltiples funcionalidades y capacidades realiza el desarrollo de software misional para la Universidad Distrital, es de vital importancia la implementación de estándares y lineamiento de alta calidad en el ciclo de desarrollo de software, es por ende que [GitFow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)  es el flujo de trabajo establecido para los desarrollos  de la dependencia.


## GitFlow Workflow
El Gitflow workflow  es un flujo de trabajo para git que fue publicado y se hizo muy popular por   [Vincent Driessen at nvie](https://nvie.com/posts/a-successful-git-branching-model/).
El flujo de trabajo Gitflow  define un estricto modelo de branch diseñado alrededor de los lanzamientos “release” del proyecto.  Esto proporciona un framework robusto para gestionar proyectos.
Este modelo no agrega ningún nuevo concepto o comando más allá de lo que se requiera para [Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). En cambio, asigna roles muy específicos a diferentes branches y define cómo y cuando estos deberían interactuar.  Además de **feature** branches, este usa individuales branch para la preparación , mantenimiento y grabaciones de lanzamiento, por supuesto, también puede aprobechar todos los beneficios del Feature Branch Workflow: pull requests, isolated experiments  y una colaboración eficiente

## Iniciar
Gitflow es realmente sólo una idea abstracta de un flujo de trabajo de Git. Esto significa que dicta qué tipo de branch establecer y cómo fusionarlas.

```bash
apt-get install git-flow
```

### Develop and Master Branch

![Develop and Master branches](/repositorios_institucionales/img/gitflow_master_develop.svg)

En lugar de un simple branch master, este workflow usa dos branch para registrar el historial del proyecto, El master brancha almacena la historia de lanzamientos oficiales “official release history” y el branch develop sirve como un branch de integración por “características” features.
También es conveniente etiquetar todos los commits en la rama master con un número de versión.


### Feature Branches

![Feature branch](/repositorios_institucionales/img/gitflow_feature_branches.svg)

Cada nueva característica debe residir en su propio branch, Se pueden enviar al repositorio central para respaldo/colaboración. Pero, en lugar de bifurcarse del master, las ramas de feature usan el branch desarrollo como su padre. Cuando una feature es completada, está es integrada a develop. Las features nunca deberían interactuar con el master.
Los branch de feature son generalmente creado a partir de la ultima version del branch develop.


### Release Branches

![Feature branch](/repositorios_institucionales/img/gitflow_release_branches.svg)


Una vez que el desarrollo ha adquirido suficientes características para un lanzamiento (o se acerca una fecha de lanzamiento predeterminada) Creas un release branch a partir de la rama develop, Creando está branch inicia el siguiente ciclo de releace. **Así que no se pueden agregar nuevas características después de este punto, solo las correcciones de errores, la generación de documentación y otras tareas orientadas a la versión deben ir en esta rama**. Una vez que está listo para enviar, la rama de release se fusiona en master y se etiqueta con un número de versión. Además, debe fusionarse nuevamente en el develop, que puede haber progresado desde que se inició el lanzamiento.

El uso de una rama dedicada para preparar lanzamientos hace posible que un equipo pueda pulir el lanzamiento actual mientras otro equipo continúa trabajando en las características para el próximo lanzamiento. También crea fases de desarrollo bien definidas (por ejemplo, es fácil decir: "Esta semana nos estamos preparando para la versión 4.0" y verlo realmente en la estructura del repositorio).


### Hotfix Branches

![Feature branch](/repositorios_institucionales/img/gitflow_hotfix.svg)

la rama de mantenimiento o “hotfix” es usada para parchear rápidamente lanzamiento de producción. los hotfix branch son muy parecidos a los release branches y a los feature branches excepto que se basan en master y no de develops.  Este es el único branch que debería bifurcarse directamente del máster.  tan pronto como la reparación es completada, iste deber hacer merge con master y develop (o en la rama de release actual), y en master debe crearse un tag con una nueva versión.

## Tomado de:
- [git-flow-cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [gitflow-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
