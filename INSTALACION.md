# 📝 INSTRUCCIONES PARA INSTALAR DEPENDENCIAS

## Paso 1: Abre Terminal en VS Code
- Presiona **Ctrl + `` (backtick)
- O ve a Terminal > Nueva Terminal

## Paso 2: Navega a la carpeta del proyecto
```bash
cd "C:\Users\SENA\Downloads\Sistema de Reservas"
```

## Paso 3: Instala Firebase
```bash
npm install firebase
```

## Paso 4: Instala Angular Material (Opcional pero recomendado para la UI)
```bash
ng add @angular/material
```

## Paso 5: Inicia el servidor de desarrollo
```bash
ng serve
```

La aplicación estará disponible en: http://localhost:4200

---

## ✅ Lo que hemos creado:

### 📁 Estructura de Carpetas:
```
src/
├── app/
│   ├── models/
│   │   └── cba-models.ts (Interfaces de datos)
│   ├── services/
│   │   ├── firebase.service.ts (Conexión a Firebase)
│   │   ├── auth.service.ts (Autenticación)
│   │   ├── usuarios.service.ts (CRUD Usuarios)
│   │   ├── recursos.service.ts (CRUD Recursos)
│   │   └── reservas.service.ts (CRUD Reservas + Validación)
│   ├── guards/
│   │   ├── auth.guard.ts (Proteger rutas)
│   │   └── admin.guard.ts (Solo admin)
│   └── components/ (Aquí irán los componentes)
└── environments/
    ├── environment.ts (Dev)
    └── environment.prod.ts (Producción)
```

### 🔐 Modelos de Datos (con prefijo CBA):
- **CBAUsuarios**: Registro de usuarios con roles
- **CBARecursos**: Salas, equipos, laboratorios
- **CBAReservas**: Sistema de reservas
- **CBAHorario**: Disponibilidad de recursos
- **CBAHistorial**: Registro de cambios

### 🛠️ Servicios Creados:
1. **FirebaseService**: Inicializa Firebase
2. **AuthService**: Login, Registro, Logout
3. **UsuariosService**: Gestión de usuarios
4. **RecursosService**: CRUD de recursos
5. **ReservasService**: CRUD de reservas + validación de conflictos

---

## ⚠️ IMPORTANTE - Configuración en Firebase Console

Debes habilitar estas reglas de seguridad en Firestore:

Ve a: **Firebase Console → Firestore Database → Reglas**

Reemplaza con:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /recursos/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }
    match /reservas/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /historial/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

Haz clic en **Publicar**.
