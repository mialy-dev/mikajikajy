export async function sendResetEmail(to, link) {
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "E-KAJY", email: process.env.MAIL_FROM },
      to: [{ email: to }],
      subject: "Réinitialisation de votre mot de passe E-KAJY",
      htmlContent: `
        <p>Cliquez sur ce lien pour choisir un nouveau mot de passe (valable 30 minutes) :</p>
        <p><a href="${link}">Réinitialiser mon mot de passe</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>`,
    }),
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}`);
}