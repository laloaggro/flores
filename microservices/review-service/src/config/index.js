// Configuración del servicio de reseñas
const config = {
  port: process.env.PORT || 3007,
  database: {
    uri: process.env.REVIEW_SERVICE_MONGODB_URI || 'mongodb+srv://arreglosvictoriafloreria_db_user:KonATXDTptPcIcMd@cluster0.uetrvmc.mongodb.net/reviews_db?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true&tlsInsecure=true',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    }
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por ventana
  }
};

module.exports = config;