// YADALA — Email post-quiz automático
// Archivo: 04-digital/email-marketing/send-email.js
// Ejecutar con: node send-email.js

const RESEND_API_KEY = 're_ApF7ejAN_4pksMTJSYc8nqDcYMSNSwbUk'; // ← pon tu key aquí
const EMAIL_FROM = 'onboarding@resend.dev'; // ← cuando tengas dominio: hola@yadala.com

// =============================================
// PLANTILLAS DE EMAIL POR LÍNEA
// =============================================

const emailTemplates = {

  PREVENT: {
    subject: 'Tu piel no está mal. Pero algo está empezando.',
    html: `
    <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#F7F3EE;color:#2C1F0E">
      
      <div style="text-align:center;margin-bottom:32px">
        <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B6F47;margin:0">YADALA · PREVENT</p>
      </div>

      <p style="font-size:18px;font-weight:normal;line-height:1.6;margin-bottom:24px">
        Tu piel ahora mismo está en su mejor momento.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        Pero hay algo que casi nadie te dice…
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        empieza a apagarse mucho antes de que lo notes.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        No es edad.<br>
        No es genética.<br>
        Es falta del estímulo correcto.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Los fibroblastos —las células que fabrican tu colágeno—<br>
        no se activan solos.<br><br>
        Si no los estimulas, se duermen.<br>
        Y tu piel empieza a perder ritmo sin que tú lo veas venir.
      </p>

      <div style="border-left:2px solid #C4A882;padding-left:20px;margin-bottom:32px">
        <p style="font-size:16px;font-style:italic;color:#8B6F47;margin:0">
          "Tu piel se apaga cuando tu ritmo se desordena."
        </p>
      </div>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Mañana te cuento exactamente cómo activarla.
      </p>

      <p style="font-size:14px;color:#8B6F47;margin:0">
        Pedro Jordà<br>
        <span style="font-size:12px;color:#C4A882">Fundador YADALA · 4 generaciones</span>
      </p>

      <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E8DDD0;text-align:center">
        <p style="font-size:11px;color:#C4A882;letter-spacing:1px">YADALA · La piel es el espejo del alma</p>
      </div>

    </div>`
  },

  RECOVER: {
    subject: 'Tu piel no está envejeciendo. Está perdiendo ritmo.',
    html: `
    <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#F7F3EE;color:#2C1F0E">
      
      <div style="text-align:center;margin-bottom:32px">
        <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B6F47;margin:0">YADALA · RECOVER</p>
      </div>

      <p style="font-size:18px;font-weight:normal;line-height:1.6;margin-bottom:24px">
        Hay una diferencia importante entre envejecer y perder ritmo.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        El envejecimiento es inevitable.<br>
        Perder ritmo… no lo es.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        Lo que sientes —esa pérdida de firmeza, ese cansancio en la cara—<br>
        no es que hayas "envejecido."
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Es que tus fibroblastos se están ralentizando.<br>
        Y el tono muscular de tu rostro está cayendo.<br><br>
        Ambas cosas tienen solución.<br>
        Sin agujas. Sin clínicas.
      </p>

      <div style="border-left:2px solid #C4A882;padding-left:20px;margin-bottom:32px">
        <p style="font-size:16px;font-style:italic;color:#8B6F47;margin:0">
          "Tu piel no está perdida.<br>Está esperando que la reactives."
        </p>
      </div>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Mañana te explico qué está pasando realmente<br>
        y cómo revertirlo de forma natural.
      </p>

      <p style="font-size:14px;color:#8B6F47;margin:0">
        Pedro Jordà<br>
        <span style="font-size:12px;color:#C4A882">Fundador YADALA · 4 generaciones</span>
      </p>

      <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E8DDD0;text-align:center">
        <p style="font-size:11px;color:#C4A882;letter-spacing:1px">YADALA · La piel es el espejo del alma</p>
      </div>

    </div>`
  },

  RECLAIM: {
    subject: 'Tu piel no necesita esconderse. Necesita estructura.',
    html: `
    <div style="font-family:'Georgia',serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#F7F3EE;color:#2C1F0E">
      
      <div style="text-align:center;margin-bottom:32px">
        <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B6F47;margin:0">YADALA · RECLAIM</p>
      </div>

      <p style="font-size:18px;font-weight:normal;line-height:1.6;margin-bottom:24px">
        Tu rostro tiene historia.<br>
        Tiene presencia.<br>
        Tiene expresión.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        Lo que ha perdido es el soporte que la mantenía firme.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Y eso —el soporte— se puede recuperar.<br>
        Sin borrar nada.<br>
        Sin congelar nada.
      </p>

      <div style="border-left:2px solid #C4A882;padding-left:20px;margin-bottom:32px">
        <p style="font-size:16px;font-style:italic;color:#8B6F47;margin:0">
          "No quiero parecer otra.<br>Quiero verme como yo."
        </p>
      </div>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:16px">
        Los fibroblastos no desaparecen.<br>
        Solo duermen.
      </p>

      <p style="font-size:15px;line-height:1.8;color:#4A3728;margin-bottom:32px">
        Mañana te cuento cómo despertarlos.
      </p>

      <p style="font-size:14px;color:#8B6F47;margin:0">
        Pedro Jordà<br>
        <span style="font-size:12px;color:#C4A882">Fundador YADALA · 4 generaciones</span>
      </p>

      <div style="margin-top:48px;padding-top:24px;border-top:1px solid #E8DDD0;text-align:center">
        <p style="font-size:11px;color:#C4A882;letter-spacing:1px">YADALA · La piel es el espejo del alma</p>
      </div>

    </div>`
  }
};

// =============================================
// FUNCIÓN PRINCIPAL DE ENVÍO
// =============================================

async function sendYadalaEmail(email, linea) {
  
  const template = emailTemplates[linea] || emailTemplates.RECOVER;
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: email,
        subject: template.subject,
        html: template.html
      })
    });

    const data = await response.json();
    
    if (data.id) {
      console.log(`✅ Email enviado a ${email} (línea ${linea}) · ID: ${data.id}`);
      return { success: true, id: data.id };
    } else {
      console.error('❌ Error:', data);
      return { success: false, error: data };
    }

  } catch (error) {
    console.error('❌ Error de red:', error);
    return { success: false, error };
  }
}

// =============================================
// TEST — enviar email de prueba
// =============================================

// Cambia el email y la línea para probar
sendYadalaEmail('pedronaya01@gmail.com', 'RECOVER');

// Para probar las 3 líneas:
// sendYadalaEmail('pedronaya01@gmail.com', 'PREVENT');
// sendYadalaEmail('pedronaya01@gmail.com', 'RECOVER');
// sendYadalaEmail('pedronaya01@gmail.com', 'RECLAIM');
