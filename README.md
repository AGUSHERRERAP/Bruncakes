# Bruncakes · Pedidos online

Página web donde los clientes eligen productos y te mandan el pedido armado directo a tu WhatsApp.

## Cómo cambiar productos, precios y disponibilidad

Todo se edita en **`productos.js`**. Lo podés hacer desde el celular en GitHub (abrí el archivo → ícono del lápiz → "Commit changes"):

- **Tu número:** cambiá `whatsapp` (formato `549` + código de área + número, sin espacios).
- **Marcar algo como agotado:** poné `disponible: false`. Para volver a ofrecerlo, `disponible: true`.
- **Cambiar precio:** modificá `precio` (sin puntos ni `$`).
- **Agregar producto:** copiá una línea `{ id: ..., nombre: ..., ... }` y cambiale los datos (el `id` tiene que ser único).
- **Foto:** agregá `imagen: "img/nombre.jpg"` y subí la foto a la carpeta `img/`.

## Cómo funciona el pedido

El cliente elige productos → completa nombre, entrega, fecha y pago → toca "Enviar pedido por WhatsApp" → se abre WhatsApp con el mensaje listo para enviarte.
