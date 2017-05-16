# Nodepop
Maqueta de api para gestión de un sitios de anuncios de venta
La aplicación se ejecuta con express, por defecto en el puerto 3000, sobre una base de datos MongoDB.
#### Base URL
`http://localhost:3000/apiv1`

#### Autenticación
La autenticación se realiza mediante JWT. En el fichero de configuración (_./config/config.js_) se pueden establecer los datos necesarios para la generación de tokens.

#### Instalación de la aplicación
1. Descargar la aplicación.
2. Desde el directorio de la aplicación, ejecutar `npm install` para descargar los paquetes necesarios.

#### Inicio de la aplicación
1. Iniciar el servidor de base de datos de MongoDB, con el puerto por defecto (27017)
2. Ejecutar `npm start`

El comportamiento por defecto de la aplicación es que al iniciarse, borra todos los anuncios de la base de datos (colección "Ad") y carga nuevos anuncios desde el archivo _adsInitData.json_.
Este comportamiento se puede modificar desde el fichero de configuracion (_./config/config.js_) modificando la propiedad `loadDataToDb`.

#### Internacionalización
* La aplicación soporta internacionalización para los mensajes de error devueltos.
* Los idiomas soportados son inglés y español.
* El idioma por defecto es **inglés**.
* Para obtener los mensajes de error en español mandar  `culture:"es"` en la querystring o en el body del request.
 

#### Uso de la API
El flujo de uso será el siguiente:

##### Registro de usuario
Primero tendremos que registrarnos como usuario. La petición nos devolverá los datos del usuario generado.

**Request**
URL: `POST http://localhost:3000/apiv1/users`
ContenType: `application/x-www-form-urlencoded`
Body:
```javascript
     name=<nombre>
     email=<email>
     password=<contraseña>
     culture=<culture>
```
**Response**
Content-Type: `application/json; charset=utf-8`
Body: 
```JSON
{
  "success": true,
  "result": {
    "user": {
      "_id": "<id>",
      "name": "<nombre>",
      "email": "<email>"
    }
  }
}
```

##### Autenticación de usuario
Obtendremos un _token_ que tendrán que viajar en todas las peticiones para que nos permitan el acceso. La petición nos devolverá el nombre y el email del usuario, y el token.

**Request**
URL: `GET http://localhost:3000/apiv1/users/authenticate`
QueryString:`email=<email>&password=<contraseña>&culture=<culture>`

**Response**
Content-Type: `application/json; charset=utf-8`
Body: 
```JSON
{
  "success": true,
  "result": {
    "user": {
      "name": "<nombre>",
      "email": "<email>"
    },
    "token": "<token>"
  }
}
```
##### Listado de anuncios

**Request**
URL: `GET http://localhost:3000/apiv1/ads/`
QueryString:
```javascript
\\Filter options
     name=<nombre>
     email=<email>
     password=<contraseña>
     culture=<culture>
```
