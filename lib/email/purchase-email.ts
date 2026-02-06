// app/lib/emails/purchase-email.ts

export type PurchaseReceiptEmailParams = {
  buyerName?: string
  buyerEmail: string
  reference: string
  amountKobo: number
  currency?: string // NGN
  propertyTitle?: string
  propertyId?: string
  paidAtIso?: string
}

export function generatePurchaseReceiptEmail(
  params: PurchaseReceiptEmailParams
) {
  const {
    buyerName,
    buyerEmail,
    reference,
    amountKobo,
    currency = 'NGN',
    propertyTitle,
    propertyId,
    paidAtIso,
  } = params

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://propertyvisionltd.com'

  const paidAt = paidAtIso ? new Date(paidAtIso) : new Date()
  const amountNaira = Number(amountKobo) / 100

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)

  const subject = `Payment Confirmed (${reference})`

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Reference', value: reference },
    { label: 'Amount', value: formatMoney(amountNaira) },
    { label: 'Buyer Email', value: buyerEmail },
    { label: 'Date', value: paidAt.toLocaleString() },
  ]

  if (propertyTitle) rows.push({ label: 'Property', value: propertyTitle })
  if (propertyId) rows.push({ label: 'Property ID', value: propertyId })

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; background:#f6f7fb; margin:0; padding:24px; color:#111827; }
        .wrap { max-width:640px; margin:0 auto; }
        .card { background:#ffffff; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; }
        .header { background: linear-gradient(135deg,#059669,#047857); color:#fff; padding:22px 24px; }
        .header h1 { margin:0; font-size:18px; }
        .header p { margin:6px 0 0; opacity:.9; font-size:13px; }
        .content { padding:22px 24px; }
        .pill { display:inline-block; padding:6px 10px; font-size:12px; border-radius:999px; background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
        table { width:100%; border-collapse:collapse; margin-top:14px; }
        td { padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:14px; vertical-align:top; }
        td:first-child { color:#6b7280; width:140px; }
        .btn { display:inline-block; margin-top:18px; background:#059669; color:#fff; text-decoration:none; padding:10px 14px; border-radius:10px; font-weight:600; font-size:14px; }
        .muted { color:#6b7280; font-size:13px; margin-top:14px; line-height:1.6; }
        .footer { padding:14px 24px; border-top:1px solid #e5e7eb; color:#6b7280; font-size:12px; background:#fafafa; }
        .ref { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="card">
          <div class="header">
            <h1>Payment Successful</h1>
            <p>PropertyVision Receipt</p>
          </div>
          <div class="content">
            <div class="pill">Confirmed</div>
            <p style="margin:14px 0 0; font-size:14px;">
              Hi${buyerName ? ` ${buyerName}` : ''},<br/>
              Your payment was successful and your purchase has been recorded.
            </p>

            <table>
              ${rows
                .map((r) => {
                  const v =
                    r.label === 'Reference'
                      ? `<span class="ref">${r.value}</span>`
                      : r.value
                  return `<tr><td>${r.label}</td><td>${v}</td></tr>`
                })
                .join('')}
            </table>

            <a class="btn" href="${appUrl}/dashboard">Go to Dashboard</a>

            <p class="muted">
              If you didn’t make this payment, please contact support immediately.
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Property Vision Leadgate Development Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </body>
  </html>
  `

  return { subject, html }
}
