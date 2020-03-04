# :frog: Taller Oaxaca 2020 :mushroom:
Backend de ejemplo para el taller.

## Instalación de dependencias
Se requiere contar con una instancia de MongoDB y ejecutar el siguiente comando:
```console 
yarn install
```
## Configuración (puerto HTTP y base de datos)
Esta configuración es opcional. Si se requiere personalizar el puerto HTTP del API o personalizar 
la configuración de la base de datos, es necesario crear un archivo .env 
en la raiz del proyecto como se observa en el siguiente ejemplo:
```console 
nano .env
```

```env
PORT=3000
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=oaxaca
MONGODB_PASSWORD=tlayuda
```

## Generar datos de prueba
Genera 100 registros y los inserta en la base de datos:
```console
node create_random_data.js 100
```

## Ejecución
```console
yarn start
```
