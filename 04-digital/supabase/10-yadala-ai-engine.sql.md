# MOTOR DE INTELIGENCIA — YADALA AI ENGINE
**Archivo:** `04-digital/supabase/yadala-ai-engine.sql`
**Versión:** 1.0 · Abril 2026

## Arquitectura del sistema

```
Input del cliente
      ↓
customer_language_inputs (detecta intención)
      ↓
skin_insights (devuelve diagnóstico + traducción)
      ↓
voice_fragments (construye respuesta en voz Yadala)
      ↓
competitor_translation (si menciona otra marca)
      ↓
Respuesta final en lenguaje Yadala
```

---

## SQL COMPLETO — Ejecutar en Supabase SQL Editor

```sql
-- ================================================
-- YADALA AI ENGINE — MOTOR DE TRADUCCIÓN
-- ================================================

-- Habilitar extensión para búsqueda semántica futura
CREATE EXTENSION IF NOT EXISTS vector;

-- ================================================
-- TABLA 1: skin_insights
-- Núcleo del sistema. Todo el diccionario de traducción.
-- ================================================

CREATE TABLE skin_insights (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW(),

  -- Segmentación
  line                TEXT CHECK (line IN ('Prevent','Recover','Reclaim')),
  age_group           TEXT CHECK (age_group IN ('20-30','30-45','45+')),

  -- Las 5 capas
  technical_concept   TEXT NOT NULL,
  yadala_translation  TEXT NOT NULL,
  desire_level_1      TEXT NOT NULL,
  desire_level_2      TEXT NOT NULL,
  sensoriality        TEXT NOT NULL,

  -- Metadatos para búsqueda
  priority            INT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  tags                TEXT[] DEFAULT '{}',

  -- Vector para búsqueda semántica futura (pgvector)
  embedding           VECTOR(1536)
);

-- Índice por línea y tags
CREATE INDEX idx_skin_insights_line ON skin_insights(line);
CREATE INDEX idx_skin_insights_tags ON skin_insights USING GIN(tags);

-- ================================================
-- DATOS: skin_insights — PREVENT
-- ================================================

INSERT INTO skin_insights (line, age_group, technical_concept, yadala_translation, desire_level_1, desire_level_2, sensoriality, priority, tags) VALUES

('Prevent', '20-30',
 'Estrés oxidativo y desregulación del manto hidrolipídico',
 'Tu piel se apaga cuando tu ritmo se desordena',
 'Quiero tener buena cara sin maquillaje',
 'Quiero sentir que tengo control sobre mí',
 'Cara más fresca, como recién despertada',
 5, ARRAY['glow','fatiga','estrés','apagada']),

('Prevent', '20-30',
 'Disminución temprana de colágeno',
 'Tu piel empieza a perder fuerza antes de que lo notes',
 'Quiero mantenerme joven más tiempo',
 'Quiero sentir seguridad en mi imagen',
 'Piel más firme al tacto',
 5, ARRAY['firmeza','colágeno','prevención']),

('Prevent', '20-30',
 'Baja microcirculación',
 'Tu cara pierde vida cuando no circula bien',
 'Quiero glow natural',
 'Quiero sentirme más viva',
 'Rostro con luz propia',
 5, ARRAY['glow','circulación','luminosidad','apagada']),

('Prevent', '20-30',
 'Desequilibrio sebo/agua',
 'Tu piel está desordenada',
 'Quiero una piel equilibrada',
 'Quiero dejar de sentirme incómoda con mi piel',
 'Piel que se siente estable, sin tirantez',
 4, ARRAY['equilibrio','sebo','tirantez','poros']),

('Prevent', '20-30',
 'Inflamación por estrés',
 'Tu piel reacciona porque está saturada',
 'Quiero menos granitos y rojeces',
 'Quiero calma, no estrés constante',
 'Sensación de piel calmada',
 4, ARRAY['rojeces','inflamación','estrés','granitos']),

('Prevent', '20-30',
 'Exceso de productos',
 'Estás haciendo demasiado',
 'Quiero una rutina simple',
 'Quiero dejar de complicarme',
 'Piel ligera, sin sobrecarga',
 3, ARRAY['rutina','productos','simplicidad']),

('Prevent', '20-30',
 'Falta de sueño',
 'Tu piel no descansa',
 'Quiero cara de descansada',
 'Quiero sentirme en equilibrio',
 'Cara relajada, sin tensión',
 4, ARRAY['sueño','cansancio','tensión','fatiga']),

('Prevent', '20-30',
 'Barrera cutánea alterada',
 'Tu piel no se protege bien',
 'Quiero piel sana',
 'Quiero sentirme cuidada',
 'Piel protegida, confortable',
 3, ARRAY['barrera','sensible','protección']),

('Prevent', '20-30',
 'Oxigenación deficiente',
 'A tu piel le falta aire',
 'Quiero piel luminosa',
 'Quiero sentirme ligera',
 'Piel que respira',
 4, ARRAY['oxigenación','luminosidad','glow','aire']),

('Prevent', '20-30',
 'Inicio pérdida de tono',
 'Tu cara empieza a caer',
 'Quiero firmeza',
 'Quiero confiar en cómo me veo',
 'Rostro más tonificado',
 4, ARRAY['tono','firmeza','caída','prevención']);

-- ================================================
-- DATOS: skin_insights — RECOVER
-- ================================================

INSERT INTO skin_insights (line, age_group, technical_concept, yadala_translation, desire_level_1, desire_level_2, sensoriality, priority, tags) VALUES

('Recover', '30-45',
 'Disminución colágeno y elastina',
 'Tu piel ya no responde como antes',
 'Quiero firmeza',
 'Quiero sentir que aún estoy a tiempo',
 'Piel más densa, más llena',
 5, ARRAY['firmeza','colágeno','elastina','respuesta']),

('Recover', '30-45',
 'Pérdida de tono muscular facial',
 'Tu rostro pierde fuerza',
 'Quiero efecto lifting natural',
 'Quiero recuperar control',
 'Rostro más sujeto',
 5, ARRAY['lifting','tono','músculo','firmeza']),

('Recover', '30-45',
 'Baja microcirculación',
 'Tu cara se ve apagada',
 'Quiero buena cara diaria',
 'Quiero sentir energía',
 'Cara despierta',
 5, ARRAY['apagada','circulación','energía','glow']),

('Recover', '30-45',
 'Líneas de expresión marcadas',
 'Tus gestos se quedan marcados',
 'Quiero suavizar arrugas',
 'Quiero verme más fresca',
 'Piel más lisa al mirarte',
 5, ARRAY['arrugas','expresión','líneas','suavizar']),

('Recover', '30-45',
 'Fatiga dérmica',
 'Tu piel está cansada',
 'Quiero recuperar vitalidad',
 'Quiero sentirme menos agotada',
 'Rostro descansado',
 4, ARRAY['fatiga','cansancio','vitalidad']),

('Recover', '30-45',
 'Regeneración lenta',
 'Tu piel tarda en recuperarse',
 'Quiero resultados visibles',
 'Quiero confiar en que algo funciona',
 'Piel que reacciona rápido',
 4, ARRAY['regeneración','resultados','lenta']),

('Recover', '30-45',
 'Deshidratación estructural',
 'Tu piel no retiene',
 'Quiero piel jugosa',
 'Quiero sentir confort',
 'Piel elástica y flexible',
 4, ARRAY['hidratación','sequedad','confort','elástica']),

('Recover', '30-45',
 'Estrés oxidativo acumulado',
 'Se empieza a notar lo vivido',
 'Quiero mejorar mi aspecto',
 'Quiero sentirme en paz con mi edad',
 'Rostro más luminoso',
 4, ARRAY['oxidativo','edad','aspecto','luminosidad']),

('Recover', '30-45',
 'Tejido conectivo débil',
 'Tu piel pierde sostén',
 'Quiero contorno definido',
 'Quiero volver a reconocerme',
 'Rostro más firme',
 5, ARRAY['contorno','sostén','reconocerse','óvalo']),

('Recover', '30-45',
 'Baja densidad cutánea',
 'Tu piel se afina',
 'Quiero piel más firme',
 'Quiero sentirme segura',
 'Piel más compacta',
 4, ARRAY['densidad','firmeza','afina','seguridad']);

-- ================================================
-- DATOS: skin_insights — RECLAIM
-- ================================================

INSERT INTO skin_insights (line, age_group, technical_concept, yadala_translation, desire_level_1, desire_level_2, sensoriality, priority, tags) VALUES

('Reclaim', '45+',
 'Pérdida avanzada de colágeno',
 'Tu piel ha perdido estructura',
 'Quiero reafirmar',
 'Quiero recuperar presencia',
 'Rostro más sólido',
 5, ARRAY['estructura','colágeno','presencia','firmeza']),

('Reclaim', '45+',
 'Flacidez del tejido conectivo',
 'Tu rostro no se sostiene igual',
 'Quiero efecto lifting',
 'Quiero sentirme fuerte',
 'Piel más elevada',
 5, ARRAY['flacidez','lifting','sostén','fuerza']),

('Reclaim', '45+',
 'Baja actividad fibroblástica',
 'Tu piel ya no se activa sola',
 'Quiero mejorar mi piel',
 'Quiero sentir que aún puedo cambiar',
 'Piel que vuelve a responder',
 5, ARRAY['fibroblastos','activación','cambio','respuesta']),

('Reclaim', '45+',
 'Pérdida de elasticidad',
 'Tu piel no vuelve',
 'Quiero elasticidad',
 'Quiero sentirme viva',
 'Piel flexible',
 4, ARRAY['elasticidad','vitalidad','flexible']),

('Reclaim', '45+',
 'Metabolismo lento',
 'Tu piel funciona más despacio',
 'Quiero revitalizar',
 'Quiero sentir energía',
 'Rostro activado',
 4, ARRAY['metabolismo','energía','lento','revitalizar']),

('Reclaim', '45+',
 'Atrofia dérmica',
 'Tu piel pierde volumen',
 'Quiero volumen natural',
 'Quiero volver a verme yo',
 'Piel más rellena',
 5, ARRAY['volumen','atrofia','rellena','identidad']),

('Reclaim', '45+',
 'Baja oxigenación',
 'Tu piel se ve sin vida',
 'Quiero luminosidad',
 'Quiero sentirme más visible',
 'Rostro con vida',
 4, ARRAY['oxigenación','sin vida','luminosidad','visible']),

('Reclaim', '45+',
 'Arrugas profundas',
 'Las líneas están marcadas',
 'Quiero suavizarlas',
 'Quiero aceptar mi rostro con orgullo',
 'Piel más suavizada',
 4, ARRAY['arrugas','líneas','orgullo','suavizar']),

('Reclaim', '45+',
 'Barrera frágil',
 'Tu piel es vulnerable',
 'Quiero piel fuerte',
 'Quiero sentir protección',
 'Piel reconfortada',
 3, ARRAY['barrera','frágil','protección','sensible']),

('Reclaim', '45+',
 'Deshidratación crónica',
 'Tu piel necesita más',
 'Quiero hidratación real',
 'Quiero sentir confort y bienestar',
 'Piel nutrida profundamente',
 4, ARRAY['hidratación','sequedad','nutrición','bienestar']);

-- ================================================
-- TABLA 2: customer_language_inputs
-- Cómo habla el cliente → intención real
-- ================================================

CREATE TABLE customer_language_inputs (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  input_text          TEXT NOT NULL,
  normalized_intent   TEXT NOT NULL,
  linked_tags         TEXT[] DEFAULT '{}',
  emotion             TEXT,
  line_hint           TEXT CHECK (line_hint IN ('Prevent','Recover','Reclaim')),
  frequency           INT DEFAULT 1  -- suma 1 cada vez que alguien lo dice
);

CREATE INDEX idx_cli_tags ON customer_language_inputs USING GIN(linked_tags);
CREATE INDEX idx_cli_line ON customer_language_inputs(line_hint);

-- Datos iniciales
INSERT INTO customer_language_inputs (input_text, normalized_intent, linked_tags, emotion, line_hint) VALUES
('tengo la piel apagada', 'falta de luminosidad', ARRAY['glow','apagada','fatiga'], 'frustración', 'Prevent'),
('me veo sin vida', 'falta de luminosidad', ARRAY['glow','sin vida','apagada'], 'tristeza', 'Prevent'),
('me veo mayor', 'pérdida de firmeza', ARRAY['firmeza','edad','envejecimiento'], 'inseguridad', 'Recover'),
('se me cae la cara', 'flacidez', ARRAY['flacidez','lifting','firmeza'], 'preocupación', 'Reclaim'),
('tengo ojeras aunque duerma', 'fatiga dérmica', ARRAY['cansancio','fatiga','ojeras'], 'frustración', 'Recover'),
('he probado todo y nada funciona', 'frustración acumulada', ARRAY['frustración','resultados','decepción'], 'frustración alta', 'Reclaim'),
('quiero glow natural', 'deseo de luminosidad', ARRAY['glow','luminosidad','natural'], 'deseo', 'Prevent'),
('se me marcan mucho las arrugas', 'arrugas marcadas', ARRAY['arrugas','líneas','expresión'], 'preocupación', 'Recover'),
('mi piel no tiene vida', 'falta de vitalidad', ARRAY['vitalidad','vida','apagada'], 'tristeza', 'Recover'),
('quiero piel de porcelana', 'deseo de textura perfecta', ARRAY['textura','glow','suavidad'], 'deseo', 'Prevent'),
('noto la piel flácida', 'flacidez visible', ARRAY['flacidez','firmeza','lifting'], 'preocupación', 'Reclaim'),
('me veo cansada', 'fatiga visible', ARRAY['cansancio','fatiga','descansada'], 'frustración', 'Recover'),
('la piel se me está cayendo', 'pérdida de firmeza avanzada', ARRAY['flacidez','lifting','firmeza'], 'alarma', 'Reclaim'),
('quiero verme más joven', 'deseo antiedad', ARRAY['juventud','firmeza','luminosidad'], 'deseo', 'Recover'),
('tengo la piel muy seca', 'deshidratación', ARRAY['sequedad','hidratación','tirantez'], 'incomodidad', 'Recover'),
('me salen granitos de estrés', 'inflamación por estrés', ARRAY['estrés','granitos','inflamación'], 'frustración', 'Prevent'),
('quiero firmeza sin agujas', 'lifting natural', ARRAY['lifting','natural','agujas','firmeza'], 'búsqueda alternativa', 'Reclaim'),
('no me reconozco en el espejo', 'pérdida de identidad facial', ARRAY['identidad','reconocerse','estructura'], 'tristeza profunda', 'Reclaim'),
('quiero prevenir el envejecimiento', 'prevención antiedad', ARRAY['prevención','antiedad','colágeno'], 'consciencia', 'Prevent'),
('tengo la piel sin brillo', 'falta de luminosidad', ARRAY['brillo','glow','luminosidad'], 'frustración', 'Prevent');

-- Función para incrementar frequency
CREATE OR REPLACE FUNCTION increment_input_frequency(input_text_val TEXT)
RETURNS void AS $$
BEGIN
  UPDATE customer_language_inputs
  SET frequency = frequency + 1
  WHERE input_text ILIKE '%' || input_text_val || '%';
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TABLA 3: voice_fragments
-- Biblioteca de copy con voz Yadala
-- ================================================

CREATE TABLE voice_fragments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  type        TEXT CHECK (type IN ('hook','insight','cierre','reflexión','cta','sensorial')),
  content     TEXT NOT NULL,
  intensity   INT DEFAULT 2 CHECK (intensity BETWEEN 1 AND 3),
  tags        TEXT[] DEFAULT '{}',
  line        TEXT  -- null = universal
);

CREATE INDEX idx_vf_type ON voice_fragments(type);
CREATE INDEX idx_vf_tags ON voice_fragments USING GIN(tags);

-- Datos
INSERT INTO voice_fragments (type, content, intensity, tags, line) VALUES
-- HOOKS
('hook', 'Tu piel no está mal… está cansada', 2, ARRAY['fatiga','apagada'], NULL),
('hook', 'Tu cara pierde vida cuando no circula bien', 2, ARRAY['circulación','apagada','glow'], NULL),
('hook', 'Tu piel refleja cómo estás viviendo', 3, ARRAY['ritmo','estrés','apagada'], NULL),
('hook', 'No es falta de años. Es falta de estímulo', 3, ARRAY['activación','fibroblastos'], NULL),
('hook', 'Has probado de todo. Pero no has activado nada', 3, ARRAY['frustración','activación'], 'Reclaim'),
('hook', 'Tu piel aún está bien… pero puede estar mejor', 1, ARRAY['prevención','glow'], 'Prevent'),
('hook', 'Tu piel no está perdida… solo ha dejado de activarse', 2, ARRAY['firmeza','activación'], 'Recover'),
('hook', 'Tu rostro tiene historia… pero puede volver a tener fuerza', 2, ARRAY['estructura','presencia'], 'Reclaim'),

-- INSIGHTS
('insight', 'No es falta de producto, es exceso de ruido', 3, ARRAY['productos','simplicidad'], NULL),
('insight', 'Los fibroblastos no se activan solos', 2, ARRAY['fibroblastos','activación','colágeno'], NULL),
('insight', 'Hidratar no es lo mismo que estimular', 3, ARRAY['hidratación','estimulación'], NULL),
('insight', 'Tu piel tiene memoria muscular', 2, ARRAY['músculo','tono','activación'], NULL),
('insight', 'El bótox paraliza. Yadala activa', 3, ARRAY['bótox','alternativa','lifting'], 'Reclaim'),
('insight', 'Cuando tú cambias, tu piel responde', 2, ARRAY['cambio','ritmo','respuesta'], NULL),
('insight', 'No necesitas más. Necesitas mejor', 3, ARRAY['simplicidad','calidad'], NULL),

-- SENSORIAL
('sensorial', 'Cara más fresca, como recién despertada', 1, ARRAY['frescura','glow','despertada'], 'Prevent'),
('sensorial', 'Piel que respira', 1, ARRAY['oxigenación','ligereza'], NULL),
('sensorial', 'Rostro con luz propia', 2, ARRAY['glow','luminosidad'], NULL),
('sensorial', 'Piel más densa, más llena', 2, ARRAY['firmeza','densidad','llena'], 'Recover'),
('sensorial', 'Rostro más sujeto', 2, ARRAY['firmeza','lifting','sujeto'], 'Recover'),
('sensorial', 'Piel que vuelve a responder', 2, ARRAY['activación','respuesta','fibroblastos'], 'Reclaim'),
('sensorial', 'Rostro más sólido', 3, ARRAY['estructura','sólido','presencia'], 'Reclaim'),

-- CIERRES
('cierre', 'No es solo cómo se ve tu piel… es cómo se siente tenerla así', 3, ARRAY['sensorial','identidad'], NULL),
('cierre', 'Activa hoy lo que tu piel agradecerá mañana', 2, ARRAY['prevención','futuro'], 'Prevent'),
('cierre', 'Tu piel volvió a contar tu historia con luz', 2, ARRAY['recuperación','identidad'], 'Recover'),
('cierre', 'No quiero parecer otra. Quiero verme como yo', 3, ARRAY['identidad','autenticidad'], 'Reclaim'),

-- CTAs
('cta', '¿Quieres que te explique cómo funciona?', 1, ARRAY['información','suave'], NULL),
('cta', '¿Te cuento exactamente qué hace Yadala en tu caso?', 2, ARRAY['personalizado','consulta'], NULL),
('cta', 'Si quieres, podemos hablar por Instagram', 1, ARRAY['instagram','contacto'], NULL),
('cta', 'Ver mi protocolo personalizado', 2, ARRAY['protocolo','resultado'], NULL);

-- ================================================
-- TABLA 4: competitor_translation
-- Marketing técnico de competencia → lenguaje Yadala
-- ================================================

CREATE TABLE competitor_translation (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  competitor_claim      TEXT NOT NULL,
  technical_meaning     TEXT,
  yadala_translation    TEXT NOT NULL,
  emotional_translation TEXT NOT NULL,
  tags                  TEXT[] DEFAULT '{}'
);

INSERT INTO competitor_translation (competitor_claim, technical_meaning, yadala_translation, emotional_translation, tags) VALUES
('Mejora la microcirculación',
 'Aumento del flujo sanguíneo superficial',
 'Tu piel vuelve a tener vida',
 'Te miras y ves una cara con otra energía',
 ARRAY['circulación','glow','vida']),

('Estimula la producción de colágeno',
 'Activación de fibroblastos para síntesis proteica',
 'Tu piel empieza a construirse desde dentro',
 'Notas que algo está cambiando, y es real',
 ARRAY['colágeno','fibroblastos','firmeza']),

('Efecto tensor inmediato',
 'Contracción superficial temporal por agentes filmógenos',
 'Tu piel se ve más firme desde el primer día',
 'Sales al espejo y algo ha cambiado',
 ARRAY['firmeza','tensor','inmediato']),

('Acción antioxidante',
 'Neutralización de radicales libres',
 'Tu piel se defiende mejor del ritmo que llevas',
 'Menos saturación, más equilibrio',
 ARRAY['antioxidante','estrés oxidativo','protección']),

('Rellena arrugas desde dentro',
 'Aumento de ácido hialurónico intradérmico',
 'Las líneas se suavizan porque la piel vuelve a tener volumen',
 'Te ves más descansada, más tú',
 ARRAY['arrugas','volumen','hialurónico']),

('Lifting sin cirugía',
 'Tensado mecánico o por radiofrecuencia',
 'Tu rostro recupera sostén sin que nadie lo toque',
 'Ves tu cara y por fin te reconoces',
 ARRAY['lifting','cirugía','alternativa','firmeza']),

('Regeneración celular acelerada',
 'Activación del ciclo de renovación epidérmica',
 'Tu piel vuelve a renovarse como antes',
 'Sientes que tu piel está viva de nuevo',
 ARRAY['regeneración','renovación','activación']),

('Hidratación profunda 72h',
 'Retención de agua en capas medias de la dermis',
 'Tu piel retiene lo que necesita',
 'Se siente elástica y confortable todo el día',
 ARRAY['hidratación','retención','confort']),

('Efecto plumping',
 'Relleno viscoelástico superficial',
 'Tu piel vuelve a tener volumen propio',
 'Vuelves a verte con cara llena, sin artificios',
 ARRAY['volumen','plumping','rellena']),

('Bioestimulación natural',
 'Activación de procesos biológicos propios de la piel',
 'Tu piel hace lo que sabe hacer… cuando se lo permites',
 'La diferencia es que esto lo hace tu propia piel',
 ARRAY['bioestimulación','natural','activación']);

-- ================================================
-- VISTA: motor de respuesta rápida
-- Para el agente: dado un tag, devuelve todo lo necesario
-- ================================================

CREATE VIEW ai_response_engine AS
SELECT
  si.line,
  si.age_group,
  si.technical_concept,
  si.yadala_translation,
  si.desire_level_1,
  si.desire_level_2,
  si.sensoriality,
  si.tags,
  si.priority,
  vf_hook.content AS hook_sugerido,
  vf_insight.content AS insight_sugerido,
  vf_sensorial.content AS sensorial_sugerido
FROM skin_insights si
LEFT JOIN voice_fragments vf_hook
  ON vf_hook.type = 'hook'
  AND (vf_hook.line = si.line OR vf_hook.line IS NULL)
  AND vf_hook.tags && si.tags
LEFT JOIN voice_fragments vf_insight
  ON vf_insight.type = 'insight'
  AND vf_insight.tags && si.tags
LEFT JOIN voice_fragments vf_sensorial
  ON vf_sensorial.type = 'sensorial'
  AND (vf_sensorial.line = si.line OR vf_sensorial.line IS NULL)
  AND vf_sensorial.tags && si.tags
ORDER BY si.priority DESC;

-- ================================================
-- RLS
-- ================================================

ALTER TABLE skin_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_language_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_translation ENABLE ROW LEVEL SECURITY;

-- Lectura pública (el agente la necesita desde el frontend)
CREATE POLICY "Lectura pública skin_insights"
  ON skin_insights FOR SELECT TO anon USING (true);

CREATE POLICY "Lectura pública voice_fragments"
  ON voice_fragments FOR SELECT TO anon USING (true);

CREATE POLICY "Lectura pública competitor_translation"
  ON competitor_translation FOR SELECT TO anon USING (true);

-- Inserción pública solo en customer_language_inputs (para registrar lo que dice el cliente)
CREATE POLICY "Inserción pública customer_inputs"
  ON customer_language_inputs FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Lectura pública customer_inputs"
  ON customer_language_inputs FOR SELECT TO anon USING (true);
```

