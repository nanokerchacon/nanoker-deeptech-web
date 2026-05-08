# nanoker-deeptech-web

Static corporate site plus Node serverless mail endpoints for contact and technical evaluation forms.

## Environment Variables

Set these in your deployment platform:

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=info@nanoker.com
SMTP_PASS=YOUR_SMTP_PASSWORD
MAIL_TO=info@nanoker.com
```

## Deploy Notes

- This implementation is prepared for Node-based serverless deployment such as Vercel Functions.
- The evaluation form supports attachments through `multipart/form-data`.
- Rate limiting is in-memory and best-effort. In serverless environments it reduces abuse but is not globally shared across instances.

## Local Install

```bash
npm install
```
