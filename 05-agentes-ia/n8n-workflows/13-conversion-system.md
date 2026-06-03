# YADALA CONVERSION SYSTEM — FOLLOW-UP + CIERRE + KPIs
**Archivo:** `05-agentes-ia/n8n-workflows/13-conversion-system.md`
**Versión:** 1.0 · Abril 2026

## Filosofía

No persigue al cliente.
Lo acompaña hasta que decide.

---

## PARTE 1 — SECUENCIA DE FOLLOW-UP AUTOMÁTICA

### Lógica general

```
Día 0  → contacto inicial (agente WhatsApp)
Día 1  → refuerzo emocional
Día 3  → insight + educación
Día 5  → prueba social / validación
Día 7  → micro-cierre
Día 10 → cierre suave final
```

### Mensajes (voz Yadala)

**Día 1 — "Te entiendo"**
```
He estado pensando en lo que me dijiste.

Muchas veces no es que la piel esté mal…
es que está respondiendo a cómo estamos viviendo.

Cuando cambias eso, se nota muy rápido.
```

**Día 3 — Insight**
```
Hay algo importante:

la piel no mejora cuando añades más cosas…
mejora cuando empieza a funcionar mejor.

Ahí es donde trabajamos nosotros.
```

**Día 5 — Validación**
```
La mayoría de personas que llegan así
empiezan notando lo mismo:

cara más despierta
piel con más vida
sin cambiar todo lo demás.
```

**Día 7 — Micro-cierre**
```
Por lo que me contaste, estás en un punto muy bueno.
Tu piel aún responde rápido cuando la activas.

Si quieres, te explico exactamente cómo usarlo en tu caso.
```

**Día 10 — Cierre suave final**
```
Si en algún momento decides empezar,
aquí estoy para ayudarte.

A veces solo necesitas activar lo que ya está ahí.
```

### SQL: tabla follow_up_queue

```sql
CREATE TABLE follow_up_queue (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  user_id     TEXT NOT NULL,
  line        TEXT,
  day         INT NOT NULL, -- 1, 3, 5, 7, 10
  scheduled   TIMESTAMPTZ NOT NULL,
  sent        BOOLEAN DEFAULT FALSE,
  sent_at     TIMESTAMPTZ,
  response    TEXT
);

CREATE INDEX idx_fup_scheduled ON follow_up_queue(scheduled, sent);
```

### n8n: nodo programador de follow-ups

```javascript
// Al crear un nuevo lead, programar toda la secuencia
const userId = $json.user_id;
const line = $json.line;
const now = new Date();

const days = [1, 3, 5, 7, 10];
const queue = days.map(day => ({
  user_id: userId,
  line: line,
  day: day,
  scheduled: new Date(now.getTime() + day * 24 * 60 * 60 * 1000),
  sent: false
}));

return queue.map(item => ({ json: item }));
```

### n8n: trigger diario para enviar follow-ups

```javascript
// Cron: cada día a las 10:00
// Query: buscar mensajes pendientes de enviar

const query = `
  SELECT fq.*, am.last_intent, am.skin_line
  FROM follow_up_queue fq
  LEFT JOIN agent_memory am ON am.user_id = fq.user_id
  WHERE fq.scheduled <= NOW()
  AND fq.sent = FALSE
  LIMIT 50
`;
```

---

## PARTE 2 — SISTEMA DE RECUPERACIÓN DE LEADS FRÍOS

### Trigger: 3–5 días sin respuesta

```sql
-- Leads sin actividad
SELECT user_id, last_interaction, temperature
FROM lead_scoring
WHERE last_interaction < NOW() - INTERVAL '3 days'
AND temperature = 'cold'
AND converted = FALSE;
```

### Secuencia de reactivación (3 mensajes)

**Mensaje 1 — Reabrir**
```
Te escribo porque muchas veces dejamos esto a medias…
y la piel sigue igual.

¿Sigues notando lo mismo?
```

**Mensaje 2 — Si no responde (2 días después)**
```
No sé si te pasa, pero…
muchas veces sabemos lo que necesitamos
y simplemente lo dejamos pasar.

Cuando quieras retomarlo, lo vemos.
```

**Mensaje 3 — Último (3 días después)**
```
Cierro por aquí para no molestarte 🙂

Si en algún momento quieres volver a activar tu piel,
escríbeme.
```

### Prompt n8n para reactivación

```
Actúa como la voz de Yadala.

Este lead no ha respondido en {{days_silent}} días.
Línea asignada: {{line}}
Último problema mencionado: {{last_intent}}
Número de intento de reactivación: {{reactivation_attempt}}

OBJETIVO: reabrir la conversación sin presión.

REGLAS:
- No menciones que no ha respondido de forma acusatoria
- No vendas nada
- Una sola pregunta abierta al final
- Máximo 3 líneas
- Tono: humano, cercano, sin urgencia
```

---

## PARTE 3 — SCRIPT DE CIERRE FINAL

### Estructura

```
1. Validación → "tiene sentido"
2. Diagnóstico → su problema específico
3. Recomendación → su línea exacta
4. Resultado esperado → sensorialidad
5. Acción → link checkout
6. Reducción de fricción → "si tienes dudas, dime"
```

### Script completo

```
Por lo que me has contado, tiene sentido.

Tu piel ahora mismo no necesita más productos…
necesita activarse.

En tu caso, te encaja Yadala [LÍNEA].

Lo que vas a notar:
piel más firme
cara más despierta
más vida en el rostro
desde las primeras aplicaciones.

Te dejo aquí cómo empezar 👇
[LINK CHECKOUT]

Si tienes cualquier duda antes de empezar, dime.
```

