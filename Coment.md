# Genially Backend Test
## Comentarios sobre la prueba

### Ejecución
Se ha añadido un fichero dockerfile y dockercompose para ejecutar el proyecto mediante contenedores, además de poder conectarse a una BD mongo local para hacer
pruebas de repositorio.

Para desarrollo se puede ejecutar mediante el fichero docker compose haciendo simplemente
```
docker compose up
```
Para generar una imagen de producción se puede utilizar el comando
```
docker build -t genially/latest --target='production' '--progress=plain' .
```
Para seleccionar el repositorio a utilizar se puede utilizar la variable de entorno: ***REPO_MODE***
con los valores:
- mongodb: Para el repositorio con la base de datos mongodb
- memory: Para el repositorio en memoria
Nota: En caso de no establecerse se escoge por defecto el repositorio en memoria

### Tests
Se ha añadido la libreria supertest para hacer test E2E del API desarrollada. Para esta prueba se han intentado cubrir la mayor
parte del codigo tanto con test E2E como con test unitarios. He decidido utilizar como base para los tests utilizar exclusivamente
el repositorio en memoria por simplicidad y no alargar en exceso de la prueba.

### Dependencias
He tenido que actualizar algunas de las dependencias base del proyecto ya que entraban en conflicto al inententar
instalarlas utilizando las versiones que venian predefinidas en el package-lock.json

### ts-ignore
He tenido que ignorar algunas anotaciones de typescript por evitar tener que modificar demasiado el proyecto base y para resolver
un problema a la hora de generar el bundle de producción por una dependencia con la libreria "errorHandler" que esta exclusivamente
definida para usar en entorno de desarrollo

### Funcionalidad
Se ha añadido un servicio extra que devuelve el listado de Geniallys generados, ya que me era util durante el tiempo de desarrollo
para comprobar que los geniallys se creaban/modificaban/eliminaban correctamente