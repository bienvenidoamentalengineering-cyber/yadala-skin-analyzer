# HighLevel — Flujo 1: Captación de centros B2B

## Trigger
Formulario de descarga del dossier profesional completado.

## Pipeline de entrada
**"Centros B2B"** → etapa inicial: **"Lead"**

---

## Configuración del formulario

**Campos:**
- Nombre completo
- Email profesional
- Nombre del centro / spa
- Ciudad
- Tipo de centro (spa / estética / wellness / hotel)

**Página de gracias:**
> "Tu dossier está en camino. En los próximos minutos recibirás el acceso completo y un vídeo de bienvenida de Yadala."

---

## Secuencia automática

### DÍA 0 — Inmediato tras descarga
**Email:** Bienvenida + vídeo HeyGen (90 seg captación)

**Asunto:** [Nombre del centro], tu acceso al dossier Yadala está listo

```
Hola [nombre],

Gracias por tu interés en Yadala.

Antes de que abras el dossier, quiero que veas algo.
Un minuto y medio que resume por qué esto es diferente.

[REPRODUCIR VÍDEO — Yadala para profesionales]

Debajo del vídeo encontrarás el enlace al dossier completo.

Un abrazo,
Yadala
```

**Tags a aplicar:** `lead-b2b`, `descargo-dossier`, `fecha-descarga`

---

### DÍA 2 — Follow-up
**Email:** Protocolo + rentabilidad

**Asunto:** ¿Cómo funciona Yadala en cabina? (y cuánto deja por sesión)

```
Hola [nombre],

Una aplicación Yadala en cabina:
— Duración: 55 minutos
— Coste por aplicación: 9-12€ (precio profesional)
— PVP recomendado por sesión: 45-60€
— Margen por aplicación: 70-80%

Cuatro aplicaciones por tarro.
Un tarro = 180-240€ de margen.

[VER EL PROTOCOLO COMPLETO — vídeo 3 min]

Si tienes preguntas, responde a este email.
Las respondo personalmente.
```

---

### DÍA 4 — Módulo de formación 1
**Email:** Ciencia + diferenciación

**Asunto:** Por qué Yadala produce contracciones (y qué significa eso para tu cliente)

```
Hola [nombre],

La primera vez que aplicas Yadala a una clienta,
ella siente algo inesperado:
contracciones musculares suaves en la zona labial y cigomática.

No es un efecto secundario.
Es el efecto principal.

[MÓDULO 1 — Ciencia de Yadala: vídeo 6 min]

Entender esto te permite explicarlo con confianza.
Y cuando tú lo entiendes, tu clienta confía.
```

---

### DÍA 7 — CTA llamada / demo
**Email:** Invitación a sesión de onboarding

**Asunto:** ¿Hablamos 20 minutos esta semana?

```
Hola [nombre],

Llevas unos días con el dossier y los vídeos.

Si Yadala tiene sentido para tu centro,
el siguiente paso es simple:
una llamada de 20 minutos donde te cuento
cómo funciona el pedido, la formación y el soporte.

Sin compromiso. Sin presión.

[RESERVAR MI ESPACIO — agenda directa]

Si prefieres hacer el primer pedido directamente,
también puedes hacerlo aquí:
[PEDIR AHORA]
```

---

### Si NO abre ningún email en 7 días → WhatsApp
**Mensaje WhatsApp:**
> Hola [nombre], soy Yadala 🌿
> Hace unos días descargaste nuestro dossier y quería asegurarme de que llegó bien.
> ¿Tuviste oportunidad de verlo?
> Si tienes cualquier duda te respondo ahora mismo.

---

## Etapas del pipeline

| Etapa | Criterio de avance |
|-------|-------------------|
| Lead | Formulario completado |
| Contactado | Abrió al menos 1 email |
| Interesado | Hizo clic en algún CTA |
| Demo enviada | Tuvo llamada o vio módulo completo |
| Onboarding | Realizó primer pedido |
| Cliente activo | Segundo pedido confirmado |

---

## Tags clave

- `lead-b2b` — lead profesional
- `tipo-spa` / `tipo-estetica` / `tipo-hotel` — segmentación por tipo
- `vio-video-captacion` — tracking HeyGen
- `descargo-dossier` — descarga confirmada
- `llamada-agendada` — CTA conversión
- `cliente-activo` — trigger para flujo onboarding
