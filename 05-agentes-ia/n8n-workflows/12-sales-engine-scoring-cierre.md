# YADALA SALES ENGINE — SCORING + CIERRE AUTOMÁTICO
**Archivo:** `05-agentes-ia/n8n-workflows/12-sales-engine-scoring-cierre.md`
**Versión:** 1.0 · Abril 2026

## Filosofía

No persigues la venta.
Creas el momento en el que la persona está lista.

```
Entender → Clasificar → Adaptar → Empujar cuando toca → Cerrar sin presión
```

---

## PARTE 1 — SQL: LEAD SCORING

```sql
-- Tabla de scoring
CREATE TABLE lead_scoring (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  user_id           TEXT UNIQUE NOT NULL,
  score             INT DEFAULT 0,
  temperature       TEXT DEFAULT 'cold'
                    CHECK (temperature IN ('cold','warm','hot')),
  intent            TEXT,
  line              TEXT CHECK (line IN ('Prevent','Recover','Reclaim')),
  tags              TEXT[],
  last_interaction  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE lead_scoring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gestión scoring"
  ON lead_scoring FOR ALL TO anon
  USING (true) WITH CHECK (true);

-- Índices
CREATE INDEX idx_scoring_temp ON lead_scoring(temperature);
CREATE INDEX idx_scoring_line ON lead_scoring(line);
CREATE INDEX idx_scoring_tags ON lead_scoring USING GIN(tags);
```

---

## PARTE 2 — TABLA DE PUNTUACIÓN

### Comportamientos que suman puntos

| Señal | Puntos | Tipo |
|-------|--------|------|
| Pregunta precio | +3 | 🔥 hot |
| Dice "lo necesito" / "quiero probarlo" | +3 | 🔥 hot |
| Pregunta resultados / tiempo | +2 | 🔥 hot |
| Responde rápido + emocionalmente | +2 | 🔥 hot |
| Emoción = frustración alta | +2 | 🌡️ warm |
| Describe su problema en detalle | +2 | 🌡️ warm |
| Pregunta cómo se usa | +2 | 🌡️ warm |
| Muestra interés general | +1 | 🌡️ warm |
| Preguntas genéricas | +0 | 🧊 cold |
| Solo está mirando | +0 | 🧊 cold |

### Clasificación final

| Score | Temperatura | Acción |
|-------|-------------|--------|
| 0–3 | 🧊 Cold | Conectar, no vender |
| 4–7 | 🌡️ Warm | Educar + empujar suave |
| 8–12 | 🔥 Hot | Cierre directo |

---

## PARTE 3 — NODOS N8N

### Nodo 1 — Scoring Calculator
**Tipo:** Code Node (JavaScript)

```javascript
// Input: mensaje del usuario + datos del intent classifier
const message = $json.message.toLowerCase();
const emotion = $json.emotion || '';
const intent = $json.intent || '';
const previousScore = $json.previous_score || 0;

let score = 0;

// Señales de compra directa (+3)
if (message.includes('precio') || message.includes('cuánto cuesta') ||
    message.includes('cuanto vale')) score += 3;
if (message.includes('lo necesito') || message.includes('quiero probarlo') ||
    message.includes('quiero comprarlo')) score += 3;

// Señales de interés fuerte (+2)
if (message.includes('funciona') || message.includes('resultado') ||
    message.includes('cuánto tiempo')) score += 2;
if (emotion === 'frustración alta' || emotion === 'frustración') score += 2;
if (message.includes('he probado') || message.includes('nada funciona')) score += 2;

// Señales de interés medio (+1)
if (message.includes('cómo se usa') || message.includes('cómo funciona')) score += 1;
if (message.includes('quiero saber') || message.includes('cuéntame')) score += 1;

// Score acumulado con sesiones anteriores
const totalScore = previousScore + score;

// Clasificación
let temperature = 'cold';
if (totalScore >= 8) temperature = 'hot';
else if (totalScore >= 4) temperature = 'warm';

return [{
  json: {
    ...$json,
    score: totalScore,
    temperature,
    score_this_message: score
  }
}];
```

---

### Nodo 2 — Temperature Router
**Tipo:** Switch Node

```
IF temperature === 'hot'  → rama CIERRE
IF temperature === 'warm' → rama EDUCACIÓN
IF temperature === 'cold' → rama CONVERSACIÓN
```

---

### Nodo 3 — Guardar scoring en Supabase

```
POST /rest/v1/lead_scoring
Header: Prefer: resolution=merge-duplicates
Body:
{
  "user_id": "{{user_id}}",
  "score": {{score}},
  "temperature": "{{temperature}}",
  "intent": "{{intent}}",
  "line": "{{line}}",
  "tags": {{tags}},
  "updated_at": "{{now}}",
  "last_interaction": "{{now}}"
}
```

---

## PARTE 4 — PROMPTS DE CIERRE POR TEMPERATURA

### 🔥 LEAD HOT — Prompt de cierre directo

```
Actúa como la voz de Yadala.

Este lead está CALIENTE. Ha mostrado señales claras de querer comprar.

Datos:
- Problema: {{technical_concept}}
- Traducción: {{yadala_translation}}
- Sensorialidad: {{sensoriality}}
- Línea: {{line}}
- Lo que dijo: {{user_message}}

OBJETIVO: cierre suave pero directo.

ESTRUCTURA:
1. Validar su problema (1 frase)
2. Nombrar la solución (Yadala + su línea)
3. Sensorialidad (lo que va a notar)
4. Micro-cierre (nunca agresivo)

MICRO-CIERRES PERMITIDOS:
"¿Te encajaría esto?"
"¿Quieres que te explique cómo usarlo en tu caso?"
"¿Te paso cómo sería para ti?"

NUNCA digas: "Compra aquí" / "Oferta" / "Descuento"

Frases cortas. Saltos de línea. Máximo 6 líneas.
```

