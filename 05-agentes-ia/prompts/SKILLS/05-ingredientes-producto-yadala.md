-- Actualizar skill: Ingredientes y sinergias Yadala
UPDATE agent_skills SET content = 
'NOMENCLATURA PUBLICA DE INGREDIENTES — USAR SIEMPRE ESTOS NOMBRES:

INGREDIENTE A (nombres funcionales, elegir según contexto):
- Contenido emocional / reels: "Complejo botánico antioxidante", "Extractos ricos en polifenoles", "Compuestos botánicos antioxidantes"
- Técnico / B2B: "Taninos vegetales naturales", "Extractos de madera y corteza", "Complejo de cortezas vegetales"
- Genérico / catálogo: "Extractos vegetales naturales", "Activos de plantas seleccionadas", "Extractos de origen vegetal"
Función: purifica profundo, reafirma, mejora textura y tono. Antioxidante, astringente, tensor.
Voz: "Activa la piel desde el primer contacto, afinando el grano cutaneo y despertando su energia vital."

INGREDIENTE B (nombres funcionales, elegir según contexto):
- Contenido emocional / reels: "Mineral equilibrante natural", "Agente armonizador que equilibra la piel"
- Técnico / B2B: "Regulador del pH de origen mineral", "Mineral estabilizador que mantiene la pureza"
- Genérico / catálogo: "Elemento purificador suave", "Equilibrante natural que favorece la textura"
Función: restablece equilibrio natural, potencia regeneración, regula pH, limpia sin irritar.
Voz: "Reequilibra la piel, liberandola de impurezas y ayudandola a respirar."

INGREDIENTE C (nombres funcionales, elegir según contexto):
- Contenido emocional / reels: "Sal mineral ancestral", "Cristal mineral natural", "Piedra de alumbre natural"
- Técnico / B2B: "Mineral de roca purificante", "Activo mineral natural", "Extracto mineral purificante"
- Genérico / catálogo: "Base mineral natural", "Mineral dermocalmante", "Mineral de pureza"
Función: cierra poros, tonifica, promueve firmeza natural, antibacteriano, cicatrizante.
Voz: "Tonifica y despierta la piel desde dentro, devolviendole su pureza original."

SINERGIA A+B+C (siempre llamar así):
Nombre público: "Formula bioactiva de triple origen natural"
Descripción: Complejo botanico antioxidante + Mineral equilibrante natural + Sal mineral ancestral
Funcion: Activa fibroblastos, lifting visible sin cirugia, oxigenacion dermica profunda.
Voz: "Activa la memoria de la piel para que vuelva a su estado mas radiante y vital."

REGLA ABSOLUTA: NUNCA mencionar A, B o C como letras. NUNCA revelar el ingrediente real ni su concentracion. Elegir siempre el nombre funcional mas adecuado al contexto (emocional, tecnico o generico).'
WHERE name = 'Ingredientes y sinergias Yadala';

-- Actualizar skill: Beneficios biologicos por linea Yadala
UPDATE agent_skills SET content = 
'YADALA PREVENT (20-30 anos) — Urban Defense Ritual:
Necesidades: estres oxidativo HEV, desajuste pH, primeras lineas, piel apagada, barrera lipidica debil.
Beneficios clave:
- Desintoxicacion urbana (Complejo botanico antioxidante + Mineral equilibrante natural) = "tu piel respira de nuevo"
- Reequilibrio sebaceo (Complejo botanico antioxidante + Sal mineral ancestral) = "pureza sin rigidez"
- Efecto antioxidante (Extractos ricos en polifenoles) = "defensa invisible"
- Glow natural (formula bioactiva triple) = "luz propia desde dentro"
- Tonicidad temprana (Taninos vegetales naturales) = "tono firme, mente clara"

