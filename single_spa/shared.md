# Metodos de Compartir datos entre Microclientes:

- [LocalStorage, Cookies ](#localstorage)
- [Enlace](#enlace)
- [API](#api)
---

## LocalStorage o Cookies

El localStorage proporciona una manera sencilla de almacenar datos en el navegador. Los Microfrontends pueden leer y escribir datos en el localStorage compartido para compartir información entre ellos. Aquí tienes un ejemplo de cómo utilizarlo:

```javascript
//Micrcliente de que se desa guardar el dato
// Escribir datos en localStorage
localStorage.setItem('miDato', 'valor');

// Leer datos desde localStorage
//cualquie microcliente
const miDato = localStorage.getItem('miDato');
```


# Enlace

Una forma simple de compartir datos entre Microfrontends es pasándolos a través de un enlace. Los datos pueden ser codificados en la URL y luego decodificados por el Microfrontend receptor. Aquí tienes un ejemplo:

```javascript
//Microcliente en el que se desea traer data
export class TableComponent {
   constructor(private http: HttpClient) {
    const json = this.getData().subscribe(res =>{
      console.log(res)
    })}

  getData() {
    //Ruta del recurso que se quiere acceder de el otro microcliente
    return this.http.get('http://localhost:4201/assets/data.json');
  }}

```

Esto se puede aplicar para hojas de estilo, html, json ...

# API
Una forma más avanzada de compartir datos entre Microfrontends es a través de una API. Los Microfrontends pueden hacer solicitudes HTTP a una API compartida para recuperar o enviar datos. Aquí tienes un ejemplo básico:

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get<any>('https://api.com/data');
  }
};
```


