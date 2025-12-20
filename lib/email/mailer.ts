import nodemailer from 'nodemailer'

type MailOptions = {
  to: string
  subject: string
  html?: string
  text?: string
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  return transporter
}

export async function sendMail(opts: MailOptions) {
  try {
    const t = getTransporter()
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com'
    await t.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html, text: opts.text })
  } catch (err) {
    console.error('Send mail error', err)
  }
}

export default sendMail
