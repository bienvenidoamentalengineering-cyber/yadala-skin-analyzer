# WF4 — B2B Outreach Centros Estética

**Estado:** ⏳ Operativo parcial — falta número WhatsApp
**Trigger:** Cada día a las 10am hora Canarias
**Tabla Supabase:** b2b_centros

## Qué hace
1. Consulta centros activos sin contacto reciente
2. Prepara mensaje según fase (prospección/conversión/seguimiento)
3. Actualiza último_contacto en Supabase
4. Envía resumen diario a Pedro por email

## Pendiente
- Añadir nodo WhatsApp cuando llegue el número
- Poblar tabla b2b_centros con centros reales de Lanzarote

## Tabla b2b_centros
Campos: nombre, tipo, telefono, instagram, ciudad, fase, temperatura, ultimo_contacto, notas, activo