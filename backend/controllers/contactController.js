// Controlador para manejar el formulario de contacto
const nodemailer = require('nodemailer');

// Enviar mensaje de contacto
const sendContactMessage = (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Validar datos requeridos
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Faltan datos requeridos para enviar el mensaje' 
      });
    }
    
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Error: Variables de entorno de correo electrónico no configuradas');
      return res.status(500).json({ 
        message: 'Error de configuración del servidor. Por favor, contacte al administrador.' 
      });
    }
    
    // Configurar el transporte de correo (usando variables de entorno)
    const transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verificar la conexión con el servidor de correo
    transporter.verify((error, success) => {
      if (error) {
        console.error('Error al verificar la conexión de correo:', error);
        return res.status(500).json({ 
          message: 'Error de conexión con el servidor de correo. Por favor, inténtelo más tarde.' 
        });
      }
      
      // Configurar el contenido del correo
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Enviar al propietario del sitio
        subject: `Nuevo mensaje de contacto de ${name}`,
        text: `
          Has recibido un nuevo mensaje de contacto:
          
          Nombre: ${name}
          Email: ${email}
          Teléfono: ${phone || 'No proporcionado'}
          Mensaje: ${message}
        `,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
        `
      };
      
      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ 
            message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' 
          });
        }
        
        console.log('Mensaje enviado: ' + info.response);
        res.status(200).json({ 
          message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.' 
        });
      });
    });
  } catch (error) {
    console.error('Error inesperado al enviar el mensaje:', error);
    res.status(500).json({ 
      message: 'Error al enviar el mensaje', 
      error: error.message 
    });
  }
};

module.exports = {
  sendContactMessage
};