# RESUMEN WORKFLOWS YADALA — n8n
**Archivo:** `05-agentes-ia/n8n-workflows/WF-resumen-workflows.md`
**Versión:** 1.0 · Abril 2026

---

## WF1 — Agente Investigación + Contenido
**Estado:** ✅ Publicado y funcionando
**Trigger:** Lunes 7am (cron automático)

| Nodo | Tipo | Función |
|------|------|---------|
| 1. Trigger Lunes 7am | Schedule | Dispara el workflow cada lunes a las 7am |
| 2. Agente Investigador | HTTP Request → Claude API | Investiga tendencias IG de skincare natural esa semana |
| 3. Preparar Body | Code | Construye el prompt con las tendencias para el agente creador |
| 4. Agente Creador Contenido | HTTP Request → Claude API | Genera 5 guiones de reels listos para grabar |
| 5. Preparar contenido Word | Code | Formatea el contenido para email |
| 5b. Formatear HTML | Code | Da formato HTML al email |
| 6. Enviar email con guiones | Gmail | Envía los 5 guiones por email a Pedro |
| 7. Notificación WhatsApp | HTTP Request | Notifica a Pedro por WhatsApp que los reels están listos |

---

## WF2 — Quiz + Captura de Leads
**Estado:** ✅ Webhook en producción funcionando
**Trigger:** Nuevo lead en tabla `quiz_leads` de Supabase

| Nodo | Tipo | Función |
|------|------|---------|
| 1. Webhook | Webhook | Recibe notificación de Supabase cuando entra nuevo lead |

**Pendiente añadir:**
- Nodo notificación WhatsApp a Pedro con datos del lead
- Nodo scoring inicial del lead

**Flujo completo:**
```
Lead hace quiz → Supabase (quiz_leads) → Webhook → n8n → (WhatsApp Pedro pendiente)
```

---

## WF3 — Agente WhatsApp Conversacional
**Estado:** ⬜ Montado, pendiente número WhatsApp
**Trigger:** Mensaje entrante por WhatsApp

| Nodo | Tipo | Función |
|------|------|---------|
| 1. Webhook | Webhook | Recibe mensaje de WhatsApp |
| 2. Extraer datos mensaje | Code | Normaliza user_id, message y channel |
| 3. Consultar memoria lead | HTTP Request → Supabase | Recupera historial del lead (agent_memory) |
| 4. Consultar lead scoring | HTTP Request → Supabase | Recupera temperatura del lead (cold/warm/hot) |
| 5. Calcular contexto lead | Code | Combina memoria + scoring + determina stage |
| 6. Temperature Router | Switch | Enruta según temperatura: HOT / WARM / COLD |
| 7a. Claude HOT | HTTP Request → Cloudflare Proxy | Prompt de cierre suave para lead caliente |
| 7b. Claude WARM | HTTP Request → Cloudflare Proxy | Prompt de educación para lead templado |
| 7c. Claude COLD | HTTP Request → Cloudflare Proxy | Prompt de conexión para lead frío |
| 8. Extraer respuesta Claude | Code | Extrae el texto de respuesta de Claude |
| 9. Actualizar memoria lead | HTTP Request → Supabase | Guarda conversación en agent_memory |
| 10. Enviar respuesta WhatsApp | HTTP Request → Meta API | Envía respuesta al lead por WhatsApp |

**Para activar:** Añadir URL Meta API y token en nodo 10

---

## WF4 — Outreach B2B Centros Lanzarote
**Estado:** ⬜ Pendiente de crear

**Función:** Contactar centros de estética y spas de Lanzarote con dossier personalizado

**Nodos previstos:**
- Trigger manual o lista de centros en Supabase
- Claude genera email personalizado por centro
- Gmail envía email con dossier
- Supabase registra contacto en tabla distribuidores

---

## WF5 — Scoring de Leads
**Estado:** ⬜ Pendiente de crear

**Función:** Clasificar leads en cold/warm/hot según comportamiento

**Nodos previstos:**
- Trigger: nuevo mensaje o interacción
- Code calcula score según señales
- Supabase actualiza lead_scoring
- Router activa secuencia según temperatura

---

## Infraestructura conectada

| Servicio | Función | Estado |
|---------|---------|--------|
| Supabase | Base de datos leads, memoria, scoring | ✅ |
| Claude API | Generación de respuestas IA | ✅ vía Cloudflare |
| Cloudflare Worker | Proxy Claude API + Resend | ✅ |
| Resend | Envío de emails automáticos | ✅ |
| GitHub Pages | Quiz online | ✅ |
| WhatsApp Business API | Agente conversacional | ⬜ pendiente número |
| Gmail | Envío emails contenido | ✅ |

---

## URLs clave del proyecto

```
Quiz online: https://bienvenidoamentalengineering-cyber.github.io/yadala-skin-analyzer/
GitHub repo: https://github.com/bienvenidoamentalengineering-cyber/yadala-skin-analyzer
Cloudflare proxy: https://yadala-proxy.bienvenidoamentalengineering.workers.dev
Supabase: https://qbvltetexymyrvscbbai.supabase.co
n8n: https://plenamente-n8n.veeqox.easypanel.host
```

---

Versión: 1.0 · Abril 2026 · YADALA · Pedro Jordà
