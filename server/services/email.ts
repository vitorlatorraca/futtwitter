import { Resend } from "resend";

// ============================================
// EMAIL SERVICE (Resend)
// Configure via .env:
//   RESEND_API_KEY — chave da API Resend (https://resend.com/api-keys)
//   EMAIL_FROM     — endereço remetente (precisa de domínio verificado em prod)
//   APP_URL        — URL base do app (ex: https://futtwitter.com)
//
// Sem RESEND_API_KEY o link de reset é impresso no console
// (útil para desenvolvimento local).
// ============================================

const resendClient: Resend | null = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? "Tribuna <noreply@futtwitter.com>";

const APP_URL = (
  process.env.APP_URL ??
  process.env.CLIENT_URL ??
  "http://localhost:5000"
).replace(/\/$/, "");

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
): Promise<void> {
  const resetUrl = `${APP_URL}/redefinir-senha?token=${resetToken}`;
  const expiresInMinutes = 60;

  // Tribuna newsletter-style email: paper canvas (#F2ECDE), ink text (#0F1115),
  // floodlight CTA (#FF4B1F). Mirrors the visual brand defined in
  // design_handoff_tribuna_rebrand/README.md.
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2ECDE;font-family:Georgia,'Times New Roman',serif;color:#0F1115;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F2ECDE;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FBF7EC;border-radius:12px;border:1px solid #E2D9C3;overflow:hidden;">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #E2D9C3;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:10px;">
                <div style="display:inline-block;background:#0F1115;color:#F2ECDE;width:32px;height:32px;border-radius:6px;text-align:center;line-height:32px;font-size:20px;font-weight:800;font-family:Georgia,serif;">T</div>
              </td>
              <td>
                <p style="margin:0;font-size:22px;font-weight:700;color:#0F1115;letter-spacing:-0.025em;font-family:Georgia,'Times New Roman',serif;">tribuna</p>
                <p style="margin:2px 0 0;font-size:9px;color:#6A6F7A;letter-spacing:0.22em;text-transform:uppercase;font-family:'Courier New',monospace;">O jornal que conversa</p>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#0F1115;font-family:Georgia,'Times New Roman',serif;letter-spacing:-0.022em;">
              Redefinir senha
            </h1>
            <p style="margin:0 0 24px;font-size:15px;color:#353941;line-height:1.55;">
              Recebemos um pedido para redefinir a senha da sua conta.
              Clique no botão abaixo para criar uma nova senha.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 24px;background:#0F1115;color:#F2ECDE;font-weight:600;font-size:14px;text-decoration:none;border-radius:999px;font-family:Georgia,serif;">
              Redefinir minha senha <span style="color:#FF4B1F;">→</span>
            </a>
            <p style="margin:24px 0 0;font-size:13px;color:#6A6F7A;line-height:1.5;">
              Este link expira em <strong style="color:#353941;">${expiresInMinutes} minutos</strong>.
              Se você não solicitou a redefinição, ignore este email — sua senha não será alterada.
            </p>
            <p style="margin:16px 0 0;font-size:11px;color:#9CA0AB;word-break:break-all;font-family:'Courier New',monospace;">
              Ou copie e cole este link no navegador:<br>
              <span style="color:#6A6F7A;">${resetUrl}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px;border-top:1px solid #E2D9C3;">
            <p style="margin:0;font-size:10px;color:#9CA0AB;letter-spacing:0.14em;text-transform:uppercase;font-family:'Courier New',monospace;">
              © ${new Date().getFullYear()} Tribuna · Todos os direitos reservados
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Redefinir senha — Tribuna\n\nAcesse o link abaixo para criar uma nova senha:\n${resetUrl}\n\nEste link expira em ${expiresInMinutes} minutos.\n\nSe você não solicitou, ignore este email.`;

  if (!resendClient) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[EMAIL - DEV] Resetar senha para:", toEmail);
    console.log("[EMAIL - DEV] Link:", resetUrl);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

  const { error } = await resendClient.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: "Redefinir senha — Tribuna",
    html,
    text,
  });

  if (error) {
    console.error("[email] Resend send failed:", error);
    throw new Error(`Falha ao enviar email: ${error.message ?? "unknown"}`);
  }
}
