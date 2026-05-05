# 🧠 BRIEFING INTERNO — SISTEMA YADALA AI
## Estado del proyecto · Mayo 2026
**Arquitectura:** Supabase → n8n → WhatsApp

Incluye todo:

Qué hace cada tabla y para qué sirve
Estado actual de lo cargado hoy
Pendientes urgentes (el RLS de follow_up_queue y la conexión n8n)
Próximos pasos para la siguiente sesión
Los 4 archivos SQL generados hoy para tener el backup
La lógica de negocio de cómo el agente identifica zonas y elige protocolos

---

## 🎯 OBJETIVO DEL SISTEMA

Construir un agente de inteligencia artificial que opere por WhatsApp y sea capaz de:

1. **Identificar automáticamente** qué zona facial le preocupa a la clienta — solo por cómo habla, sin que ella lo sepa
2. **Responder con empatía clínica** — usando el lenguaje emocional de la clienta, no tecnicismos
3. **Recomendar la línea Yadala correcta** (PREVENT / RECOVER / RECLAIM) según la zona y la edad
4. **Vender sin vender** — guiando la conversación de forma natural hacia el siguiente paso
5. **Operar en B2C** (clienta final) y **B2B** (esteticistas y centros de estética)

---

## 🏗️ ARQUITECTURA TÉCNICA

```
WhatsApp (mensaje entra)
    ↓
n8n (orquesta el flujo)
    ↓
Supabase (consulta la knowledge base)
    ↓
Claude API (genera la respuesta)
    ↓
WhatsApp (respuesta sale)
```

---

## 🗄️ BASE DE DATOS SUPABASE
### Proyecto: Plenamente Coaching / Yadala · PRODUCTION

### Tablas activas con contenido cargado hoy:

---

### 1. `skin_insights`
**Qué es:** La enciclopedia anatómica del agente. Una fila por zona facial.
**Para qué sirve:** El agente consulta esta tabla para entender qué está pasando biológicamente en la zona que menciona la clienta y cómo explicárselo en su idioma.

| Columna | Contenido |
|---------|-----------|
| `line` | PREVENT / RECOVER / RECLAIM |
| `age_group` | Rango de edad principal |
| `technical_concept` | Explicación anatómica real (para el agente, no para la clienta) |
| `yadala_translation` | Cómo lo explica Yadala en lenguaje de marca |
| `desire_level_1` | Deseo profundo principal de la clienta |
| `desire_level_2` | Deseo profundo secundario |
| `sensoriality` | Frase emocional / hook principal |
| `priority` | Prioridad por volumen de búsqueda (1-5) |
| `tags` | Array de palabras clave para búsqueda semántica |

**Estado:** ✅ 15 filas cargadas (una por zona anatómica)
**Zonas:** Comisuras · Frente · Ojeras · Mejillas · Nasogeniano · Entrecejo · Cuello/óvalo · Labios · Mandíbula · Párpado · Pómulo · Nariz/poros · Zona T · Contorno · Sienes

---

### 2. `voice_fragments`
**Qué es:** El banco de voces reales de clientas. 15 frases por zona.
**Para qué sirve:** El agente reconoce patrones de lenguaje — cuando una clienta dice algo parecido a una de estas frases, el agente sabe exactamente en qué zona está el dolor y qué intensidad emocional tiene.

| Columna | Contenido |
|---------|-----------|
| `type` | Nombre coloquial de la zona (ej: `comisuras_caidas`, `ojeras_bolsas`) |
| `content` | La frase exacta tal como la dice la clienta |
| `intensity` | Urgencia emocional del 1 (baja) al 5 (alta) |
| `tags` | Array de palabras clave semánticas |
| `line` | PREVENT / RECOVER / RECLAIM |

**Estado:** ✅ 225 filas cargadas (15 voces × 15 zonas)

---

### 3. `agent_skills`
**Qué es:** El cerebro operativo del agente. Aquí vive todo lo que el agente sabe hacer y cómo debe comportarse.
**Para qué sirve:** El agente consulta esta tabla para saber cómo responder, qué decir, qué no decir nunca, y cómo guiar cada tipo de conversación.

| Columna | Contenido |
|---------|-----------|
| `name` | Nombre del skill |
| `category` | Tipo: identidad / producto / venta / contenido / b2b / protocolo / conocimiento |
| `content` | El contenido completo del skill (texto largo) |
| `agent` | Array de agentes que pueden usar este skill |

**Skills cargados hoy (nuevos):**

| Nombre | Categoría | Agentes |
|--------|-----------|---------|
| Protocolo conversacion B2C — Clienta final | protocolo | whatsapp, ventas |
| Protocolo conversacion B2B — Esteticista y centros | protocolo | b2b, whatsapp, ventas |
| Resumen insights PREVENT — 4 zonas · 20-30 años | conocimiento | whatsapp, ventas, creador_contenido, b2b |
| Resumen insights RECOVER — 6 zonas · 30-45 años | conocimiento | whatsapp, ventas, creador_contenido, b2b |
| Resumen insights RECLAIM — 6 zonas · 45+ años | conocimiento | whatsapp, ventas, creador_contenido, b2b |
| Resumen estratégico global — 15 zonas · Claims · Frases potentes | conocimiento | todos |

