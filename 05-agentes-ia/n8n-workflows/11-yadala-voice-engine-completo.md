# YADALA VOICE ENGINE — SISTEMA COMPLETO
**Archivo:** `05-agentes-ia/n8n-workflows/yadala-voice-engine.md`
**Versión:** 1.0 · Abril 2026

## Lo que has creado

No es un chatbot.
Es un sistema que escucha como cliente…
piensa como experto…
y responde como marca.

```
Input cliente → Intención → Biología → Emoción → Venta
```

---

## ARQUITECTURA COMPLETA

```
Webhook (WhatsApp / IG / Web)
        ↓
  Normalizar texto
        ↓
  AI Intent Classifier
        ↓
  Supabase: customer_language_inputs
        ↓
  Supabase: skin_insights
        ↓
  AI Response Generator (Yadala Voice)
        ↓
  Guardar memoria del usuario
        ↓
  Enviar respuesta
```

---

## PARTE 1 — SQL SUPABASE

Ejecutar en SQL Editor de Supabase:

```sql
-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SKIN INSIGHTS
CREATE TABLE skin_insights (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line                TEXT,
  age_group           TEXT,
  technical_concept   TEXT,
  yadala_translation  TEXT,
  desire_level_1      TEXT,
  desire_level_2      TEXT,
  sensoriality        TEXT,
  priority            INT,
  tags                TEXT[]
);

-- 2. CUSTOMER LANGUAGE INPUTS
CREATE TABLE customer_language_inputs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  input_text          TEXT,
  normalized_intent   TEXT,
  linked_tags         TEXT[],
  emotion             TEXT,
  line_hint           TEXT,
  frequency           INT DEFAULT 1
);

-- 3. VOICE FRAGMENTS
CREATE TABLE voice_fragments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT,
  content     TEXT,
  intensity   INT,
  tags        TEXT[],
  line        TEXT
);

-- 4. COMPETITOR TRANSLATION
CREATE TABLE competitor_translation (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_claim      TEXT,
  technical_meaning     TEXT,
  yadala_translation    TEXT,
  emotional_translation TEXT,
  tags                  TEXT[]
);

-- 5. MEMORIA DE USUARIO (para seguimiento)
CREATE TABLE agent_memory (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  user_id             TEXT UNIQUE NOT NULL,
  last_intent         TEXT,
  skin_line           TEXT,
  conversation_stage  TEXT DEFAULT 'awareness',
  -- awareness → interest → consideration → decision → customer
  pain_primary        TEXT,
  intent_level        TEXT,
  last_message        TEXT,
  messages_count      INT DEFAULT 1,
  email               TEXT,
  notas               TEXT
);

-- INSERTS MÍNIMOS VIABLES — skin_insights
INSERT INTO skin_insights (
  line, age_group, technical_concept, yadala_translation,
  desire_level_1, desire_level_2, sensoriality, priority, tags
) VALUES
(
  'Prevent', '20-30',
  'estrés oxidativo y desregulación del manto hidrolipídico',
  'Tu piel se apaga cuando tu ritmo se desordena',
  'Quiero tener buena cara sin maquillaje',
  'Quiero sentir que tengo control sobre mí',
  'Cara más fresca, como recién despertada',
  5, ARRAY['glow','fatiga','estrés','apagada']
),
(
  'Prevent', '20-30',
  'baja microcirculación',
  'Tu cara pierde vida cuando no circula bien',
  'Quiero glow natural',
  'Quiero sentirme más viva',
  'Rostro con luz propia',
  5, ARRAY['glow','circulación','luminosidad','apagada']
),
(
  'Recover', '30-45',
  'disminución de colágeno y elastina',
  'Tu piel ya no responde como antes',
  'Quiero firmeza',
  'Quiero sentir que aún estoy a tiempo',
  'Piel más densa, más llena',
  5, ARRAY['firmeza','colágeno','edad','respuesta']
),
(
  'Recover', '30-45',
  'pérdida de tono muscular facial',
  'Tu rostro pierde fuerza',
  'Quiero efecto lifting natural',
  'Quiero recuperar control',
  'Rostro más sujeto',
  5, ARRAY['lifting','tono','músculo','firmeza']
),
(
  'Reclaim', '45+',
  'baja actividad fibroblástica',
  'Tu piel ya no se activa sola',
  'Quiero mejorar mi piel',
  'Quiero sentir que aún puedo cambiar',
  'Piel que vuelve a responder',
  5, ARRAY['fibroblastos','activación','cambio']
),
(
  'Reclaim', '45+',
  'flacidez del tejido conectivo',
  'Tu rostro no se sostiene igual',
  'Quiero efecto lifting',
  'Quiero sentirme fuerte',
  'Piel más elevada',
  5, ARRAY['flacidez','lifting','sostén','fuerza']
);

-- INSERTS — customer_language_inputs
INSERT INTO customer_language_inputs
  (input_text, normalized_intent, linked_tags, emotion, line_hint)
VALUES
('tengo la piel apagada', 'falta de luminosidad',
  ARRAY['glow','apagada','fatiga'], 'frustración', 'Prevent'),
('me veo sin vida', 'falta de luminosidad',
  ARRAY['glow','sin vida'], 'tristeza', 'Prevent'),
('me veo mayor', 'pérdida de firmeza',
  ARRAY['firmeza','edad'], 'inseguridad', 'Recover'),
('se me cae la cara', 'flacidez',
  ARRAY['flacidez','lifting'], 'preocupación', 'Reclaim'),
('tengo ojeras aunque duerma', 'fatiga dérmica',
  ARRAY['cansancio','fatiga'], 'frustración', 'Recover'),
('he probado todo y nada funciona', 'frustración acumulada',
  ARRAY['frustración','resultados'], 'frustración alta', 'Reclaim'),
('quiero glow natural', 'deseo de luminosidad',
  ARRAY['glow','luminosidad'], 'deseo', 'Prevent'),
('noto la piel flácida', 'flacidez visible',
  ARRAY['flacidez','firmeza'], 'preocupación', 'Reclaim'),
('me veo cansada', 'fatiga visible',
  ARRAY['cansancio','fatiga'], 'frustración', 'Recover'),
('quiero firmeza sin agujas', 'lifting natural',
  ARRAY['lifting','natural','firmeza'], 'búsqueda alternativa', 'Reclaim'),
('no me reconozco en el espejo', 'pérdida de identidad facial',
  ARRAY['identidad','estructura'], 'tristeza profunda', 'Reclaim'),
('tengo la piel sin brillo', 'falta de luminosidad',
  ARRAY['brillo','glow'], 'frustración', 'Prevent');

-- INSERTS — voice_fragments
INSERT INTO voice_fragments (type, content, intensity, tags, line) VALUES
('hook', 'Tu piel no está mal… está cansada', 2, ARRAY['fatiga','apagada'], NULL),
('hook', 'Tu cara pierde vida cuando no circula bien', 2, ARRAY['circulación','glow'], NULL),
('hook', 'No es falta de años. Es falta de estímulo', 3, ARRAY['activación'], NULL),
('hook', 'Has probado de todo. Pero no has activado nada', 3, ARRAY['frustración'], 'Reclaim'),
('insight', 'No es falta de producto, es exceso de ruido', 3, ARRAY['productos'], NULL),
('insight', 'Los fibroblastos no se activan solos', 2, ARRAY['fibroblastos'], NULL),
('insight', 'Hidratar no es lo mismo que estimular', 3, ARRAY['hidratación'], NULL),
('sensorial', 'Cara más fresca, como recién despertada', 1, ARRAY['frescura','glow'], 'Prevent'),
('sensorial', 'Piel que respira', 1, ARRAY['oxigenación'], NULL),
('sensorial', 'Rostro con luz propia', 2, ARRAY['glow','luminosidad'], NULL),
('sensorial', 'Piel más densa, más llena', 2, ARRAY['firmeza','densidad'], 'Recover'),
('sensorial', 'Piel que vuelve a responder', 2, ARRAY['activación'], 'Reclaim'),
('cierre', 'No es solo cómo se ve tu piel… es cómo se siente tenerla así', 3, ARRAY['sensorial'], NULL),
('cta', '¿Quieres que te explique cómo funciona en tu caso?', 1, ARRAY['información'], NULL),
('cta', 'Si quieres podemos hablar por Instagram', 1, ARRAY['instagram'], NULL);

-- INSERTS — competitor_translation
INSERT INTO competitor_translation
  (competitor_claim, technical_meaning, yadala_translation, emotional_translation, tags)
VALUES
('Mejora la microcirculación',
  'Aumento del flujo sanguíneo superficial',
  'Tu piel vuelve a tener vida',
  'Te miras y ves una cara con otra energía',
  ARRAY['circulación','glow']),
('Estimula la producción de colágeno',
  'Activación de fibroblastos para síntesis proteica',
  'Tu piel empieza a construirse desde dentro',
  'Notas que algo está cambiando, y es real',
  ARRAY['colágeno','fibroblastos']),
('Efecto tensor inmediato',
  'Contracción superficial temporal',
  'Tu piel se ve más firme desde el primer día',
  'Sales al espejo y algo ha cambiado',
  ARRAY['firmeza','tensor']),
('Lifting sin cirugía',
  'Tensado mecánico o por radiofrecuencia',
  'Tu rostro recupera sostén sin que nadie lo toque',
  'Ves tu cara y por fin te reconoces',
  ARRAY['lifting','alternativa']);

-- RLS
ALTER TABLE skin_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_language_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_translation ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública skin_insights"
  ON skin_insights FOR SELECT TO anon USING (true);
CREATE POLICY "Lectura pública voice_fragments"
  ON voice_fragments FOR SELECT TO anon USING (true);
CREATE POLICY "Lectura pública competitor_translation"
  ON competitor_translation FOR SELECT TO anon USING (true);
CREATE POLICY "Lectura pública customer_inputs"
  ON customer_language_inputs FOR SELECT TO anon USING (true);
CREATE POLICY "Inserción customer_inputs"
  ON customer_language_inputs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Gestión agent_memory"
  ON agent_memory FOR ALL TO anon USING (true) WITH CHECK (true);
```

