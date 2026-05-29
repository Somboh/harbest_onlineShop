# Harbest – Marketplace Agrícola

Aplicación móvil desarrollada con React Native y Expo orientada a la compra de productos agrícolas directamente de productores.

---

## Descripción

Harbest es una aplicación móvil centrada en la visualización y compra de productos frescos como frutas, verduras y especias, con una interfaz limpia, moderna y adaptada a dispositivos móviles.

Actualmente el proyecto incluye:

- Pantalla de login
- Pantalla principal (home)
- Navegación entre pantallas
- Diseño adaptado a formato móvil
- Estructura modular y escalable

---

## Tecnologías utilizadas

- React Native
- Expo
- React Navigation
- JavaScript (ES6)
- StyleSheet para estilos nativos

---

## Estructura del proyecto

```bash
frontend/
│
├── assets/
│   └── images/
│       └── logo-harbest.png
│
├── src/
│   ├── components/
│   │   └── common/
│   │       └── ScreenContainer.jsx
│   │
│   ├── screens/
│   │   ├── LoginScreen.jsx
│   │   └── HomeScreen.jsx
│   │
│   ├── navigation/
│   │   └── StackNavigator.jsx
│   │
│   ├── styles/
│   │   ├── colors.js
│   │   └── theme.js
│   │
│   └── data/
│
├── App.js
└── package.json
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Somboh/harbest_onlineShop.git
cd harbest_onlineShop/frontend
```

---

### 2. Instalar dependencias

```bash
npm install
```

---

### 3. Ejecutar la aplicación

```bash
npx expo start
```

---

## Cómo probar la aplicación

### En dispositivo móvil (recomendado)

1. Instalar la aplicación Expo Go en el móvil
2. Escanear el código QR generado en la terminal
3. La aplicación se abrirá automáticamente

---

### En navegador

Presionar:

```bash
w
```

Nota: la aplicación está diseñada para móvil. Se recomienda usar vista responsive en el navegador.

---

## Diseño de la interfaz

La aplicación sigue una estética basada en:

- Colores naturales y suaves
- Fondo claro tipo beige
- Componentes con bordes redondeados
- Espaciado amplio y limpio
- Interfaz centrada únicamente en experiencia móvil

Colores principales:

- Verde: #668B0D
- Naranja: #d25e2c
- Fondo: #F4EEEA
- Blanco: #FEFEFE

---

## Pantallas implementadas

### Login

- Campo de email
- Campo de contraseña
- Botón de inicio de sesión
- Diseño centrado con logo de la aplicación

---

### Home

- Cabecera con logo
- Buscador de productos
- Sección de categorías
- Listado de productos populares
- Barra de navegación inferior

---

## Próximas funcionalidades

- Pantalla de detalle de producto
- Carrito de compra
- Sistema de autenticación real
- Conexión con API
- Perfil de usuario
- Sistema de favoritos

---

## Equipo

- Cristian Burgos Payá
- Teresa Cediel Campillo
- María Escribano Arce
- Pablo Romero Pérez

---

## Estado del proyecto

En desarrollo. Versión inicial funcional con login y home.
