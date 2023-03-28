# Generación de clientes nuevos

En esta sección se definen los pasos a seguir para la generación de clientes nuevos. En este aspecto, se ha tenido en cuenta la experiencia de la OAS en el desarrollo de frontend con diferentes herramientas y enfoques que se ha obtenido con el paso del tiempo. Para conocer detalles de esta experiencia, se cuenta con este documento, donde se introduce la [Arquitectura microfrontends](https://docs.google.com/document/d/1_WQqneW-ha2IcIQ6D2YOGhrolzAbm-CKwhgFyaMdfI8/edit?usp=sharing).

## Cliente base

Se ha preparado un cliente base, que contiene todas las características mínimas necesarias para comenzar el desarrollo de clientes nuevos aplicando la Arquitectura microfrontends, ese cliente se encuentra alojado en el repositorio [oas_cliente](https://github.com/udistrital/oas_cliente) en la rama [feature/clientes_nuevos](https://github.com/udistrital/oas_cliente/tree/feature/clientes_nuevos).

## Pasos para comenzar

Siga los siguienets pasos para generar el nuevo cliente, para esto ya se debe contar con el repositorio correspondiente en GitHub, en la cuenta de la [Universidad Distrital](https://github.com/udistrital).

1. Clone el proyecto del repositorio de GitHub

```bash
# clonar el proyecto
git clone https://github.com/udistrital/oas_cliente.git
# ingresar al directorio del proyecto
cd oas_cliente
```

2. Ubiquese en la rama feature/clientes_nuevos

```bash
git checkout feature/clientes_nuevos
```

3. Elimine la carpeta .git (oculta) que hace referencia al repositorio oas_cliente.

```bash
rm -rf .git
```

4. Ajuste el nombre de la aplicación a desarrollar reemplazando `oas-cliente` y `oas_cliente` en todo el proyecto por el nombre de el nuevo cliente, incluyendo la carpeta contenedora de los archivos. El nombre de la carpeta debe coincidir con el nombre del repositorio nuevo ya creado.

5. Genere de nuevo la carpeta .git

```bash
git init
```

6. Sincronice el repositorio local recién creado con el nuevo repositorio remoto

```bash
git remote add origin https://github.com/udistrital/nuevo_cliente
```

7. Si es necesario, realice una actualización de la versión de las dependencias en el archivo `package.json` a nivel de version menor. Se recomienda hacerlo manualmente buscando cada subversión disponible en [npmjs.com](https://www.npmjs.com/) para evitar conflictos de dependencias.

8. Ajuste el nombre de la aplicación en environment cambiando el valor de las variables `appMenu` para cargar el menu de configuración y `appname` para cargar los logotipos correspondientes del [repositorio de assets](https://github.com/udistrital/assets).

9. Ajuste el import de los estilos correspondientes al sistema en `styles.scss` reemplazando el nombre del sistema (ver [repositorio de assets](https://github.com/udistrital/assets)). 

10. Ingrese a [configuracion_cliente](https://pruebasconfiguracion.portaloas.udistrital.edu.co/), allí genere una nueva aplicación, roles y opciones de menú para el nuevo cliente. Puede seguir el [video instructivo](https://drive.google.com/file/d/1ReySDS7KHY4Iydn6KVpmgBupGVyfCKcP/view?usp=sharing)

11. Realice la instalación de las dependencias del cliente y ejecutelo para probar que todo funciona correctamente antes de subir los cambios al repositorio. No se ha incluido el `package-lock.json` para que este se genere de acuerdo a la versión de node que se encuentre instalada. Se recomienda usar Node 16.

```bash
# Instalar dependencias
npm i --legacy-peer-deps
# ejecutar el proyecto
npm run build
```

12. Si todo funciona correctamente, realice el primer commit y subalo al repositorio de GitHub, después de esto se puede proceder con el despliegue en ambiente de pruebas junto en con el líder técnico.



