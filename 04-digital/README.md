# 04 — Digital: Web, Skin Analyzer & Supabase

---

## Estructura

```
04-digital/
├── web/                   → Next.js o Shopify (pendiente decisión)
├── skin-analyzer/         → App YADALASKIN Analyzer (Claude API)
├── supabase/              → Esquemas SQL + instrucciones setup
└── email-marketing/       → Secuencias, templates, flujos
```

---

## Supabase — Tablas a crear

### Paso 1: Crear proyecto en supabase.com
1. New Project → nombre: `yadala-prod`
2. Región: EU (Frankfurt) — datos en Europa
3. Guardar la URL y las keys en `.env`

### Paso 2: Ejecutar este SQL en el Editor de Supabase

```sql
-- ===========================
-- YADALA DATABASE SCHEMA
-- ===========================

-- Tipos de piel / segmentos
CREATE TYPE skin_line AS ENUM ('PREVENT', 'RECOVER', 'RECLAIM', 'RECOVER_RECLAIM');

-- Análisis de piel del quiz
CREATE TABLE skin_analyses (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  session_id    TEXT,
  edad_rango    TEXT,
  preocupacion  TEXT,
  ritmo_vida    TEXT,
  cosmetica     TEXT,
  objetivo      TEXT,
  linea         skin_line,
  email         TEXT,
  marketing     BOOLEAN DEFAULT FALSE,
  fuente        TEXT DEFAULT 'web-quiz',
  convertido    BOOLEAN DEFAULT FALSE
);

-- Clientes finales (B2C)
CREATE TABLE clientes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  nombre        TEXT,
  email         TEXT UNIQUE NOT NULL,
  telefono      TEXT,
  pais          TEXT DEFAULT 'ES',
  linea         skin_line,
  pedidos       INTEGER DEFAULT 0,
  ltv           DECIMAL(10,2) DEFAULT 0,
  fuente        TEXT,
  activo        BOOLEAN DEFAULT TRUE
);

-- Distribuidores B2B
CREATE TABLE distribuidores (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  nombre        TEXT NOT NULL,
  tipo          TEXT, -- spa, centro_estetica, hotel, terapeuta
  ciudad        TEXT,
  pais          TEXT DEFAULT 'ES',
  email         TEXT,
  telefono      TEXT,
  estado        TEXT DEFAULT 'lead', -- lead, contactado, demo, activo, inactivo
  tarros_mes    INTEGER DEFAULT 0,
  notas         TEXT,
  proximo_contacto DATE
);

-- Pedidos
CREATE TABLE pedidos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  cliente_id    UUID REFERENCES clientes(id),
  distribuidor_id UUID REFERENCES distribuidores(id),
  tipo          TEXT, -- b2c, b2b
  linea         skin_line,
  cantidad      INTEGER NOT NULL,
  precio_unit   DECIMAL(10,2),
  total         DECIMAL(10,2),
  estado        TEXT DEFAULT 'pendiente', -- pendiente, enviado, entregado, devuelto
  tracking      TEXT
);

-- Contenido publicado (para el agente de analítica)
CREATE TABLE contenido (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  plataforma    TEXT, -- instagram, tiktok
  tipo          TEXT, -- reel, carrusel, story
  linea         skin_line,
  pilar         TEXT,
  hook          TEXT,
  url           TEXT,
  likes         INTEGER DEFAULT 0,
  comentarios   INTEGER DEFAULT 0,
  compartidos   INTEGER DEFAULT 0,
  reach         INTEGER DEFAULT 0,
  guardados     INTEGER DEFAULT 0
);

-- KPIs semanales
CREATE TABLE kpis_semanales (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  semana        DATE, -- lunes de la semana
  seguidores_ig INTEGER DEFAULT 0,
  seguidores_tt INTEGER DEFAULT 0,
  pedidos_b2c   INTEGER DEFAULT 0,
  pedidos_b2b   INTEGER DEFAULT 0,
  ingresos      DECIMAL(10,2) DEFAULT 0,
  leads_quiz    INTEGER DEFAULT 0,
  nuevos_distrib INTEGER DEFAULT 0
);
```

### Paso 3: Activar Row Level Security
Para cada tabla pública (skin_analyses, clientes), activar RLS en Supabase.

---

## Skin Analyzer — Implementación

El componente completo está en: `skin-analyzer/skin-analyzer-app.jsx`

Para generarlo: pide al agente "Crea el YADALASKIN Analyzer como app React con Claude API"

---

## Email Marketing — Secuencias automáticas

### Secuencia 1: Post-quiz (5 emails)
- Email 1 (inmediato): "Tu análisis de piel + tu línea recomendada"
- Email 3 (3 días): Educación sobre tu línea específica
- Email 7 (7 días): Historia de Pedro + origen Yadala
- Email 14 (2 semanas): Testimoniales de tu segmento
- Email 21 (3 semanas): Oferta especial primer pedido

### Secuencia 2: Post-compra (3 emails)
- Email 1: Confirmación + protocolo de uso
- Email 7: "¿Cómo va tu piel?" + tips semana 1
- Email 30: Reabastecimiento + fidelización
