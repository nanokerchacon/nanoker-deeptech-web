# nanoker-deeptech-web

Sitio corporativo estático de Nanoker con frontend en HTML/CSS/JS vanilla y backend de formularios en Vercel Serverless Functions.

## Arquitectura

- Frontend público en SiteGround:
  `contacto.html`, `evaluacion-tecnica.html`, `js/contacto.js`, `js/evaluacion.js`, `css/contacto.css`, `css/evaluacion.css`
- Backend en Vercel:
  `api/send-contact.js`, `api/send-evaluation.js`, `api/health.js`, `api/_lib/mail.js`
- SMTP saliente:
  Microsoft 365 con una cuenta real de login en `SMTP_USER`
- Destino final de leads:
  `MAIL_TO=web@nanoker.com`

## Variables de entorno en Vercel

Configura exactamente estas variables en el proyecto de Vercel:

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=formularios@nanoker.com
SMTP_PASS=PASSWORD_REAL_O_APP_PASSWORD
MAIL_TO=web@nanoker.com
```

Notas:

- `SMTP_USER` debe ser una cuenta real autenticable en Microsoft 365.
- `MAIL_TO` puede ser un buzón compartido o destinatario de distribución.
- No pongas credenciales en el repo.

## Endpoints

- `GET https://nanoker-deeptech-web.vercel.app/api/health`
- `POST https://nanoker-deeptech-web.vercel.app/api/send-contact`
- `POST https://nanoker-deeptech-web.vercel.app/api/send-evaluation`

`/api/health` devuelve:

```json
{
  "ok": true,
  "smtpHostConfigured": true,
  "smtpUserConfigured": true,
  "mailToConfigured": true
}
```

## CORS permitido

El backend acepta peticiones desde:

- `https://nanoker.com`
- `https://www.nanoker.com`
- `http://localhost:3000`
- `http://127.0.0.1:5500`

También responde correctamente a `OPTIONS`.

## Instalación local

```bash
npm install
```

## Verificaciones recomendadas

```bash
node --check api/send-contact.js
node --check api/send-evaluation.js
node --check api/health.js
node --check api/_lib/mail.js
node --check js/contacto.js
node --check js/evaluacion.js
```

## Despliegue

### Backend Vercel

1. Subir este repositorio a Vercel.
2. Configurar las variables de entorno SMTP.
3. Desplegar.
4. Verificar `https://nanoker-deeptech-web.vercel.app/api/health`.

### Frontend SiteGround

1. Subir `contacto.html`, `evaluacion-tecnica.html`, `js/`, `css/` y assets relacionados.
2. Confirmar que los formularios publican contra `https://nanoker-deeptech-web.vercel.app`.
3. Probar ambos flujos desde producción.

## Comportamiento esperado

- El formulario no se limpia hasta recibir `{"ok": true, "message": "sent"}`.
- Si la API falla, se mantienen los datos introducidos y el botón vuelve a estar activo.
- La evaluación técnica acepta adjuntos `pdf`, `dwg`, `step`, `stp`, `png`, `jpg`, `jpeg` hasta 5 MB totales.
- Los logs útiles quedan solo en backend y no exponen contraseñas.
