# 05 — Agentes IA de YADALA

Los 6 agentes que automatizan el lanzamiento y operación de la marca.

## Arquitectura general

```
Usuario / Trigger
      ↓
   n8n Workflow
      ↓
  Claude API (claude-sonnet-4-6)
      ↓
  Supabase (contexto + memoria)
      ↓
  Canal de salida (IG, WhatsApp, Gmail, Dashboard)
```

---

## Agente 1 — Creador de Contenido
**Archivo:** `prompts/01-agente-contenido.md`  
**Trigger:** manual o programado (lunes 9:00)  
**Output:** guiones de reels, captions, hashtags, calendario semanal  
**Canales:** Instagram + TikTok  

---

## Agente 2 — YADALASKIN Analyzer
**Archivo:** `prompts/02-skin-analyzer.md`  
**Trigger:** usuario rellena quiz en web  
**Output:** análisis de piel + recomendación Prevent/Recover/Reclaim + protocolo  
**Canal:** Web (integrado en 04-digital/skin-analyzer)  

---

## Agente 3 — Ventas B2B
**Archivo:** `prompts/03-agente-ventas-b2b.md`  
**Trigger:** nuevo lead en CRM o manual  
**Output:** email personalizado con dossier + seguimiento automático  
**Canal:** Gmail + CRM  

---

## Agente 4 — Atención al Cliente
**Archivo:** `prompts/04-agente-atencion-cliente.md`  
**Trigger:** mensaje entrante WhatsApp o web chat  
**Output:** respuesta personalizada en ES/EN/FR/AR  
**Canal:** WhatsApp Business API + web  

---

## Agente 5 — Analítica & KPIs
**Archivo:** `prompts/05-agente-analitica.md`  
**Trigger:** automático cada domingo 20:00  
**Output:** informe semanal con métricas + recomendaciones  
**Canal:** Email a Pedro + Notion dashboard  

---

## Agente 6 — Expansión Global
**Archivo:** `prompts/06-agente-expansion.md`  
**Trigger:** manual / por mercado objetivo  
**Output:** análisis regulatorio + lista distribuidores + materiales adaptados  
**Canal:** Google Drive + Email  

---

## Implementación paso a paso

1. Configurar `.env` con todas las API keys
2. Instalar n8n (cloud recomendado para empezar)
3. Importar workflows desde `n8n-workflows/`
4. Probar cada agente con datos reales
5. Activar triggers automáticos

## Estado actual

| Agente | Prompt | Workflow n8n | Integración | Estado |
|--------|--------|-------------|-------------|--------|
| Contenido | ✅ | ⬜ | ⬜ | En desarrollo |
| Skin Analyzer | ✅ | ⬜ | ⬜ | En desarrollo |
| Ventas B2B | ✅ | ⬜ | ⬜ | En desarrollo |
| Atención cliente | ✅ | ⬜ | ⬜ | En desarrollo |
| Analítica | ✅ | ⬜ | ⬜ | En desarrollo |
| Expansión | ✅ | ⬜ | ⬜ | En desarrollo |
