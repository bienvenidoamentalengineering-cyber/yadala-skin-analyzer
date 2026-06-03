# YADALA — Proyecto Empresarial 2026
> *"La piel es el espejo del alma"*  
> Fundador: Pedro Jordà · Lanzarote, Canarias · Iniciado: Abril 2026

---

## ¿Qué es YADALA?

YADALA es una marca de cosmética funcional y consciente basada en una fórmula ancestral transmitida durante **4 generaciones**. La mascarilla facial activa la biointeligencia de la piel mediante bioestimulación natural: tonificación muscular, activación de fibroblastos y oxigenación tisular profunda.

**Tres líneas de comunicación. Un solo producto:**
- `PREVENT` — 20–30 años · Activa. Previene. Potencia.
- `RECOVER` — 30–45 años · Redefine. Reactiva. Revive.
- `RECLAIM` — 45+ años · Reafirma. Ilumina. Inspira.

---

## Estructura del proyecto

```
yadala-project/
├── 01-legal/               → SL, NDAs, registros de marca y fórmula
├── 02-producto/            → Fórmulas, certificaciones, packaging
├── 03-marca/               → Narrativa, identidad visual, avatares, pilares
├── 04-digital/             → Web, Skin Analyzer, Supabase, email
├── 05-agentes-ia/          → Prompts, workflows n8n, integraciones
├── 06-ventas/              → Dossier B2B, CRM, distribuidores
├── 07-marketing/           → Calendario, guiones, redes sociales
└── 08-expansion-global/    → UK, Francia, LATAM, mercado Halal
```

---

## Prioridades 2026

### Q2 (Mayo–Junio) — POSICIONAMIENTO DE MARCA ← FOCO ACTUAL
- [ ] Identidad visual definitiva (logo, paleta, tipografía)
- [ ] Perfiles Instagram + TikTok activos y optimizados
- [ ] Primeros 20 reels publicados (banco de contenido)
- [ ] Web Yadala live con tienda + skin quiz
- [ ] 6 agentes IA operativos

### Q3 (Julio–Septiembre) — VENTAS & TRACCIÓN
- [ ] 10 centros de estética distribuidores firmados
- [ ] Programa microinfluencers (50 perfiles)
- [ ] Newsletter mensual activa
- [ ] Amazon EU activo

### Q4 (Octubre–Diciembre) — EXPANSIÓN INTERNACIONAL
- [ ] Distribuidores UK + Francia + México/Colombia
- [ ] Materiales en árabe (mercado Halal)
- [ ] 50 distribuidores · 500 clientes finales

---

## Los 6 Agentes IA de Yadala

| Agente | Función | Stack |
|--------|---------|-------|
| `agente-contenido` | Genera reels, captions, calendarios | Claude API + n8n |
| `skin-analyzer` | Quiz piel → recomienda línea | Claude API + Supabase |
| `agente-ventas-b2b` | Outreach centros estética/spas | n8n + Gmail |
| `agente-atencion-cliente` | WhatsApp + web multilingüe | WhatsApp API + Claude |
| `agente-analitica` | KPIs semanales + informes | n8n + Postgres |
| `agente-expansion` | Regulaciones + distribuidores globales | Claude API + web search |

---

## Stack tecnológico

- **IA:** Claude API (claude-sonnet-4-6)
- **Automatización:** n8n (self-hosted o cloud)
- **Base de datos:** Supabase (Postgres)
- **Web/Ecommerce:** Next.js + Shopify (TBD)
- **Email:** Resend o Mailchimp
- **CRM:** Notion o Airtable
- **Redes:** Instagram + TikTok

---

## Variables de entorno (.env)

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# WhatsApp Business API
WHATSAPP_TOKEN=...
WHATSAPP_PHONE_ID=...

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_ACCOUNT_ID=...

# Email
RESEND_API_KEY=re_...

# n8n
N8N_WEBHOOK_URL=https://...
```

---

## Cómo usar este proyecto

1. Clona o descarga esta carpeta en VSCode
2. Copia `.env.example` → `.env` y rellena tus keys
3. Sigue el orden de carpetas (01 → 08) para implementar
4. Cada carpeta tiene su propio `README.md` con instrucciones

---

## Contacto
**Pedro Jordà Carreres** · Fundador YADALA  
📍 Costa Teguise, Lanzarote · Las Palmas  
📧 Pedrojorda.me.amdon@gmail.com  
📱 +34 644 799 223

---

*Fórmula protegida como secreto comercial. Todos los documentos bajo NDA.*