---

## PARTE 2 — WORKFLOW N8N (NODO A NODO)

### Nodo 1 — Webhook
**Tipo:** Webhook  
**Método:** POST  
**Path:** `/yadala-agent`

Input esperado:
```json
{
  "message": "tengo la piel apagada",
  "user_id": "whatsapp_+34600000000",
  "channel": "whatsapp"
}
```

---

### Nodo 2 — Function: Normalizar texto
**Tipo:** Code node (JavaScript)

```javascript
return [{
  json: {
    text: $json.message.toLowerCase().trim(),
    user_id: $json.user_id,
    channel: $json.channel
  }
}];
```

---

### Nodo 3 — AI: Intent Classifier
**Tipo:** AI Agent / OpenAI node  
**Modelo:** claude-sonnet-4-6 (vía HTTP request)

**Prompt:**
```
Analiza el mensaje del usuario sobre su piel.

Devuelve SOLO JSON válido, sin explicaciones:
{
  "intent": "descripción breve de la intención",
  "tags": ["tag1", "tag2"],
  "emotion": "frustración|inseguridad|deseo|tristeza|preocupación",
  "line": "Prevent|Recover|Reclaim|unknown"
}

Tags posibles: glow, firmeza, flacidez, lifting, fatiga, arrugas,
luminosidad, hidratación, poros, estrés, activación, fibroblastos

Mensaje: {{$json.text}}
```