**Ejemplo de output:**
```
Tiene sentido lo que dices.
Tu piel ya no está respondiendo como antes…
y eso es justo lo que trabaja Yadala Recover.

Notas la piel más firme, más despierta,
desde las primeras aplicaciones.

¿Te explico exactamente cómo usarlo en tu caso?
```

---

### 🌡️ LEAD WARM — Prompt de educación + empuje

```
Actúa como la voz de Yadala.

Este lead está TEMPLADO. Está interesado pero necesita más contexto.

Datos:
- Problema: {{technical_concept}}
- Traducción: {{yadala_translation}}
- Deseo visible: {{desire_level_1}}
- Sensorialidad: {{sensoriality}}
- Lo que dijo: {{user_message}}

OBJETIVO: educar, mostrar posibilidad, empuje suave al final.

ESTRUCTURA:
1. Validar su experiencia
2. Explicar por qué ocurre (sin tecnicismos)
3. Mostrar que hay solución
4. Invitar a saber más (no a comprar)

Frases cortas. Natural. Sin presión.
```

**Ejemplo de output:**
```
Lo que notas es muy común.

La piel empieza a cambiar…
pero aún responde muy bien cuando la activas.

No es falta de producto.
Es que nunca ha recibido el estímulo correcto.

Si quieres, te cuento cómo funcionaría en tu caso.
```

---

### 🧊 LEAD COLD — Prompt de conexión (no vender)

```
Actúa como la voz de Yadala.

Este lead está FRÍO. Solo está explorando.

OBJETIVO: generar conexión, hacer que se sienta comprendida.
NO menciones Yadala. NO vendas nada.

ESTRUCTURA:
1. Validar lo que siente
2. Hacer una pregunta que profundice
3. Dejar espacio

Una sola pregunta al final. Nunca más de una.
Máximo 4 líneas.
```

**Ejemplo de output:**
```
Tiene sentido lo que dices.
Muchas veces no es falta de producto…
es el ritmo que llevamos.

¿Qué es lo que más notas en tu piel últimamente?
```

---

## PARTE 5 — FLUJO COMPLETO INTEGRADO CON QUIZ

```
Instagram / TikTok / Ads
        ↓
    Quiz Yadala
  (5 preguntas web)
        ↓
  Supabase: guardar
  - línea asignada
  - problema principal
  - score inicial (3 puntos por completar quiz)
        ↓
  Redirección a WhatsApp
  con parámetros pre-cargados
        ↓
  Mensaje automático personalizado
  (ya sabe su línea antes de escribir)
        ↓
  Agente responde con contexto
```

### Mensaje automático post-quiz (WhatsApp)

```
He visto tus respuestas 👀

Tu piel ahora mismo necesita activarse,
no más productos.

Estás en un punto muy bueno para recuperarla rápido.

Si quieres, te explico cómo hacerlo paso a paso.
```

### URL de redirección a WhatsApp con contexto

```javascript
// En el quiz, al capturar el email, también redirige a WhatsApp
const line = currentLinea; // PREVENT / RECOVER / RECLAIM
const waMessage = encodeURIComponent(
  `Hola, acabo de hacer el quiz de Yadala. Mi línea es ${line}.`
);
const waURL = `https://wa.me/34644799223?text=${waMessage}`;
```

---

## PARTE 6 — MICRO-CIERRES (REDUCEN FRICCIÓN)

### Los 6 micro-cierres de Yadala

```
"¿Te encajaría esto?"
"¿Quieres que te explique cómo usarlo en tu caso?"
"¿Te paso cómo sería para ti?"
"¿Quieres que te cuente cómo funciona exactamente?"
"¿Lo vemos juntos?"
"¿Te interesa que te explique el protocolo?"
```

### Cuándo usar cada uno

| Temperatura | Micro-cierre recomendado |
|-------------|-------------------------|
| Hot | "¿Te paso cómo conseguirlo?" |
| Hot | "¿Te encajaría esto?" |
| Warm | "¿Quieres que te explique cómo usarlo en tu caso?" |
| Warm | "¿Lo vemos juntos?" |
| Cold | (no usar micro-cierre, solo pregunta abierta) |

---

## PARTE 7 — WORKFLOW N8N COMPLETO

```
[Webhook] mensaje usuario
    ↓
[Code] Normalizar texto
    ↓
[HTTP] Claude API → Intent Classifier
    ↓
[HTTP] Supabase → customer_language_inputs (match intent)
    ↓
[HTTP] Supabase → skin_insights (match tags)
    ↓
[HTTP] Supabase → lead_scoring (recuperar score anterior)
    ↓
[Code] Scoring Calculator (calcular nuevo score)
    ↓
[HTTP] Supabase → guardar nuevo score
    ↓
[Switch] temperature router
    ├── HOT  → [HTTP] Claude API (prompt cierre)
    ├── WARM → [HTTP] Claude API (prompt educación)
    └── COLD → [HTTP] Claude API (prompt conexión)
    ↓
[HTTP] Supabase → actualizar agent_memory
    ↓
[HTTP] WhatsApp API → enviar respuesta
```

---

## Resumen del sistema completo

```
Entiende al cliente     → customer_language_inputs + skin_insights
Lo clasifica            → lead_scoring (cold/warm/hot)
Adapta el discurso      → 3 prompts diferentes por temperatura
Empuja cuando toca      → solo con leads warm y hot
Cierra sin presión      → micro-cierres + sensorialidad
Recuerda todo           → agent_memory
Mejora con el tiempo    → frequency en customer_language_inputs
```

---

Versión: 1.0 · Abril 2026 · YADALA Sales Engine · Pedro Jordà
