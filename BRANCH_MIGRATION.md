# Migración de Rama Principal

## Cambio de `master` a `main`

A partir de ahora, estamos utilizando `main` como nuestra rama principal en lugar de `master`. Esta decisión se alinea con las mejores prácticas de la industria y el movimiento para usar una terminología más inclusiva en el desarrollo de software.

## ¿Qué cambia?

1. **Rama principal**: La rama principal del proyecto ahora es `main` en lugar de `master`.
2. **Desarrollo futuro**: Todo el desarrollo nuevo se debe basar en la rama `main`.
3. **Pull requests**: Las nuevas solicitudes de extracción deben dirigirse a la rama `main`.

## ¿Qué debo hacer?

### Si estás clonando el repositorio por primera vez:

```bash
git clone https://github.com/laloaggro/flores.git
cd flores
git checkout main
```

### Si ya tienes el repositorio clonado:

```bash
cd flores
git fetch origin
git checkout main
```

### Si tienes trabajo pendiente en la rama master:

```bash
cd flores
git fetch origin
git checkout main
git merge master
```

## ¿Por qué estamos haciendo este cambio?

1. **Inclusividad**: El uso de `main` en lugar de `master` promueve un entorno más inclusivo.
2. **Consistencia**: Muchas organizaciones y plataformas están adoptando esta convención.
3. **Mejores prácticas**: GitHub y otras plataformas ahora usan `main` como rama predeterminada para nuevos repositorios.

## ¿Tienes preguntas?

Si tienes alguna pregunta sobre esta transición, por favor abre un issue en el repositorio para obtener ayuda.