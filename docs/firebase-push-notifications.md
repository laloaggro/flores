# Configuración de Notificaciones Push con Firebase

## Introducción

Este documento describe cómo configurar notificaciones push reales utilizando Firebase Cloud Messaging (FCM) en la aplicación web de Arreglos Victoria.

## Beneficios de Firebase Cloud Messaging

1. **Alta entrega**: Infraestructura confiable de Google
2. **Escalabilidad**: Soporte para millones de dispositivos
3. **Funcionalidades avanzadas**: Temas, condiciones, análisis
4. **Multiplataforma**: Soporte para web, iOS y Android
5. **Gratis**: Plan gratuito suficiente para aplicaciones pequeñas

## Configuración de Firebase

### Paso 1: Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto
3. Registrar la aplicación web
4. Obtener la configuración del SDK

### Paso 2: Configurar el SDK de Firebase

```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuración de Firebase (obtenida de la consola de Firebase)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = getMessaging(app);

export { app, messaging, getToken, onMessage };
```

### Paso 3: Solicitar permiso y obtener token

```javascript
// pushNotifications.js
import { messaging, getToken, onMessage } from './firebase';

/**
 * Solicitar permiso para notificaciones
 */
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permiso de notificación concedido');
      await saveFcmToken();
      return true;
    } else {
      console.log('Permiso de notificación denegado');
      return false;
    }
  } catch (error) {
    console.error('Error al solicitar permiso de notificación:', error);
    return false;
  }
}

/**
 * Guardar token FCM en el servidor
 */
async function saveFcmToken() {
  try {
    // Obtener el token FCM
    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_VAPID_KEY
    });
    
    if (token) {
      // Enviar token al servidor
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          userId: getCurrentUserId() // Función para obtener ID de usuario actual
        })
      });
      
      console.log('Token FCM guardado en el servidor');
    }
  } catch (error) {
    console.error('Error al obtener o guardar el token FCM:', error);
  }
}

/**
 * Manejar mensajes en primer plano
 */
export function handleForegroundMessages() {
  onMessage(messaging, (payload) => {
    console.log('Mensaje recibido en primer plano:', payload);
    
    // Mostrar notificación personalizada
    showCustomNotification(payload);
  });
}

/**
 * Mostrar notificación personalizada
 */
function showCustomNotification(payload) {
  const { title, body, icon, data } = payload.notification;
  
  // Crear notificación con API de notificaciones
  const notification = new Notification(title, {
    body,
    icon: icon || '/assets/images/logo.png',
    data
  });
  
  // Manejar clic en la notificación
  notification.onclick = (event) => {
    event.preventDefault();
    
    // Cerrar la notificación
    event.target.close();
    
    // Navegar a la URL si está presente
    if (data && data.url) {
      window.open(data.url, '_blank');
    }
  };
}

/**
 * Obtener ID de usuario actual
 */
function getCurrentUserId() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.id;
    } catch (e) {
      return null;
    }
  }
  return null;
}
```

### Paso 4: Integrar con el Service Worker

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Messaging
const messaging = firebase.messaging();

// Configurar manejo de mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Mensaje recibido en segundo plano:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/assets/images/logo.png',
    data: payload.notification.data
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Envío de notificaciones

### Desde el servidor

```javascript
// backend/services/notificationService.js
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
const serviceAccount = require('../config/firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const messaging = admin.messaging();

/**
 * Enviar notificación a un dispositivo específico
 */
async function sendToDevice(token, payload) {
  try {
    const response = await messaging.sendToDevice(token, payload);
    console.log('Notificación enviada exitosamente:', response);
    return response;
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    throw error;
  }
}

/**
 * Enviar notificación a múltiples dispositivos
 */
async function sendToDevices(tokens, payload) {
  try {
    const response = await messaging.sendToDevice(tokens, payload);
    console.log('Notificaciones enviadas exitosamente:', response);
    return response;
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
    throw error;
  }
}

/**
 * Enviar notificación a un tema
 */
async function sendToTopic(topic, payload) {
  try {
    const response = await messaging.sendToTopic(topic, payload);
    console.log('Notificación enviada al tema exitosamente:', response);
    return response;
  } catch (error) {
    console.error('Error al enviar notificación al tema:', error);
    throw error;
  }
}

module.exports = {
  sendToDevice,
  sendToDevices,
  sendToTopic
};
```

### Ejemplo de payload

```javascript
const payload = {
  notification: {
    title: '¡Nuevo producto disponible!',
    body: 'Descubre nuestra nueva colección de ramos primaverales',
    icon: '/assets/images/logo.png',
    click_action: 'https://arreglosvictoria.cl/products'
  },
  data: {
    url: '/products',
    productId: '123'
  }
};
```

## Manejo de temas

```javascript
// Suscribir a un tema
messaging.subscribeToTopic('new_products')
  .then(() => {
    console.log('Suscrito al tema "new_products"');
  })
  .catch((error) => {
    console.error('Error al suscribirse al tema:', error);
  });

// Cancelar suscripción a un tema
messaging.unsubscribeFromTopic('new_products')
  .then(() => {
    console.log('Cancelada la suscripción al tema "new_products"');
  })
  .catch((error) => {
    console.error('Error al cancelar la suscripción al tema:', error);
  });
```

## Consideraciones importantes

1. **HTTPS**: Las notificaciones push requieren HTTPS en producción
2. **Service Worker**: Debe estar correctamente registrado y accesible
3. **Permisos**: El usuario debe conceder permiso para recibir notificaciones
4. **Token Management**: Los tokens pueden cambiar y deben actualizarse
5. **Manejo de errores**: Implementar manejo adecuado de errores y reintentos
6. **Privacidad**: Cumplir con regulaciones de privacidad (GDPR, etc.)

## Pruebas

1. **Pruebas locales**:
   - Usar localhost con certificado HTTPS (p. ej., con ngrok)
   - Verificar registro del Service Worker
   - Probar solicitud de permisos

2. **Pruebas en staging**:
   - Desplegar en entorno de prueba con HTTPS
   - Verificar funcionamiento en diferentes navegadores
   - Probar envío de notificaciones

3. **Pruebas en producción**:
   - Monitorear tasas de entrega
   - Verificar manejo de errores
   - Recopilar métricas de uso

## Cronograma estimado

| Tarea | Duración | Descripción |
|-------|----------|-------------|
| Configuración de Firebase | 1 día | Crear proyecto y obtener credenciales |
| Implementación del cliente | 2-3 días | Integrar SDK y Service Worker |
| Implementación del servidor | 2-3 días | Configurar envío de notificaciones |
| Pruebas y optimización | 1-2 días | Verificar funcionamiento y corregir errores |
| **Total** | **6-9 días** | **Tiempo estimado completo** |

## Recursos

1. [Documentación oficial de Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
2. [Firebase Console](https://console.firebase.google.com/)
3. [Documentación de Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
4. [Web Push Notifications Guide](https://developers.google.com/web/fundamentals/push-notifications)