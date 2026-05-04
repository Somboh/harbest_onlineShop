# Harbest Online Shop

## Instrucciones Backend
- Instalar dependencias, (las librerias que hay en el archivo **package.json**):
```npm install```

- Para iniciar el Backend hay que ejecutar el comando:
```npm start```

Como usamos **nodemon** con solo guardar los cambios sirve, no hay que volver a iniciar el backend.

## Instrucciones Frontend
El frontend está hecho con Expo (React Native + react-native-web), así que la misma base de código corre en móvil y en navegador.

- Para arrancar en navegador: ```npm run web```
- Para arrancar en Android: ```npm run android```
- Para arrancar en iOS: ```npm run ios```

Los cambios se recargan en caliente automáticamente.

## Login con Google
El botón "Continuar con Google" del LoginScreen requiere configurar OAuth en Google Cloud Console. Se ofrece sólo a clientes (no a agricultores).

### 1. Crear los OAuth Client IDs en Google Cloud Console
- Entra a [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
- Crea **tres OAuth 2.0 Client IDs** del mismo proyecto:
  - **Web** → tipo "Web application". En "Authorized redirect URIs" añade `https://auth.expo.io/@TU_USUARIO_EXPO/frontend` y la URL del frontend desplegado en Render.
  - **iOS** → tipo "iOS". Bundle ID: el de `app.json` (campo `expo.ios.bundleIdentifier`, ahora mismo no está fijado, ponle uno).
  - **Android** → tipo "Android". Package name: el de `app.json` (campo `expo.android.package`).

### 2. Pegarlos en el frontend
En `frontend/app.json`, sustituir los `TODO_..._CLIENT_ID` dentro de `expo.extra.googleClientIds.{web,ios,android}`.

### 3. Pegarlos en el backend
En `backend/.env`, añadir (los tres son válidos como audiencia del id_token):
```
GOOGLE_CLIENT_ID_WEB=...apps.googleusercontent.com
GOOGLE_CLIENT_ID_IOS=...apps.googleusercontent.com
GOOGLE_CLIENT_ID_ANDROID=...apps.googleusercontent.com
```

### 4. Instalar dependencias nuevas
```
cd frontend && npx expo install expo-auth-session expo-crypto
cd backend  && npm install
```

## Render
Con este repositorio al conectarlo a render hay que tener dos servicios distintos, uno para el Backend y otro para el Frontend, cada vez que se hace un commit el propio render hace los comandos necesarios para redesplegar ambos proyectos

## Instalación
Para clonar este repositorio hay que usar:
```git clone https://github.com/Somboh/harbest_onlineShop.git```
