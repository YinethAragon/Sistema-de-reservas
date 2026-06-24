# ⚡ Guía Rápida - Sistema de Reservas

## 🚀 Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar Servidor de Desarrollo
```bash
npm start
```

El servidor se ejecutará en: **http://localhost:4200**

### 3. Acceder a la Aplicación
```
🌐 http://localhost:4200
```

---

## 🔐 Datos de Prueba

### Usuario Administrador
- **Email**: admin@sistema-reservas.com
- **Contraseña**: Admin123456

### Usuario Normal
- **Email**: usuario@sistema-reservas.com
- **Contraseña**: Usuario123456

**Nota**: Crea los usuarios a través del formulario de registro.

---

## 📋 Funcionalidades Principales

| Opción | Descripción |
|--------|------------|
| **Login** | Autenticación con email y contraseña |
| **Registro** | Crear nueva cuenta |
| **Dashboard** | Ver resumen de reservas y recursos |
| **Recursos** | Listar y crear recursos (admin) |
| **Reservas** | Crear y gestionar mis reservas |
| **Panel Admin** | Gestionar todas las reservas y recursos |

---

## 📁 Estructura Base

```
Sistema-de-Reservas/
├── src/
│   ├── app/
│   │   ├── services/        # Lógica de Firebase
│   │   ├── components/      # UI
│   │   ├── guards/          # Protección de rutas
│   │   ├── models/          # Interfaces TypeScript
│   │   └── app.routes.ts    # Configuración de rutas
│   ├── environments/        # Configuración Firebase
│   └── main.ts             # Bootstrap de la app
├── package.json            # Dependencias
├── README.md              # Documentación completa
└── SEGURIDAD.md           # Reglas Firebase
```

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm start

# Build para producción
npm run build:prod

# Test
npm test

# Linting
npm run lint
```

---

## 🔧 Troubleshooting

### ❌ "Cannot find module 'firebase'"
**Solución:**
```bash
npm install firebase
```

### ❌ "Puerto 4200 en uso"
**Solución:**
```bash
npm start -- --port 4300
```

### ❌ "Error de autenticación"
**Solución:**
1. Verifica que hayas iniciado sesión en Firebase Console
2. Verifica el `firebaseConfig` en `src/environments/environment.ts`
3. Revisa las reglas de Firestore

---

## 📞 Soporte

- 📖 Ver [README.md](./README.md) para documentación completa
- 🔒 Ver [SEGURIDAD.md](./SEGURIDAD.md) para configuración de Firebase
- 🎓 Ver [INSTALACION.md](./INSTALACION.md) para instalación detallada

---

## ✨ Recuerda

✅ Los datos se guardan automáticamente en Firebase
✅ No necesitas hacer commits de `node_modules/`
✅ Usa `.gitignore` para archivos sensibles
✅ Mantén tus credenciales privadas

¡Feliz desarrollo! 🎉
