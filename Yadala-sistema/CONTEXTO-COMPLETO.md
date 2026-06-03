# CONTEXTO COMPLETO — Decisiones tomadas
**Chat:** yadala-sistema · **Fecha:** Mayo 2026
**Resumen de todo lo construido y decidido en esta sesión de trabajo**

---

## 1. POSICIONAMIENTO DE MARCA CON IA

### El error a evitar
NO asignar arquetipos por estética superficial:
- ❌ "rubia ojos azules = Prevent"
- ❌ "morena ojos verdes = Recover"

Yadala no va de estética. Va de **estado interno de la piel.**

### El enfoque correcto: Personas = Estados de Consciencia
Los avatares no son modelos. Son **guías de experiencia.**

---

## 2. LAS 3 VOCES DE TU PIEL

### 🌿 PREVENT — "La que despierta"
- **Energía:** ligera, fresca, curiosa
- **Lenguaje:** cercano, sin presión
- **Rol:** hacer consciente lo invisible
- **Identidad que construye:** "Soy alguien que se adelanta"
- **Velocidad HeyGen:** 1.05x
- **Modelo elegida:** morena, ojos claros, 25-30 años, luz natural lateral, sin maquillaje, pelo suelto, mirada hacia arriba — como quien está descubriendo algo
- **Copy:** "No necesitaba más. Necesitaba despertar."
- **Keywords:** Activa · Prevé · Potencia

### 🔥 RECOVER — "La que te devuelve a ti"
- **Energía:** segura, elegante, directa
- **Lenguaje:** claridad + autoridad suave
- **Rol:** reconectar con lo que ya eras
- **Identidad que construye:** "Soy alguien que puede recuperarse"
- **Velocidad HeyGen:** 1.0x
- **Modelo elegida:** rubia, ojos azules (la imagen original del storytelling)
- **Copy:** "No cambió mi cara. Volví a ella."
- **Keywords:** Redefine · Reactiva · Revive

### 🌑 RECLAIM — "La que honra y eleva"
- **Energía:** profunda, pausada, poderosa
- **Lenguaje:** menos palabras, más significado
- **Rol:** resignificar la edad y la belleza
- **Identidad que construye:** "Soy alguien que se reconstruye con intención"
- **Velocidad HeyGen:** 0.92x
- **Modelo elegida:** pelo plateado natural, arrugas reales visibles, mirada directa a cámara, rasgos fuertes — "esta mujer sabe quién es"
- **Copy:** "Mi piel no necesita ser joven. Necesita estar viva."
- **Keywords:** Reafirma · Ilumina · Inspira

---

## 3. CONCEPTO "VOCES DE TU PIEL"

**Naming clave:** No llamarlo "agentes". Llamarlo **"Voces de tu piel"**

Cada avatar es:
- No una persona
- Sino una forma en la que la piel se expresa

Conecta con la filosofía: *"Yadala no lucha contra el tiempo. Activa lo mejor de tu piel."*

---

## 4. ARQUITECTURA DEL SISTEMA IA

### El flujo completo
```
Usuario hace quiz "¿Qué necesita tu piel hoy?"
        ↓
Resultado → PREVENT / RECOVER / RECLAIM
        ↓
HighLevel segmenta y activa pipeline correspondiente
        ↓
Recibe vídeo personalizado HeyGen de su voz
        ↓
Conversación automatizada coherente con su línea
        ↓
Sensación: "esto está hecho para mí"
```

### Multi-agente conversacional (Nivel Dios)
Mismo mensaje de entrada → 3 respuestas distintas por voz:

**Usuario escribe:** "No sé qué le pasa a mi piel"
- **PREVENT responde:** "¿Te notas apagada últimamente?"
- **RECOVER responde:** "¿Sientes que tu piel ya no responde igual?"
- **RECLAIM responde:** "¿Sientes que ha perdido fuerza?"

---

## 5. EL QUIZ — ESTADO ACTUAL

### Versión final (la buena)
- **7 preguntas** con sistema de scoring por línea
- Detección de `leadHot` y `leadFrustrada`
- Preguntas poéticas tipo: *"Si tu piel pudiera hablarte, ¿qué te diría?"*
- Conexión a Supabase para guardar leads
- Prompt con Voice Maestro + modelo CIRCA integrado
- Email automático personalizado por línea
- Resultado generado con Claude en tiempo real
- Proxy: `yadala-proxy.bienvenidoamentalengineering.workers.dev`
- Supabase: `qbvltetexymyrvscbbai.supabase.co`

### Lo que detecta el quiz además de la línea
- **leadHot:** intención de compra alta → activa pipeline prioritario en HL
- **leadFrustrada:** ha probado todo sin resultado → necesita regulación CIRCA primero

