# Organigrama OATI - Editor local portable

Editor `HTML + CSS + JS` para crear y mantener organigramas OATI.

## Estructura para repositorio

- `index.html` interfaz principal
- `styles.css` estilos y tema
- `app.js` logica completa del editor
- `README.md` guia de uso

Sube esta carpeta tal cual al repositorio.

## Uso rapido

1. Abre `index.html` en cualquier navegador moderno.
2. Edita el diagrama (mover, redimensionar, conectar, menu clic derecho).
3. Usa `Guardar .json` para exportar el estado portable.
4. Usa `Cargar .json` para abrir ese estado en cualquier PC o carpeta.

## Persistencia y portabilidad

- Guardado automatico local: `localStorage` (misma maquina/navegador).
- Portabilidad total: `Guardar .json` y luego `Cargar .json`.
- Al mover la carpeta a otro lugar, no pierdes cambios si llevas tu `.json`.

## Funciones clave

- Equipos, personas, funciones, comentarios.
- Conexion manual y automatica.
- Seleccion y borrado con `Supr/Delete`.
- Menu contextual (editar texto, agrandar/reducir fuente, cambiar color).
- Exportar PDF recortado al contenido (sin fondo decorativo).
