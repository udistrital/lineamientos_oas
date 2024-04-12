# Microfontend:

## Aplicación Parcel:

 Parcel se utiliza para empaquetar cada microfrontend de la aplicación, lo que significa que cada microfrontend y sus dependencias se pueden empaquetar en un único archivo JavaScript.
 

# Creación de Aplicación Parcel Angular:

Comando para la creación de aplicaciones con single spa

```bash
npx create-single-spa
```
Seleccionan las siguientes opciones:


```bash
? Directory for new project .

? Select type to generate

 single-spa application / parcel

? Which framework do you want to use? 

angular

? Project name (can use letters, numbers, dash or underscore)

 microcliente01

? Would you like to add Angular routing? Yes

? Which stylesheet format would you like to use? CSS

The package single-spa-angular@9.0.1 will be installed and executed.
Would you like to proceed? Yes

? Does your application use Angular routing? Yes

? What port should your project run on? 4201

```

Instalación de dependencias:

```bash
npm install
```
<br>

# Configuración de Aplicación Parcel Angular:

## Configuración de variable de entorno:

Creación:

```bash
ng g environments 
```

Valores a agregar:

environment.development.ts
```bash
export const environment = {
    production:true
};
```

environment.ts
```bash
export const environment = {
    production:false
};
```

## configuracion selector de componente:

Cambiamos el nombre del selector del app.component.ts:

en este ejemplo se cambia el nombre por mf1
```bash
@Component({
  selector: 'mf1',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
```

Indicamos a single que conponente va a tomar para comprimir 

main.single-spa.ts

```bash
const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: '<mf1 />',
  Router,
  NavigationStart,
  NgZone,
});
```

En caso de usar una aplicación core utilizar empty-route para el manejo de las rutas

```bash
const routes: Routes = [
  {path:'**',component:EmptyRouteComponent}
];
```

# Varificar microcliente:

Para poder saber si esta funcionando correctamente hasta este punto debemos recurrir a la sigueiente ruta:

```bash
http://localhost:4201/main.js
```

En esta ruta nos mostrara el comprimido de la aplicacion lista por ser consumida por el root.

