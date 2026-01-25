// app/lib/email-templates.ts
export interface EmailTemplateParams {
  name: string
  email: string
  verificationUrl?: string
  resetUrl?: string
  userType: 'buyer' | 'seller' | 'agent' | 'user'
  phone?: string
  agency?: string
  city?: string
}

export function generateVerificationEmail(params: EmailTemplateParams): {
  subject: string
  html: string
} {
  const { name, verificationUrl, userType, phone, agency, city } = params

  // User type configuration
  const userTypeConfig = {
    agent: {
      subject: 'Welcome to PropertyVision - Verify Your Agent Account',
      welcome: 'Welcome to our professional agent network!',
      benefits: [
        'Manage your property listings',
        'Connect with potential clients',
        'Access professional tools',
        'Get market insights',
      ],
    },
    seller: {
      subject: 'Welcome to PropertyVision - Verify Your Seller Account',
      welcome: 'Ready to sell your property?',
      benefits: [
        'List your property quickly',
        'Reach qualified buyers',
        'Track property interest',
        'Manage viewings easily',
      ],
    },
    buyer: {
      subject: 'Welcome to PropertyVision - Verify Your Account',
      welcome: 'Start your property search!',
      benefits: [
        'Save favorite properties',
        'Get personalized alerts',
        'Schedule viewings',
        'Connect with agents',
      ],
    },
    user: {
      subject: 'Welcome to PropertyVision - Verify Your Account',
      welcome: 'Welcome to PropertyVision!',
      benefits: [
        'Explore properties',
        'Save favorites',
        'Get market updates',
        'Connect with professionals',
      ],
    },
  }

  const config = userTypeConfig[userType] || userTypeConfig.user

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${config.subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 20px;
          background: #f9fafb;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header { 
          background: #059669; 
          padding: 30px; 
          text-align: center; 
          color: white;
        }
        .content { 
          padding: 30px;
        }
        .button { 
          display: inline-block; 
          background: #059669; 
          color: white; 
          padding: 12px 28px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600;
          margin: 20px 0;
        }
        .link-box { 
          background: #f3f4f6; 
          padding: 12px; 
          border-radius: 6px; 
          border: 1px solid #e5e7eb; 
          word-break: break-all; 
          font-family: monospace; 
          font-size: 13px; 
          color: #4b5563;
          margin: 15px 0;
        }
        .benefits {
          background: #f0f9ff;
          border: 1px solid #e0f2fe;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
        }
        .benefits ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .benefits li {
          margin: 5px 0;
          color: #0369a1;
        }
        .footer {
          background: #f9fafb;
          padding: 20px 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef3c7;
          padding: 15px;
          color: #92400e;
          font-size: 14px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">PropertyVision</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Find Your Perfect Property</p>
        </div>
        
        <div class="content">
          <h3 style="margin-top: 0;">Hi ${name},</h3>
          
          <p>${config.welcome} Please verify your email to get started.</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy this link to your browser:
          </p>
          
          <div class="link-box">${verificationUrl}</div>
          
          <div class="benefits">
            <strong>After verification, you can:</strong>
            <ul>
              ${config.benefits.map((benefit) => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
          
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${city ? `<p><strong>Location:</strong> ${city}</p>` : ''}
          ${agency ? `<p><strong>Agency:</strong> ${agency}</p>` : ''}
        </div>
        
        <div class="warning">
          This link expires in 24 hours.
        </div>
        
        <div class="footer">
          <p>Need help? <a href="mailto:support@propertyvisionltd.com" style="color: #2563eb;">Contact Support</a></p>
          <p style="font-size: 12px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} Property Vision Leadgate Development
              Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject: config.subject, html }
}

export function generatePasswordResetEmail(params: EmailTemplateParams): {
  subject: string
  html: string
} {
  const { name, resetUrl } = params

  const subject = 'Reset Your Password - PropertyVision'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 20px;
          background: #f9fafb;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header { 
          background: #dc2626; 
          padding: 30px; 
          text-align: center; 
          color: white;
        }
        .content { 
          padding: 30px;
        }
        .button { 
          display: inline-block; 
          background: #dc2626; 
          color: white; 
          padding: 12px 28px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: 600;
          margin: 20px 0;
        }
        .link-box { 
          background: #f3f4f6; 
          padding: 12px; 
          border-radius: 6px; 
          border: 1px solid #e5e7eb; 
          word-break: break-all; 
          font-family: monospace; 
          font-size: 13px; 
          color: #4b5563;
          margin: 15px 0;
        }
        .warning {
          background: #fef3c7;
          padding: 15px;
          color: #92400e;
          font-size: 14px;
          text-align: center;
        }
        .footer {
          background: #f9fafb;
          padding: 20px 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">Password Reset</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">PropertyVision Account Security</p>
        </div>
        
        <div class="content">
          <h3 style="margin-top: 0;">Hi${name ? ` ${name}` : ''},</h3>
          
          <p>A password reset was requested for your PropertyVision account.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Or copy this link to your browser:
          </p>
          
          <div class="link-box">${resetUrl}</div>
          
          <p style="color: #666;">
            If you didn't request this, please ignore this email.
            Your password won't change until you use the link above.
          </p>
        </div>
        
        <div class="warning">
          This link expires in 1 hour.
        </div>
        
        <div class="footer">
          <p>Need help? <a href="mailto:support@propertyvisionltd.com" style="color: #2563eb;">Contact Support</a></p>
          <p style="font-size: 12px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} Property Vision Leadgate Development
              Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject, html }
}
