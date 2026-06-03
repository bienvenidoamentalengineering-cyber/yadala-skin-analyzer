# HighLevel — Flujo 2: Onboarding de centros nuevos

## Trigger
Oportunidad pasa a etapa **"Cliente activo"** en el pipeline B2B.

## Objetivo
Formar al profesional para que aplique, venda y repita.
Un centro que sabe usar Yadala bien → cliente recurrente.

---

## Secuencia de formación (4 semanas)

### SEMANA 1 — Módulo 1: Ciencia de Yadala
**Email:**

**Asunto:** Tu formación Yadala empieza hoy — Módulo 1

```
Hola [nombre],

Bienvenida al ecosistema Yadala.

Esta semana: la ciencia detrás de lo que aplicas.
Por qué funciona. Qué ocurre en la piel durante los 55 minutos.
Y cómo explicárselo a tu clienta sin perder credibilidad.

[MÓDULO 1 — Ciencia y fisiología: 6 min]

Incluye:
— Bioestimulación y fibroblastos
— Por qué se producen las contracciones
— Diferencia con radiofrecuencia y otras técnicas

Cualquier duda, responde a este email.
```

---

### SEMANA 2 — Módulo 2: Protocolo de cabina
**Email:**

**Asunto:** Módulo 2 — Cómo aplicar Yadala paso a paso

```
Hola [nombre],

Esta semana: el protocolo completo.
Desde la preparación de la piel hasta el cierre de la sesión.

[MÓDULO 2 — Protocolo de aplicación: 8 min]

Incluye:
— Las 7 fases de la sesión
— Tiempo exacto en cada zona
— Qué decir mientras aplicas (guía de conversación)
— Cómo gestionar las reacciones (contracciones, calor)
```

---

### SEMANA 3 — Módulo 3: Las 3 voces / cómo vender a tu clienta
**Email:**

**Asunto:** Módulo 3 — Cómo hablar de Yadala según cada clienta

```
Hola [nombre],

Este módulo cambia cómo vendes.

No todas tus clientas necesitan escuchar lo mismo.
Yadala tiene 3 experiencias distintas según el momento vital:

— PREVENT: piel que necesita despertar (20-35 años)
— RECOVER: piel que quiere volver a ser ella (35-50 años)
— RECLAIM: piel que quiere sostenerse con fuerza (50+)

[MÓDULO 3 — Las 3 voces de tu piel: 7 min]

Incluye guion de conversación para cada perfil.
```

---

### SEMANA 4 — Módulo 4: Argumentario vs competencia
**Email:**

**Asunto:** Módulo 4 — Qué decir cuando te preguntan "¿y esto para qué?"

```
Hola [nombre],

Última semana de formación.

Las preguntas que más te harán tus clientas:
— ¿Es como el bótox?
— ¿Y la radiofrecuencia no hace lo mismo?
— ¿Cuántas sesiones necesito?

[MÓDULO 4 — Argumentario completo: 5 min]

Al terminar este módulo tienes todo lo que necesitas
para vender Yadala con confianza y coherencia.

¡Enhorabuena por completar la formación! 🌿
```

---

## Post-formación: seguimiento mensual

**Día 35** — Email de seguimiento:
> ¿Cómo van tus primeras sesiones? ¿Alguna duda sobre la aplicación?
> Cuéntame — me interesa saber qué está pasando en tu cabina.

**Día 60** — Si no hay segundo pedido → activa Flujo 3 (reactivación)

---

---

# HighLevel — Flujo 3: Reactivación de centros inactivos

## Trigger
Smart list: centros con tag `cliente-activo` sin nuevo pedido en **60 días**.

## Objetivo
Recuperar el vínculo antes de que el centro abandone.
No vender. Reconectar.

---

## Secuencia

### DÍA 1 — Email con vídeo personalizado HeyGen

**Asunto:** [Nombre del centro], ¿cómo está yendo Yadala?

```
Hola [nombre],

Hace un tiempo que no sabemos cómo estás usando Yadala.

Grabé este mensaje para ti.
[VER VÍDEO PERSONALIZADO — 45 segundos]

Si algo no está funcionando como esperabas,
cuéntamelo. Lo resolvemos.

Y si simplemente se te fue el tiempo,
aquí tienes acceso directo a tu próximo pedido:
[PEDIR AHORA — acceso rápido]
```

**Nota técnica:** El vídeo HeyGen incluye la variable `{{contact.company_name}}` en el guion. Make.com dispara la generación del vídeo personalizado y HL envía el email cuando el render está listo.

---

### DÍA 4 — WhatsApp (si no abrió el email)

```
Hola [nombre] 🌿

Te escribo desde Yadala.
Hace un tiempo que no pediste y quería saber
cómo están respondiendo tus clientas.

¿Todo bien por allí?
```

---

### DÍA 8 — Email de recurso gratuito

**Asunto:** Algo nuevo para tu cabina (sin coste)

```
Hola [nombre],

Para que Yadala funcione mejor en tu centro,
preparé una guía rápida de conversación para cada perfil de clienta.

[DESCARGAR GUÍA DE LAS 3 VOCES — PDF]

Sin compromiso. Es tuya.

Y si quieres reponer existencias,
estás a un clic:
[PEDIR YADALA]
```

---

### DÍA 15 — Último intento

**Asunto:** ¿Seguimos juntas?

```
Hola [nombre],

Sé que el tiempo vuela y las prioridades cambian.

Si Yadala ya no encaja en tu centro,
me gustaría saberlo para poder ayudarte mejor
o simplemente entender qué pasó.

¿Tienes 2 minutos para contarme?

[SÍ, QUIERO SEGUIR]
[PREFIERO NO CONTINUAR]
```

**Si hace clic en "Prefiero no continuar":**
- Tag: `baja-voluntaria`
- Salida del flujo
- Email de cierre elegante con puerta abierta

**Si no responde a nada:**
- Tag: `inactivo-60d`
- Sale del flujo activo
- Entra en campaña trimestral de reactivación suave

---

## KPIs a monitorizar en HighLevel

| Métrica | Objetivo |
|---------|----------|
| Tasa apertura emails onboarding | > 55% |
| Completación módulos formación | > 70% |
| Tiempo medio hasta 2º pedido | < 45 días |
| Tasa reactivación flujo 3 | > 25% |
| Tasa baja voluntaria | < 10% |
