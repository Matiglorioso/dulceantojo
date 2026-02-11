# Recomendaciones de expertos: qué poner primero en la home de un ecommerce

Resumen de fuentes (Shopify, Trusted Shops, guías UX ecommerce, Onilab, Invesp) aplicado a Dulce Antojo.

---

## 1. Lo que los expertos recomiendan “above the fold” (primera pantalla)

| Recomendación | Fuente | Qué significa |
|---------------|--------|----------------|
| **Headline + propuesta de valor** | Varios | Que en 2–5 segundos se entienda qué vendés y por qué. Corto y claro. |
| **Un solo CTA principal** | Shopify, Trusted Shops | Un botón o enlace claro: “Comprar”, “Ver catálogo”, “Ver productos”. Evitar varios CTAs que compitan. |
| **Imagen o video hero** | Varios | Foto de producto o estilo de vida que apoye el mensaje. Evitar sliders automáticos; mejor una sola imagen probada. |
| **Descubrimiento de producto pronto** | GoInFlow, Onilab | Mostrar categorías o productos destacados cerca (4–7 categorías o accesos directos al catálogo). |
| **Señales de confianza** | Trusted Shops, Platzi | Envío, plazos, devoluciones, reseñas o contacto visibles si reducen fricción. |
| **Sin saturación** | Shopify | Poca información arriba, bien priorizada. El espacio en blanco ayuda a destacar lo importante. |
| **Navegación y carrito visibles** | Varios | Logo, menú/categorías, carrito y/o contacto accesibles. |

---

## 2. Cómo está hoy Dulce Antojo (primera pantalla)

- **Trust bar:** “Envíos a Córdoba capital · Pedidos con 48 hs de anticipación” → ✅ Señales de confianza.
- **Hero:** “Pastelería artesanal” + “Elegí tu antojo y pedilo por WhatsApp” → ✅ Headline + propuesta de valor.
- **No hay:** CTA principal (botón), imagen hero, ni accesos a categorías en esa primera pantalla.
- **Debajo del scroll:** Faja “¡Pedí tu antojo tartero!” y luego Tartas / Budines.

Conclusión: la base está bien; lo que falta según las buenas prácticas es **un CTA claro**, **opcionalmente una imagen hero** y **acercar un poco el descubrimiento de producto** (categorías o primer contenido).

---

## 3. Adaptaciones que podemos hacer con lo que ya tenemos

### A. Añadir un CTA principal en el hero (prioritario)

- **Qué:** Un solo botón, por ejemplo “Ver tartas y budines”, que haga scroll a `#productos` o `#section-tartas`.
- **Por qué:** Los expertos piden una acción clara above the fold; hoy solo hay texto.
- **Con qué:** Solo HTML + CSS + scroll suave (ya lo tenés en las fajas). Sin nuevos assets.

### B. Reducir espacio vacío y acercar “productos”

- **Qué:** Menos padding inferior del hero y/o bajar un poco la faja (o integrar un enlace tipo “Ver productos” en el hero).
- **Por qué:** Que en la primera pantalla se vea también el inicio del contenido de productos o el CTA que lleva ahí.
- **Con qué:** Ajustes de CSS y, si se quiere, mover el enlace dentro del bloque hero.

### C. Hero con imagen (opcional)

- **Qué:** Usar una imagen existente (ej. `dulceantojo.jpeg` o una foto de tarta/budín) como fondo del hero o al lado del texto.
- **Por qué:** Refuerza la propuesta de valor y hace la primera pantalla más atractiva.
- **Con qué:** La imagen que ya usan en el sitio; solo definir tamaño y posición (CSS).

### D. Accesos rápidos a categorías en el hero (opcional)

- **Qué:** Debajo del CTA, dos enlaces o botones secundarios: “Tartas” y “Budines” (scroll a `#section-tartas` y `#section-budines`).
- **Por qué:** Los expertos recomiendan mostrar categorías o accesos al catálogo pronto.
- **Con qué:** Enlaces + scroll suave; las secciones ya existen.

---

## 4. Orden sugerido de implementación

1. **CTA principal** en el hero (“Ver tartas y budines”) + algo de **menos espacio vacío** (A + B).
2. Si quieren reforzar más: **imagen en el hero** (C).
3. Si quieren aún más descubrimiento arriba: **enlaces Tartas / Budines** en el hero (D).

Así la home queda alineada con las recomendaciones de expertos usando solo lo que ya tienen en el proyecto.
