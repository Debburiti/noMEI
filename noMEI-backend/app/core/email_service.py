import smtplib
from email.message import EmailMessage

from app.config import settings


class EmailService:
    def send_password_reset_email(self, to_email: str, reset_link: str) -> None:
        subject = "Redefinição de senha - noMEI"

        text_content = f"""
Olá,

Recebemos uma solicitação para redefinir a sua senha.

Acesse o link abaixo para cadastrar uma nova senha:
{reset_link}

Este link expira em 15 minutos.

Se você não solicitou essa alteração, ignore este email.

Atenciosamente,
Equipe noMEI
""".strip()

        html_content = f"""
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
    <h2>Redefinição de senha</h2>
    <p>Recebemos uma solicitação para redefinir a sua senha.</p>
    <p>
      Clique no botão abaixo para cadastrar uma nova senha:
    </p>
    <p>
      <a
        href="{reset_link}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #0d6efd;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Redefinir senha
      </a>
    </p>
    <p>Ou copie e cole este link no navegador:</p>
    <p>{reset_link}</p>
    <p><strong>Este link expira em 15 minutos.</strong></p>
    <p>Se você não solicitou essa alteração, ignore este email.</p>
    <p>Atenciosamente,<br>Equipe noMEI</p>
  </body>
</html>
""".strip()

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
        message["To"] = to_email
        message.set_content(text_content)
        message.add_alternative(html_content, subtype="html")

        if not settings.smtp_host or not settings.smtp_username:
            return

        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port) as smtp:
            smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)