const nodemailer = require('nodemailer');

// Create transporter using Gmail or other email service
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email credentials not configured. Using test mode.');
    // Return a test account transporter for development
    return {
      sendMail: async (options) => {
        console.log('TEST MODE - Email would be sent to:', options.to);
        console.log('Subject:', options.subject);
        return { response: 'Email sent in test mode' };
      }
    };
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Function to send receipt email
const sendReceiptEmail = async (customerEmail, customerName, cartItems, totalAmount, orderId) => {
  const transporter = createTransporter();

  // Ensure totalAmount is a number
  const numTotalAmount = parseFloat(totalAmount) || 0;

  // Build HTML email content
  const itemsHTML = cartItems
    .map(
      (item) => {
        const unitPrice = parseFloat(item.price || item.unitPrice || (parseFloat(item.totalPrice) / parseFloat(item.quantity)) || 0);
        const itemTotal = parseFloat(item.totalPrice) || (unitPrice * parseFloat(item.quantity));
        
        return `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.restaurantName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${unitPrice.toFixed(2)} kr</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${itemTotal.toFixed(2)} kr</strong></td>
    </tr>
  `;
      }
    )
    .join('');

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h2 {
            color: #333;
            border-bottom: 3px solid #28a745;
            padding-bottom: 10px;
          }
          .order-info {
            background-color: #fff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            border-left: 4px solid #28a745;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
          }
          th {
            background-color: #28a745;
            color: white;
            padding: 12px;
            text-align: left;
          }
          .total-row {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 18px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Kvitto - Order Confirmation</h2>
          
          <div class="order-info">
            <p><strong>Hej ${customerName}!</strong></p>
            <p>Tack för din beställning. Här är dina orderdetaljer:</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Datum:</strong> ${new Date().toLocaleDateString('sv-SE')}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Maträtt</th>
                <th>Restaurang</th>
                <th>Antal</th>
                <th style="text-align: right;">Pris</th>
                <th style="text-align: right;">Totalt</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr class="total-row">
                <td colspan="4" style="text-align: right; padding: 15px;">Totalt att betala:</td>
                <td style="text-align: right; padding: 15px;">${numTotalAmount.toFixed(2)} kr</td>
              </tr>
            </tbody>
          </table>

          <div class="order-info">
            <p><strong>Leveransadress:</strong></p>
            <p>Din leverans är på väg. Du kommer att motta ett uppdateringsmeddelande när den är levererad.</p>
          </div>

          <div class="footer">
            <p>Om du har några frågor, kontakta oss på support@mat.com</p>
            <p>&copy; 2026 MAT. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Kvitto - Order #${orderId}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Receipt email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send receipt email: ${error.message}`);
  }
};

module.exports = { sendReceiptEmail };
