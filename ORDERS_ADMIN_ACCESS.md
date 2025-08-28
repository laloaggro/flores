# Cómo acceder al Administrador de Órdenes

Este documento explica las diferentes formas de acceder al panel de administración de órdenes.

## Métodos de Acceso

### Método 1: A través del Panel de Administración

```
[Inicio de sesión como Administrador]
            ↓
    [Acceder al sitio web]
            ↓
       [Menú de usuario]
            ↓
   [Panel de Administración]
            ↓
    [Gestionar Pedidos]
            ↓
  [Botón "Ir a Pedidos"]
            ↓
   [admin-orders.html]
```

### Método 2: Acceso Directo desde el Menú de Usuario

```
[Inicio de sesión como Administrador]
            ↓
    [Acceder al sitio web]
            ↓
       [Menú de usuario]
            ↓
  [Administrar Pedidos]
            ↓
   [admin-orders.html]
```

### Método 3: URL Directa

```
[Inicio de sesión como Administrador]
            ↓
    [Acceder al sitio web]
            ↓
[Visitar directamente /admin-orders.html]
            ↓
   [admin-orders.html]
```

## Detalles de Implementación

### Panel de Administración
- URL: `/admin.html`
- Sección: "Gestionar Pedidos"
- Botón: "Ir a Pedidos" que redirige a `admin-orders.html`

### Menú de Usuario para Administradores
- Visible solo para usuarios con rol de administrador
- Enlace: "Administrar Pedidos" en el menú desplegable
- URL de destino: `/admin-orders.html`

### Página de Administración de Órdenes
- URL: `/admin-orders.html`
- Funcionalidades:
  - Visualización de todos los pedidos
  - Filtrado por estado
  - Búsqueda de pedidos
  - Edición de estado de pedidos
  - Paginación de resultados

## Requisitos de Acceso
1. Usuario debe estar autenticado
2. Usuario debe tener rol de administrador
3. El sistema verifica los permisos antes de permitir el acceso

## Flujo de Navegación Visual

```
                    ┌─────────────────────────────┐
                    │ Inicio de sesión como Admin │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼──────────┐
                    │  Acceder al sitio web │
                    └────────────┬──────────┘
                                 │
                    ┌────────────▼──────────┐
                    │    Menú de usuario    │
                    └───────┬─────────┬─────┘
                            │         │
        ┌───────────────────▼─┐   ┌───▼──────────────────────┐
        │ Panel Administración│   │Administrar Pedidos (directo)│
        └──────────┬──────────┘   └────────────┬─────────────┘
                   │                           │
        ┌──────────▼──────────┐                │
        │ Gestionar Pedidos   │                │
        └──────────┬──────────┘                │
                   │                           │
        ┌──────────▼──────────┐                │
        │ Botón "Ir a Pedidos"│                │
        └──────────┬──────────┘                │
                   │                           │
                   └────────────┬──────────────┘
                                │
                    ┌────────────▼──────────┐
                    │  admin-orders.html    │
                    │(Página de gestión de  │
                    │     pedidos admin)    │
                    └───────────────────────┘
```