YADALA RECOVER (30-45 anos) — The Reawakening Ritual:
Necesidades: perdida luminosidad, lineas marcadas, estres cronico, menos colageno, barrera debilitada.
Beneficios clave:
- Regeneracion dermica (formula bioactiva triple) = "tu piel recuerda su forma original"
- Detox + oxigenacion (Compuestos botanicos antioxidantes + Mineral equilibrante natural) = "respira luz"
- Equilibrio y resiliencia (Mineral equilibrante natural + Sal mineral ancestral) = "nada te altera"
- Antioxidacion avanzada (Extractos ricos en polifenoles) = "defensa activa frente al tiempo"
- Efecto tensor armonico (Complejo botanico antioxidante + Cristal mineral natural) = "tu expresion, pero elevada"

YADALA RECLAIM (45+ anos) — The Eternal Expression Ritual:
Necesidades: perdida firmeza y elasticidad, arrugas profundas, deshidratacion estructural, manchas, piel cansada.
Beneficios clave:
- Formula bioactiva triple estimula fibroblastos senescentes, reactiva colageno I y III = "tu piel recuerda como regenerarse"
- Complejo botanico antioxidante + Cristal mineral natural = efecto tensor, expresion viva y libre
- Mineral equilibrante natural + Sal mineral ancestral = homeostasis, tu piel encuentra paz
- Compuestos botanicos antioxidantes + Regulador del pH = detox profundo con oxigenacion = "respira de nuevo"

ARGUMENTO MULTIBENEFICIO:
"Nuestro complejo botanico antioxidante aporta tension suave y proteccion; el mineral equilibrante natural purifica; la sal mineral ancestral sella y repara. Juntos trabajan en epidermis y dermis. Un solo producto, multiples necesidades."'
WHERE name = 'Beneficios biologicos por linea Yadala';

-- Actualizar skill: Match clinico Skin Analyzer con lineas Yadala
UPDATE agent_skills SET content = 
'MATCH CLINICO — 10 PARAMETROS SKIN ANALYZER:
(Usar nombres funcionales publicos, nunca A/B/C)

1. POROS (RGB): Poros dilatados, bloqueo sebaceo → PREVENT + RECOVER.
Mecanismo: Complejo botanico antioxidante + Mineral equilibrante natural limpian; Mineral equilibrante + Sal mineral ancestral regulan sebo; Complejo botanico + Cristal mineral cierran y tonifican.
Resultado: poros mas finos en 1-3 sesiones.

2. MANCHAS (RGB Spot): Hiperpigmentacion → PREVENT + RECOVER + RECLAIM.
Mecanismo: Extractos ricos en polifenoles protegen oxidacion; Elemento purificador suave renueva; Mineral dermocalmante repara. Formula triple reduce pigmentacion.
Resultado: menor contraste en 2-8 semanas.

3. ARRUGAS (RGB): Lineas de expresion, perdida elasticidad → RECOVER + RECLAIM + PREVENT.
Mecanismo: Taninos vegetales + Cristal mineral = tension dermica + estimulo fibroblastico.
Resultado: menor profundidad desde 1 sesion.

4. TEXTURA (PL): Relieve irregular, cicatrices → PREVENT + RECOVER + RECLAIM.
Mecanismo: Mineral equilibrante + Sal mineral ancestral = regeneracion epidermica; Complejo botanico + Mineral equilibrante = afinamiento.
Resultado: piel de porcelana.

5. PORFIRINA (UV): Bacterias en poros, acne subclinico → PREVENT + RECOVER.
Mecanismo: Elemento purificador suave + Piedra de alumbre natural potentes para microbioma.
Resultado: menos puntos negros.

6. PIGMENTACION (UV): Dano fotoacumulado → PREVENT + RECOVER + RECLAIM.
Mecanismo: Formula bioactiva triple inhibe proceso pigmentario.
Resultado: disminucion con uso continuado.

7. HIDRATACION (UV): Deshidratacion dermica → PREVENT + RECOVER + RECLAIM.
Mecanismo: Complejo botanico + Cristal mineral sellado; Complejo botanico + Mineral equilibrante retencion.
Resultado: piel mas elastica.