---

### Nodo 4 — Supabase: Match customer input
**Tipo:** HTTP Request o Supabase node

```
GET https://qbvltetexymyrvscbbai.supabase.co/rest/v1/customer_language_inputs
?input_text=ilike.*{{$json.intent}}*
&limit=1
```

Headers:
```
apikey: [SUPABASE_ANON_KEY]
Authorization: Bearer [SUPABASE_ANON_KEY]
```

---

### Nodo 5 — Supabase: Match skin insights
```
GET https://qbvltetexymyrvscbbai.supabase.co/rest/v1/skin_insights
?tags=cs.{{{$json.tags[0]}}}
&order=priority.desc
&limit=1
```

---

### Nodo 6 — Supabase: Recuperar memoria usuario
```
GET https://qbvltetexymyrvscbbai.supabase.co/rest/v1/agent_memory
?user_id=eq.{{$json.user_id}}
&limit=1
```

---

### Nodo 7 — AI: Response Generator (CORE)
**Este es el nodo más importante.**

**Prompt del sistema:**
```
Actúa como la voz de Yadala.

YADALA: cosmética ancestral española, mascarilla facial de bioestimulación
natural. 55 minutos. Sin agujas. Sin cirugía. Fundada por Pedro Jordà,
Lanzarote, 4 generaciones.

Tu objetivo:
Hacer que el cliente se sienta comprendido.
Conectar su problema de piel con su experiencia real.
Generar deseo de probar Yadala de forma natural.

DATOS DEL CLIENTE:
- Mensaje: {{user_input}}
- Problema técnico: {{technical_concept}}
- Traducción Yadala: {{yadala_translation}}
- Deseo visible: {{desire_level_1}}
- Deseo emocional: {{desire_level_2}}
- Sensorialidad: {{sensoriality}}
- Línea recomendada: {{line}}
- Stage conversación: {{conversation_stage}}

INSTRUCCIONES:

1. Empieza validando al cliente (1 frase)
2. Usa la traducción Yadala (no el término técnico)
3. Conecta con cómo se siente (deseo emocional)
4. Introduce sensorialidad (lo que va a notar)
5. Cierra con CTA suave si stage = consideration o decision

REGLAS:
- Frases cortas con saltos de línea
- Máximo 5-6 líneas
- Sin tecnicismos
- Sin espiritualidad
- Sin vender agresivamente
- Tono: humano, cercano, experto

ETAPAS Y COMPORTAMIENTO:
- awareness → solo educar, no vender
- interest → mostrar posibilidad
- consideration → introduce Yadala como solución
- decision → CTA directo pero suave
```