---

## Cómo usa el agente este motor

### Flujo de respuesta en WhatsApp o chat

```javascript
// 1. El cliente escribe algo
const clientInput = "tengo la piel apagada";

// 2. Buscar en customer_language_inputs por similitud
const { data: intent } = await supabase
  .from('customer_language_inputs')
  .select('*')
  .textSearch('input_text', clientInput)
  .limit(1);

// 3. Usar los tags para buscar en skin_insights
const tags = intent[0].linked_tags;
const { data: insights } = await supabase
  .from('skin_insights')
  .select('*')
  .overlaps('tags', tags)
  .order('priority', { ascending: false })
  .limit(3);

// 4. Buscar fragmentos de voz relevantes
const { data: hooks } = await supabase
  .from('voice_fragments')
  .select('*')
  .eq('type', 'hook')
  .overlaps('tags', tags)
  .limit(2);

// 5. Pasar todo a Claude API con el system prompt de voz Yadala
// Claude construye la respuesta final con la voz correcta
```

### Consulta directa útil para analítica

```sql
-- Top palabras que usan los clientes
SELECT input_text, frequency, line_hint
FROM customer_language_inputs
ORDER BY frequency DESC
LIMIT 20;

-- Insights más buscados por línea
SELECT line, technical_concept, yadala_translation, priority
FROM skin_insights
ORDER BY line, priority DESC;
```

---

Versión: 1.0 · Abril 2026 · YADALA AI Engine · Pedro Jordà
