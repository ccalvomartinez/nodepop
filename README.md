# Nodepop
Maqueta de api para gestión de un sitios de anuncios de venta
La aplicación se ejecuta con express, por defecto en el puerto 3000, sobre una base de datos MongoDB.
La base de datos se llamará, por defecto _cursonode_. Este comportamiento se puede modificar desde el fichero de configuracion (_./config/config.js_) modificando la propiedad `dbName`.
Además, la aplicación usa el módulo Cluster de Nodejs para aprovechar todas las posibilidades del servidor.

Se pude ver la documentación de la API en https://github.com/ccalvomartinez/nodepop_doc.git

#### Base URL
`http://localhost:3000/apiv1`

#### Autenticación
La autenticación se realiza mediante JWT. En el fichero de configuración (_./config/config.js_) se pueden establecer los datos necesarios para la generación de tokens.

#### Log
La aplicación realiza logs en dos ficheros: _info.log_ y _error.log_ que se encuentran en la carpeta _logs_.

#### Instalación de la aplicación
1. Descargar la aplicación.
2. Desde el directorio de la aplicación, ejecutar `npm install` para descargar los paquetes necesarios.

#### Inicio de la aplicación
1. Iniciar el servidor de base de datos de MongoDB, con el puerto por defecto (27017)
2. Ejecutar `npm start`
3. Para ejecutarlo en modo de depuración ejecutar `npm run dev` (es necesario instalar las dependencias de desarrollo `npm install --dev`)

El comportamiento por defecto de la aplicación es que al iniciarse, borra todos los anuncios de la base de datos (colección "Ad") y carga nuevos anuncios desde el archivo _adsInitData.json_.
Este comportamiento se puede modificar desde el fichero de configuracion (_./config/config.js_) modificando la propiedad `loadDataToDb`.

#### Internacionalización
* La aplicación soporta internacionalización para los mensajes de error devueltos.
* Los idiomas soportados son inglés y español.
* El idioma por defecto es **inglés**.
* Para obtener los mensajes de error en español mandar  `culture:"es"` en la querystring o en el body del request.
 

#### Modelo de datos

##### User

```javascript

        name: {
            type: String,
            required:true    
    },
        email: {
            type:String,
            required: true,
            match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/    
    },
        password: {
            type:String,
            required: true
    }
```

##### Ad

```javascript
    name: {
        type:String,
        required:true
    },
    category: {
        type:String,
        enum:['vende','busca']    
    },
    price: {
        type:Number,
        min:1
    },
    picture: String,
    tags:
        type: Array,
        enum:['work','lifeStyle','motor','mobile']    
```

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
QueryString:
```javascript
    email=<email>
    password=<contraseña>
    culture=<culture>
```
Ejemplo:  http://localhost:3000/apiv1/users/authenticate?email=ccm2@ccm.com&password=123456

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
    //Filter options
     tag=<etiqueta> //Etiqueta por la que queremos filtrar los anuncios
     sale=<true/false> // "true" para obtener los anuncios de venta, "false" para los nuncios de búsqueda
     name=<name> // Filtro por nombre de artículo. El nombre del artículo comenzará por la cadena <name>
     price=<ini>-<fin> //Ver explicación de formato más abajo
     fields=<field1>,<field2>,... // Campos de los anuncios que queremos recuperar
     // Result options
     start=<start> // Íncice de registro por el que queremos empezar a recibir los documentos
     limit=<limit> //Número de registros que queremos que nos devuelvan
     sort=<field/-field> // Campo por el que queremos ordenar. En caso de ordenación ascendente, pondremos el nombre del campo. En caso de ordenación descendente, pondremos el nombre del campo precedido por un guión.
     culture=<en/es> // "en" para Inglés, "es" para Español.
     //Obligatorio
     token=<token>
    // Formato del filtro de precio:
    //Para precios mayores que valor1: valor1-
    //Para precios menores que valor 1: -valor1
    //Para precios entre valor1 y valor2: valor1-valor2
```
**Response**
Content-Type: `application/json; charset=utf-8`
Body:
```JSON
{
  "success": true,
  "result": {
    "list": [
      {
        "_id": "591ae7f4d1f9842b500af1ed",
        "name": "cillum",
        "category": "vende",
        "price": 335.93,
        "picture": "http://localhost:3000/apiv1/ads/images/frigorifico.jpg",
        "tags": [
          "work",
          "lifeStyle",
          "motor"
        ]
      },
      {
        "_id": "591ae7f4d1f9842b500af1ee",
        "name": "tempor",
        "category": "vende",
        "price": 60.92,
        "picture": "http://localhost:3000/apiv1/ads/images/et.jpg",
        "tags": [
          "work",
          "lifeStyle"
        ]
      }
    ]
}
```
##### Listado de etiquetas

**Request**
URL: `GET http://localhost:3000/apiv1/ads/tags`
QueryString:
```javascript
   culture=<en/es> // "en" para Inglés, "es" para Español.
   //Obligatorio
    token=<token>
```

**Response**
Content-Type: `application/json; charset=utf-8`
Body: 
```JSON
{
  "success": true,
  "result": {
    "listTags": [
      "lifeStyle",
      "motor",
      "work"
    ],
    "total": 3
  }
}
```