### Prompt para el agente de cierre

```
Actúa como la voz de Yadala.

Este lead está HOT y listo para comprar.

Datos:
- Línea: {{line}}
- Problema: {{yadala_translation}}
- Sensorialidad: {{sensoriality}}
- Deseo emocional: {{desire_level_2}}
- Link checkout: {{checkout_url}}

Genera el script de cierre final.
Sigue exactamente la estructura:
validación → diagnóstico → recomendación → resultado → acción → reducción fricción.

Frases cortas. Saltos de línea. Natural.
No uses signos de exclamación. No seas agresivo.
```

---

## PARTE 4 — SQL: TABLA CONVERSIONS + KPIs

### Tabla conversions

```sql
CREATE TABLE conversions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  user_id           TEXT,
  line              TEXT CHECK (line IN ('Prevent','Recover','Reclaim')),
  source            TEXT CHECK (source IN ('whatsapp','quiz','ads','instagram','referral')),
  status            TEXT DEFAULT 'lead'
                    CHECK (status IN ('lead','engaged','hot','converted','lost')),
  score             INT DEFAULT 0,
  first_interaction TIMESTAMPTZ DEFAULT NOW(),
  converted_at      TIMESTAMPTZ,
  revenue           DECIMAL(10,2)
);

ALTER TABLE lead_scoring ADD COLUMN IF NOT EXISTS converted BOOLEAN DEFAULT FALSE;

CREATE INDEX idx_conv_status ON conversions(status);
CREATE INDEX idx_conv_line ON conversions(line);
CREATE INDEX idx_conv_source ON conversions(source);
```

### KPIs en SQL

```sql
-- 1. Tasa de conversión total
SELECT
  COUNT(*) FILTER (WHERE status = 'converted')::FLOAT /
  NULLIF(COUNT(*), 0) * 100 AS conversion_rate_pct
FROM conversions;

-- 2. Conversión por línea
SELECT
  line,
  COUNT(*) FILTER (WHERE status = 'converted') AS ventas,
  COUNT(*) AS total_leads,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'converted')::NUMERIC /
    NULLIF(COUNT(*), 0) * 100, 1
  ) AS conversion_pct
FROM conversions
GROUP BY line
ORDER BY ventas DESC;

-- 3. Leads calientes que convierten
SELECT
  ROUND(
    COUNT(*) FILTER (WHERE status = 'converted')::NUMERIC /
    NULLIF(COUNT(*) FILTER (WHERE score >= 8), 0) * 100, 1
  ) AS hot_conversion_pct
FROM conversions;

-- 4. Tiempo medio de cierre (días)
SELECT
  ROUND(
    AVG(EXTRACT(EPOCH FROM (converted_at - first_interaction)) / 86400)::NUMERIC,
    1
  ) AS avg_days_to_close
FROM conversions
WHERE status = 'converted';

-- 5. Rendimiento por fuente
SELECT
  source,
  COUNT(*) AS leads,
  COUNT(*) FILTER (WHERE status = 'converted') AS ventas,
  SUM(revenue) AS ingresos_totales
FROM conversions
GROUP BY source
ORDER BY ventas DESC;

-- 6. Score medio por estado
SELECT
  status,
  ROUND(AVG(score), 1) AS score_medio,
  COUNT(*) AS total
FROM conversions
GROUP BY status
ORDER BY score_medio DESC;

-- 7. Vista dashboard semanal
CREATE OR REPLACE VIEW weekly_dashboard AS
SELECT
  DATE_TRUNC('week', created_at) AS semana,
  COUNT(*) AS leads_nuevos,
  COUNT(*) FILTER (WHERE status = 'converted') AS ventas,
  SUM(revenue) AS ingresos,
  ROUND(AVG(score), 1) AS score_medio
FROM conversions
GROUP BY semana
ORDER BY semana DESC;
```

---

## PARTE 5 — ARQUITECTURA N8N COMPLETA

```
FLUJO 1: CONVERSACIÓN ACTIVA
─────────────────────────────
Webhook mensaje
    ↓
Normalizar
    ↓
Intent Classifier (Claude)
    ↓
Match Supabase (inputs + insights)
    ↓
Scoring Calculator
    ↓
Temperature Router
    ├── HOT  → prompt cierre
    ├── WARM → prompt educación
    └── COLD → prompt conexión
    ↓
Guardar memoria + scoring
    ↓
Registrar en conversions
    ↓
Enviar respuesta WhatsApp

FLUJO 2: FOLLOW-UP AUTOMÁTICO
──────────────────────────────
Cron diario 10:00
    ↓
Query follow_up_queue (pendientes)
    ↓
Para cada lead:
    ↓
Generar mensaje personalizado (Claude)
    ↓
Enviar WhatsApp
    ↓
Marcar como sent

FLUJO 3: RECUPERACIÓN LEADS FRÍOS
───────────────────────────────────
Cron cada 3 días
    ↓
Query leads sin actividad 3+ días
    ↓
Generar mensaje reactivación (Claude)
    ↓
Enviar + registrar intento

FLUJO 4: PROGRAMAR FOLLOW-UPS
───────────────────────────────
Trigger: nuevo lead en Supabase
    ↓
Crear entradas en follow_up_queue
(días 1, 3, 5, 7, 10)

FLUJO 5: ANALÍTICA SEMANAL
────────────────────────────
Cron domingo 20:00
    ↓
Query weekly_dashboard
    ↓
Generar informe con Claude
    ↓
Enviar email a Pedro
```

---

Versión: 1.0 · Abril 2026 · YADALA Conversion System · Pedro Jordà
