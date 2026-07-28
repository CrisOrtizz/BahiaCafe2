# Panel Administrativo — Bahía Café

Panel interno de ventas en `/admin`. Invisible para clientes.

## Variables de entorno

Configurar en Vercel (Settings → Environment Variables) y en `.env.local` para local:

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...   # Settings → API → service_role (secret)
ADMIN_PASSWORD=elige-una-clave-segura
```

## Paquete a instalar

```bash
pnpm add @supabase/supabase-js server-only
```

## Configurar Supabase

1. Crear proyecto en supabase.com (plan gratuito)
2. Ir a **SQL Editor** y pegar el contenido completo de `schema.sql`
3. Ejecutar — crea tablas, vistas, funciones, RLS y datos de ejemplo
4. Copiar `Project URL` y `service_role key` desde **Settings → API**

## Probar en local

```bash
# 1. Crea el archivo de variables
cp .env.local.example .env.local   # o créalo manualmente con las 3 vars

# 2. Instala dependencias
pnpm install

# 3. Levanta el servidor
pnpm dev

# 4. Abre http://localhost:3000/login
```

## Flujo normal de uso

- `/login` — ingresar contraseña → redirige a `/admin`
- `/admin` — dashboard: ventas del día/mes, top productos, stock bajo, últimas ventas
- `/admin/nueva-venta` — formulario: cliente + carrito multi-producto + método de pago → guardar en < 30 s
- El botón **Salir** borra la cookie de sesión

## Notas de seguridad

- La cookie de sesión es `httpOnly + secure + sameSite=lax` — no accesible desde JS del navegador
- El token en la cookie es un HMAC-SHA256 derivado de `ADMIN_PASSWORD`. Si cambias la contraseña, todas las sesiones activas quedan inválidas
- Row Level Security está habilitado en todas las tablas sin políticas públicas: desde el navegador es imposible leer o escribir datos
- La `service_role key` solo existe en el servidor Next.js; nunca llega al cliente
