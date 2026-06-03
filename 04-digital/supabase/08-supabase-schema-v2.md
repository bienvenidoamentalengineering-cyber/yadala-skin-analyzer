# SUPABASE — ESTRUCTURA OPTIMIZADA YADALA
**Archivo:** `04-digital/supabase/schema-v2.sql`  
**Ejecutar en:** Supabase → SQL Editor → Run

---

## PASO 1 — Crear tabla principal `leads`

```sql
CREATE TABLE leads (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  email             TEXT UNIQUE NOT NULL,

  -- Segmentación principal
  segment           TEXT CHECK (segment IN ('PREVENT','RECOVER','RECLAIM')),
  recommended_line  TEXT CHECK (recommended_line IN ('PREVENT','RECOVER','RECLAIM')),

  -- Dolor
  pain_primary      TEXT CHECK (pain_primary IN ('apagada','primeras_lineas','flacidez','general')),
  pain_intensity    INT CHECK (pain_intensity BETWEEN 1 AND 5),

  -- Estilo de vida
  lifestyle         TEXT CHECK (lifestyle IN ('estres','equilibrado','sin_tiempo','amil')),

  -- Momento vital
  skin_moment       TEXT CHECK (skin_moment IN ('mantener','cambiando','perdida_estructura','no_claro')),

  -- Historial cosmético
  history_cosmetics TEXT CHECK (history_cosmetics IN ('nada','basico','avanzado','frustrado')),

  -- Intención y consciencia
  intent_level      TEXT CHECK (intent_level IN ('alto','medio','bajo')),
  awareness_level   TEXT CHECK (awareness_level IN ('no_se','buscando','probado','frustrado')),

  -- Deseo final
  desire            TEXT CHECK (desire IN ('glow','firmeza','estructura','bienestar')),

  -- Estado de conversión
  conversion_status TEXT DEFAULT 'new' 
                    CHECK (conversion_status IN ('new','contacted','bought','lost')),

  -- Metadatos
  fuente            TEXT DEFAULT 'web-quiz-v2',
  ip_country        TEXT,
  notas             TEXT
);
```

---

## PASO 2 — Crear tabla `quiz_answers_raw`

```sql
CREATE TABLE quiz_answers_raw (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  lead_id     UUID REFERENCES leads(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  score       JSONB -- {PREVENT: 2, RECOVER: 1, RECLAIM: 0}
);
```

---

## PASO 3 — Crear tabla `events`

```sql
CREATE TABLE events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
  event_type  TEXT CHECK (event_type IN (
                'quiz_started',
                'quiz_completed', 
                'email_captured',
                'email_open',
                'email_click',
                'purchase',
                'whatsapp_contact',
                'instagram_click'
              )),
  metadata    JSONB -- datos extra: email_subject, link_clicked, etc.
);
```

---

## PASO 4 — Row Level Security

```sql
-- Tabla leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública leads"
ON leads FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Lectura solo autenticados"
ON leads FOR SELECT TO authenticated
USING (true);

-- Tabla quiz_answers_raw
ALTER TABLE quiz_answers_raw ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública answers"
ON quiz_answers_raw FOR INSERT TO anon
WITH CHECK (true);

-- Tabla events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública events"
ON events FOR INSERT TO anon
WITH CHECK (true);
```

---

## PASO 5 — Índices para consultas rápidas

```sql
CREATE INDEX idx_leads_segment ON leads(segment);
CREATE INDEX idx_leads_intent ON leads(intent_level);
CREATE INDEX idx_leads_awareness ON leads(awareness_level);
CREATE INDEX idx_leads_status ON leads(conversion_status);
CREATE INDEX idx_events_lead ON events(lead_id);
CREATE INDEX idx_events_type ON events(event_type);
```

---

## LÓGICA DE CÁLCULO (para el quiz)

### pain_intensity (1–5)
```javascript
function calcPainIntensity(answers) {
  if (answers.historial === 'frustrada') return 5;
  if (answers.emocion === 'fuerza' || answers.momento === 'perdida') return 4;
  if (answers.emocion === 'cambios' || answers.momento === 'cambiando') return 3;
  if (answers.emocion === 'apagada') return 2;
  return 1; // bien, quiero mejorar
}
```

### intent_level
```javascript
function calcIntentLevel(answers) {
  if (answers.intencion === 'caliente') return 'alto';
  if (answers.intencion === 'medio') return 'alto';
  if (answers.intencion === 'frio') return 'medio';
  return 'bajo';
}
```

### awareness_level
```javascript
function calcAwarenessLevel(answers) {
  if (answers.historial === 'frustrada') return 'frustrado';
  if (answers.historial === 'avanzada') return 'probado';
  if (answers.historial === 'basica') return 'buscando';
  return 'no_se';
}
```

### pain_primary
```javascript
function calcPainPrimary(answers) {
  if (answers.emocion === 'apagada' || answers.deseo === 'luminosa') return 'apagada';
  if (answers.emocion === 'cambios' || answers.deseo === 'firmeza') return 'primeras_lineas';
  if (answers.emocion === 'fuerza' || answers.deseo === 'estructura') return 'flacidez';
  return 'general';
}
```

### desire
```javascript
function calcDesire(answers) {
  const map = {
    luminosa: 'glow',
    firmeza: 'firmeza',
    estructura: 'estructura',
    bienestar: 'bienestar'
  };
  return map[answers.deseo] || 'bienestar';
}
```

---

## Migración desde tablas antiguas

Las tablas `quiz_leads` y `skin_analyses` se mantienen como historial.
Los nuevos leads van a la tabla `leads`.

```sql
-- Ver leads actuales (tabla vieja)
SELECT * FROM quiz_leads ORDER BY created_at DESC;

-- Ver análisis actuales (tabla vieja)
SELECT * FROM skin_analyses ORDER BY created_at DESC;
```

---

## Vista útil para el agente de analítica

```sql
CREATE VIEW leads_dashboard AS
SELECT 
  segment,
  intent_level,
  awareness_level,
  conversion_status,
  COUNT(*) as total,
  DATE_TRUNC('week', created_at) as semana
FROM leads
GROUP BY segment, intent_level, awareness_level, conversion_status, semana
ORDER BY semana DESC;
```

Versión: 2.0 · Abril 2026 · YADALA