**Skills ya existentes (anteriores, no tocados):**
- Identidad del agente (objetivos, alma CIRCA, voz de marca, sistemas PREVENT/RECOVER/RECLAIM)
- Producto (ingredientes, nomenclatura, beneficios biológicos, match Skin Analyzer)
- Venta (metamodelo Milton, objeciones)
- Contenido (reels, hooks, stories, bloques emocionales)
- B2B (sistema ventas, narrativa cabina, objeciones centros)

---

### Otras tablas activas en Supabase (contenido previo, no tocadas hoy):

| Tabla | Para qué sirve |
|-------|---------------|
| `clientes` | Registro de clientas y su historial |
| `skin_analyses` | Resultados del análisis Zemits VeraFace |
| `quiz_leads` | Leads captados por el quiz de piel |
| `lead_scoring` | Puntuación automática de leads |
| `conversions` | Registro de conversiones |
| `follow_up_queue` | Cola de seguimientos pendientes ⚠️ Sin RLS |
| `agent_memory` | Memoria persistente del agente por clienta |
| `b2b_centros` | Registro de centros de estética |
| `customer_language_inputs` | Frases en lenguaje natural de las clientas |
| `competitor_translation` | Cómo traducir lo que dice la competencia |
| `beneficios visibles y emocionales` | Beneficios por línea |
| `biological processes` | Procesos biológicos que activa Yadala |
| `nombres funcionales` | Nomenclatura pública de ingredientes |
| `puntos de dolor y necesidades de piel` | Mapa de dolores |
| `recomendacion linea` | Lógica de recomendación PREVENT/RECOVER/RECLAIM |
| `segmentacion clientes` | Segmentación por perfil |
| `yadala lines` | Descripción de las 3 líneas |
| `voice_fragments` | ✅ Cargado hoy |
| `skin_insights` | ✅ Cargado hoy |

---

## ⚠️ PENDIENTES Y MEJORAS IDENTIFICADAS

### Urgente
- [ ] **`follow_up_queue` sin RLS** — Activar Row Level Security para no exponer datos con la anon key
- [ ] **Conectar Supabase con n8n** — Configurar los nodos de consulta a las tablas principales

### Próxima sesión
- [ ] **Construir el flujo n8n** — Webhook WhatsApp → consulta Supabase → Claude API → respuesta
- [ ] **Lógica de identificación de zona** — Matching entre mensaje de la clienta y `voice_fragments` por tags
- [ ] **Lógica de selección de skill** — El agente elige el protocolo correcto según si es B2C o B2B
- [ ] **Memoria por clienta** — Poblar `agent_memory` para que el agente recuerde conversaciones anteriores

### Mejoras futuras
- [ ] Añadir embeddings vectoriales a `voice_fragments` y `skin_insights` para búsqueda semántica real (pgvector)
- [ ] Conectar `skin_analyses` del Zemits VeraFace con el agente — que el agente pueda leer el análisis y personalizar la respuesta
- [ ] Sistema de lead scoring automático desde n8n
- [ ] Dashboard de métricas de conversación

---

## 📁 ARCHIVOS SQL GENERADOS (guardar en /sql)

| Archivo | Contenido |
|---------|-----------|
| `01_skin_insights.sql` | INSERT 15 zonas → `skin_insights` |
| `02_voice_fragments.sql` | INSERT 225 voces → `voice_fragments` |
| `03_agent_skills_protocolos.sql` | INSERT protocolos B2C + B2B → `agent_skills` |
| `04_agent_skills_insights.sql` | INSERT resúmenes PREVENT + RECOVER + RECLAIM + Global → `agent_skills` |

---

## 🔑 LÓGICA DE NEGOCIO CLAVE

### Cómo el agente identifica la zona
1. Recibe el mensaje de la clienta
2. Busca en `voice_fragments` por similitud de tags y type
3. Identifica la zona con mayor match
4. Consulta `skin_insights` para esa zona
5. Selecciona el protocolo correcto (B2C o B2B) de `agent_skills`
6. Genera la respuesta con el lenguaje correcto

### Las 3 líneas y su público
| Línea | Edad | Entrada | Dolor principal |
|-------|------|---------|----------------|
| PREVENT | 20-30 | Poros + pantallas | Estrés digital, textura, brillo |
| RECOVER | 30-45 | Surco + ojeras | Piel que ya no responde |
| RECLAIM | 45+ | Óvalo + pómulo | Pérdida estructural, menopausia |

---

*Yadala AI System · Briefing interno · Mayo 2026*
*Arquitectura: Supabase → n8n → WhatsApp*