---

## 6. HEYGEN — CONFIGURACIÓN POR VOZ

### Setup técnico
- **Plan recomendado:** Creator (29$/mes)
- **Voz base:** Español España — Lucía o Valentina

### Por línea
| Línea | Velocidad | Energía avatar | Fondo |
|-------|-----------|---------------|-------|
| PREVENT | 1.05x | Luz natural, fresca | Neutro cálido |
| RECOVER | 1.0x | Elegante, estructurada | Elegante neutro |
| RECLAIM | 0.92x | Pausada, poderosa | Oscuro profundo |

### Los vídeos a crear (por orden de prioridad)
1. Vídeo captación B2B RECOVER — 90 segundos (primero)
2. Vídeo captación B2B PREVENT
3. Vídeo captación B2B RECLAIM
4. Módulo 1: Ciencia de Yadala (formación centros)
5. Módulo 2: Protocolo de aplicación
6. Módulo 3: Las 3 voces — cómo hablar con cada clienta
7. Módulo 4: Argumentario vs competencia

---

## 7. HIGHLEVEL — FLUJOS CONFIGURADOS

### Pipeline B2B
```
Lead → Contactado → Interesado → Demo enviada → Onboarding → Cliente activo
```

### Flujo 1 — Captación B2B
- Trigger: descarga dossier
- D0: email bienvenida + vídeo HeyGen
- D2: protocolo + rentabilidad
- D4: módulo formación 1
- D7: CTA llamada
- Si no abre emails → WhatsApp automático

### Flujo 2 — Onboarding centros nuevos
- Trigger: pasa a "Cliente activo"
- 4 módulos semanales de formación en vídeo

### Flujo 3 — Reactivación inactivos
- Trigger: sin pedido en 60 días
- Vídeo personalizado con nombre del centro
- WhatsApp D4 si no abre email
- Último intento D15

---

## 8. STACK TECNOLÓGICO

| Herramienta | Función | Precio |
|-------------|---------|--------|
| HeyGen | Avatares + vídeos | 29$/mes |
| GoHighLevel | CRM + flujos + WhatsApp | 97$/mes |
| Make.com | Webhook HeyGen ↔ GHL | gratis/9$ |
| Gamma.app | PDF → presentación | gratis/15$ |
| Supabase | Base de datos quiz | ya activo |
| Resend/Mailgun | Envío emails | ya activo |

---

## 9. PALABRAS PROHIBIDAS POR LÍNEA

### PREVENT
❌ antiedad · arrugas · prevenir el envejecimiento · tratamiento · corrección

### RECOVER
❌ rejuvenecer · parecer más joven · borrar años · lifting · antiedad agresivo

### RECLAIM
❌ parecer más joven · rejuvenecer · antiedad · combatir el tiempo · borrar arrugas · lifting · corrección

---

## 10. FRASES FIRMA POR LÍNEA

### PREVENT
- "Activa hoy lo que tu piel agradecerá mañana"
- "Puede que tu piel no tenga arrugas… pero ya te está hablando"
- "No necesitas más productos. Necesitas activación."

### RECOVER
- "No cambió mi cara. Volví a ella."
- "Tu piel no está perdida. Está esperando que la reactives."
- "No necesitas agujas. Necesitas reactivar lo que tu piel ya tiene."

### RECLAIM
- "Mi piel no necesita ser joven. Necesita estar viva."
- "No quiero parecer otra. Quiero verme como yo."
- "Tu piel tiene historia. Merece estructura."

---

## 11. PRÓXIMOS PASOS (en orden)

1. ✅ Quiz funcionando con scoring y flujo
2. ✅ Imágenes de las 3 voces elegidas
3. ⬜ Crear cuenta HeyGen y los 3 avatares
4. ⬜ Grabar primer vídeo captación B2B (RECOVER, 90 seg)
5. ⬜ Configurar HighLevel con pipelines y flujos
6. ⬜ Conectar HeyGen ↔ HighLevel vía Make.com
7. ⬜ Grabar módulos de formación (4 módulos)
8. ⬜ Activar flujo completo con primer centro real

---

## 12. FILOSOFÍA QUE LO GUÍA TODO

> "No será mágico por la tecnología.
> Será mágico por la coherencia emocional."

> "No estamos guiando el comportamiento directamente.
> Estamos influyendo en la identidad percibida.
> Y eso, bien hecho, es mucho más potente."

> "No parecerá automatización.
> Parecerá que la marca te entiende."

---

*Documento generado desde el chat yadala-sistema · Mayo 2026 · Para uso en yadala-project*
