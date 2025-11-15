/**
 * Email gönderme servisi
 * Nodemailer kullanarak email gönderir
 */

import nodemailer from 'nodemailer';

/**
 * Email transporter oluşturur
 * SMTP ayarları environment variables'dan alınır
 */
function createTransporter() {
  // Gmail SMTP için (veya başka bir SMTP servisi)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Gmail için App Password gerekli
    },
  });

  return transporter;
}

/**
 * Şifre sıfırlama email'i gönderir
 * @param to - Alıcı email adresi
 * @param resetToken - Şifre sıfırlama token'ı
 * @param resetUrl - Şifre sıfırlama linki
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  resetUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Email ayarları yoksa hata döndür
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      const missingVars = [];
      if (!process.env.EMAIL_USER) missingVars.push('EMAIL_USER');
      if (!process.env.EMAIL_PASSWORD) missingVars.push('EMAIL_PASSWORD');
      
      console.error('❌ Email servisi yapılandırılmamış!');
      console.error(`Eksik environment variables: ${missingVars.join(', ')}`);
      console.error('Lütfen Firebase Console > App Hosting > Backend > Environment\'tan bu değişkenleri ekleyin.');
      
      return { 
        success: false, 
        error: `Email servisi yapılandırılmamış. Eksik: ${missingVars.join(', ')}. Lütfen Firebase Console'dan ekleyin.` 
      };
    }

    console.log('📧 Email gönderiliyor...', { to, service: process.env.EMAIL_SERVICE || 'gmail' });
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Cuma Mesajları" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Şifre Sıfırlama - Cuma Mesajları',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Şifre Sıfırlama</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
              </div>
              <p>Veya aşağıdaki linki tarayıcınıza kopyalayın:</p>
              <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Güvenlik Uyarısı:</strong>
                <ul>
                  <li>Bu link 1 saat içinde geçerlidir</li>
                  <li>Eğer bu isteği siz yapmadıysanız, bu email'i görmezden gelebilirsiniz</li>
                  <li>Şifreniz değişmeyecektir</li>
                </ul>
              </div>
              <p>Eğer buton çalışmıyorsa, yukarıdaki linki tarayıcınıza kopyalayıp yapıştırın.</p>
            </div>
            <div class="footer">
              <p>Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
              <p>&copy; ${new Date().getFullYear()} Cuma Mesajları. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Şifre Sıfırlama - Cuma Mesajları

Merhaba,

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:

${resetUrl}

Bu link 1 saat içinde geçerlidir.

Eğer bu isteği siz yapmadıysanız, bu email'i görmezden gelebilirsiniz.

Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
      `,
    };

    await transporter.sendMail(mailOptions);
    
    console.log('✅ Email başarıyla gönderildi!', { to });
    return { success: true };
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    if (error instanceof Error) {
      // Daha açıklayıcı hata mesajları
      let errorMessage = error.message;
      
      if (errorMessage.includes('Invalid login')) {
        errorMessage = 'Email kullanıcı adı veya şifresi hatalı. Gmail App Password kullanıldığından emin olun.';
      } else if (errorMessage.includes('ECONNECTION')) {
        errorMessage = 'SMTP sunucusuna bağlanılamadı. İnternet bağlantınızı kontrol edin.';
      } else if (errorMessage.includes('EAUTH')) {
        errorMessage = 'Email kimlik doğrulama hatası. EMAIL_USER ve EMAIL_PASSWORD değerlerini kontrol edin.';
      }
      
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Email gönderilirken bir hata oluştu.' };
  }
}

