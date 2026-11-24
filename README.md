# brün cakes · Pedidos online

Página donde tus clientes eligen productos y te mandan el pedido armado directo a tu WhatsApp (351 800 5221).

## Qué tiene
- Catálogo con fotos, igual que el PDF: alfajores, cajas, tortas y tartas, cookies.
- Al tocar un producto se abre una ficha para elegir la presentación (x6, x12…) y la cantidad.
- Carrito con el total, aviso de anticipación (24 h; 48 h si hay tortas) y fecha mínima automática.
- Botón "Enviar pedido por WhatsApp": abre WhatsApp con el pedido escrito.
- Test "¿Qué alfajor Brün sos?", "Cómo pedir" y "Nuestra historia".

## Cómo cambiar cosas (todo en `productos.js`)
- **Agotado:** `disponible: false`. Para volver a ofrecerlo, `disponible: true`.
- **Precio:** cambiá el número en `opciones` (sin puntos ni `$`).
- **Empezar a vender individuales:** en el producto, cambiá `unidad: null` por el precio, por ejemplo `unidad: 2300`.
- **Producto nuevo:** copiá uno parecido, cambiale el `id` (único), nombre, descripción, foto y precios.
- **Fotos:** van en la carpeta `img/`.
- **Tipografía GoodDog:** subí `GoodDog.otf` a la carpeta `fonts/`.