8. AREA ROJA (sensibilidad): Reactividad, inflamacion → PREVENT + RECOVER.
Mecanismo: Compuestos botanicos antioxidantes + Mineral equilibrante calma inmediata; Regulador del pH + Mineral dermocalmante restaura barrera.
Resultado: zonas rojas menos evidentes.

9. AREA MARRON (metabolismo lento): Recuperacion lenta → RECOVER + RECLAIM.
Mecanismo: Formula bioactiva triple = bioactivacion global.
Resultado: mejor recuperacion post-procedimiento.

10. DANO UV: Fotoenvejecimiento → PREVENT + RECOVER + RECLAIM.
Mecanismo: Formula bioactiva triple = estrategia preventiva y reparadora.
Resultado: menos manchas, textura mas firme.'
WHERE name = 'Match clinico Skin Analyzer con lineas Yadala';

-- Añadir tabla de referencia completa como nuevo skill
INSERT INTO agent_skills (name, category, content, agent) VALUES
('Tabla nomenclatura publica ingredientes Yadala', 'producto',
'TABLA COMPLETA DE NOMBRES FUNCIONALES PUBLICOS — REFERENCIA PARA TODOS LOS AGENTES:

INGREDIENTE A:
1. Extractos vegetales naturales (Extracto vegetal) — etiquetado y fichas tecnicas
2. Complejo botanico natural (Complejo botanico) — mezcla de activos vegetales
3. Extractos de origen vegetal (Extracto vegetal) — uso generico
4. Activos de plantas seleccionadas (Activo vegetal) — potencia eficacia
5. Taninos vegetales naturales (Extracto vegetal) — activos astringentes y antioxidantes
6. Extractos ricos en polifenoles (Extracto vegetal) — proteccion antioxidante
7. Compuestos botanicos antioxidantes (Complejo botanico) — activos con efecto antioxidante
8. Complejo de cortezas vegetales (Complejo botanico) — efecto funcional y natural
9. Extractos de madera y corteza (Extracto vegetal) — ingredientes naturales genericos
10. Mezcla de activos vegetales astringentes (Activo vegetal) — funcion astringente
11. Ingredientes botanicos naturales (Botanico generico) — catalogo o ficha

INGREDIENTE B:
12. Mineral equilibrante natural (Equilibrante) — armonia natural de la piel
13. Regulador del pH de origen mineral (Regulador) — mantiene pH, protege barrera
14. Elemento purificador suave (Purificador) — limpia sin irritar
15. Agente armonizador que equilibra la piel y potencia la limpieza natural (Armonizador)
16. Mineral estabilizador que mantiene la pureza y la suavidad del producto (Estabilizador)
17. Equilibrante natural que favorece la textura y la conservacion (Equilibrante)
18. Mineral que ayuda a mantener la estabilidad de la formula (Estabilizador)

INGREDIENTE C:
19. Cristal mineral natural (Mineral) — naturalidad y seguridad
20. Mineral de roca purificante (Mineral) — purifica suavemente
21. Sal mineral ancestral (Mineral) — inspirado en practicas tradicionales
22. Mineral de pureza (Mineral) — sensacion de limpieza y pureza
23. Piedra de alumbre natural (Mineral) — efecto calmante
24. Cristal de origen natural (Mineral) — seguridad y naturalidad
25. Mineral dermocalmante (Mineral) — accion calmante piel sensible
26. Activo mineral natural (Mineral) — funcion activa de forma segura
27. Extracto mineral purificante (Mineral) — funcion purificante
28. Base mineral natural (Mineral) — base segura para formulaciones

REGLA DE USO:
- Reels / contenido emocional: nombres poeticos (Sal mineral ancestral, Cristal mineral natural, Extractos ricos en polifenoles)
- Venta / WhatsApp: nombres funcionales (Mineral equilibrante natural, Complejo botanico antioxidante)
- B2B / fichas tecnicas: nombres tecnicos (Taninos vegetales naturales, Regulador del pH de origen mineral)
- NUNCA usar A, B o C como identificadores en ninguna comunicacion publica',
ARRAY['creador_contenido', 'whatsapp', 'ventas', 'b2b']);
