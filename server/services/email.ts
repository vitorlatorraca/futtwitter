import nodemailer from "nodemailer";

// ============================================
// EMAIL SERVICE
// Configure via .env:
//   EMAIL_HOST     — SMTP server (ex: smtp.gmail.com)
//   EMAIL_PORT     — SMTP port (default: 587)
//   EMAIL_SECURE   — "true" para TLS na porta 465
//   EMAIL_USER     — usuário SMTP (seu email)
//   EMAIL_PASS     — senha SMTP (ou App Password para Gmail)
//   EMAIL_FROM     — endereço remetente (ex: noreply@futtwitter.com)
//   APP_URL        — URL base do app (ex: https://futtwitter.com)
//
// Se EMAIL_HOST não estiver configurado, o link é impresso no console
// (útil para desenvolvimento sem SMTP).
// ============================================

function createTransport() {
  const host = process.env.EMAIL_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_PORT ?? "587", 10),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? `FUTTWITTER <noreply@futtwitter.com>`;

const APP_URL =
  (process.env.APP_URL ?? process.env.CLIENT_URL ?? "http://localhost:5000").replace(/\/$/, "");

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${APP_URL}/redefinir-senha?token=${resetToken}`;
  const expiresInMinutes = 60;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111;border-radius:16px;border:1px solid #222;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #222;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
              ⚽ FUTTWITTER
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#fff;">
              Redefinir senha
            </h1>
            <p style="margin:0 0 24px;font-size:15px;color:#aaa;line-height:1.6;">
              Recebemos um pedido para redefinir a senha da sua conta.
              Clique no botão abaixo para criar uma nova senha.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:999px;">
              Redefinir minha senha
            </a>
            <p style="margin:24px 0 0;font-size:13px;color:#666;line-height:1.6;">
              Este link expira em <strong style="color:#aaa;">${expiresInMinutes} minutos</strong>.
              Se você não solicitou a redefinição, ignore este email — sua senha não será alterada.
            </p>
            <p style="margin:16px 0 0;font-size:12px;color:#555;word-break:break-all;">
              Ou copie e cole este link no navegador:<br>
              <span style="color:#888;">${resetUrl}</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #222;">
            <p style="margin:0;font-size:12px;color:#555;">
              © ${new Date().getFullYear()} FUTTWITTER · Todos os direitos reservados
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Redefinir senha - FUTTWITTER\n\nAcesse o link abaixo para criar uma nova senha:\n${resetUrl}\n\nEste link expira em ${expiresInMinutes} minutos.\n\nSe você não solicitou, ignore este email.`;

  const transport = createTransport();

  if (!transport) {
    // Modo desenvolvimento: sem SMTP configurado — imprime link no console
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[EMAIL - DEV] Resetar senha para:", toEmail);
    console.log("[EMAIL - DEV] Link:", resetUrl);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

  await transport.sendMail({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: "Redefinir senha — FUTTWITTER",
    text,
    html,
  });
}
