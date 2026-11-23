// Envoi via l'API Brevo (Node 18+ pour fetch). N'envoie rien si Brevo n'est pas configuré.
async function sendMail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error("[mailer] Brevo non configuré : définir BREVO_API_KEY et MAIL_FROM_EMAIL dans .env. E-mail NON envoyé.");
    return false;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { email: fromEmail, name: process.env.MAIL_FROM_NAME || "E-KAJY" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error(`[mailer] Brevo a refusé l'envoi (HTTP ${res.status}).`);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mailer] Erreur réseau Brevo :", e.message);
    return false;
  }
}

function resetEmailHtml(link) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#18304F">
    <h2>Réinitialisation de votre mot de passe</h2>
    <p>Vous avez demandé à réinitialiser votre mot de passe E-KAJY. Ce lien est valable 30 minutes et ne peut être utilisé qu'une seule fois.</p>
    <p><a href="${link}" style="background:#E52327;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Choisir un nouveau mot de passe</a></p>
    <p style="font-size:12px;color:#64748B">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
  </div>`;
}

export { sendMail, resetEmailHtml };