---

### Nodo 8 — Function: Actualizar memoria
```javascript
const memory = {
  user_id: $json.user_id,
  last_intent: $json.intent,
  skin_line: $json.line,
  last_message: $json.text,
  updated_at: new Date().toISOString()
};

// Determinar siguiente stage
const stages = ['awareness','interest','consideration','decision'];
const currentStage = $json.conversation_stage || 'awareness';
const currentIndex = stages.indexOf(currentStage);
const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];

memory.conversation_stage = nextStage;

return [{ json: memory }];
```

---

### Nodo 9 — Supabase: Guardar memoria
```
POST https://qbvltetexymyrvscbbai.supabase.co/rest/v1/agent_memory
Header: Prefer: resolution=merge-duplicates
Body: {{$json}}
```

---

### Nodo 10 — Send Response
**WhatsApp:** HTTP Request a WhatsApp Business API  
**Instagram:** HTTP Request a Meta Graph API  
**Web chat:** Webhook response

---

## PARTE 3 — PROMPT EXTRA: Competitor Translator

Nodo adicional cuando el cliente menciona otra marca o término técnico:

```
Convierte este mensaje técnico al lenguaje Yadala.

Mensaje: {{competitor_claim}}

Devuelve JSON:
{
  "traduccion_simple": "",
  "version_emocional": "",
  "version_sensorial": ""
}

Reglas:
- No menciones la competencia
- Habla siempre en positivo de lo que Yadala sí hace
- Usa el lenguaje del manual de voz Yadala
```

---

## PARTE 4 — MEMORIA DEL AGENTE

La tabla `agent_memory` permite:

**Seguimiento de conversación:**
```
Mensaje 1: awareness → educo
Mensaje 2: interest → muestro posibilidad  
Mensaje 3: consideration → presento Yadala
Mensaje 4: decision → CTA suave
Mensaje 5+: customer → fidelización
```

**Personalización progresiva:**
```javascript
// Si ya sé su línea, no le pregunto de nuevo
if (memory.skin_line) {
  context += `Esta persona es candidata a Yadala ${memory.skin_line}.`;
}

// Si ha preguntado antes, recuerdo
if (memory.messages_count > 3) {
  context += `Llevamos varios mensajes. Puede estar lista para decidir.`;
}
```

---

## RESUMEN DEL SISTEMA

| Componente | Función |
|---|---|
| `customer_language_inputs` | Entiende cómo habla el cliente |
| `skin_insights` | Traduce técnico → emocional |
| `voice_fragments` | Habla con coherencia de marca |
| `competitor_translation` | Convierte competencia en ventaja |
| `agent_memory` | Recuerda y personaliza |
| Prompt Response Generator | Construye la respuesta perfecta |
| n8n workflow | Orquesta todo automáticamente |

---

## Lo que has construido

Un sistema que:
- Escucha como cliente
- Piensa como experto en piel
- Responde como la marca Yadala
- Recuerda cada conversación
- Mejora con cada interacción

Versión: 1.0 · Abril 2026 · YADALA · Pedro Jordà
