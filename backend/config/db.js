// Configuración de la base de datos
// Esta es una configuración de ejemplo que se puede expandir según las necesidades

const config = {
  development: {
    host: 'localhost',
    user: 'dev_user',
    password: 'dev_password',
    database: 'floreria_victoria_dev',
    port: 3306
  },
  production: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'prod_user',
    password: process.env.DB_PASSWORD || 'prod_password',
    database: process.env.DB_NAME || 'floreria_victoria_prod',
    port: process.env.DB_PORT || 3306
  }
};

// Seleccionar la configuración según el entorno
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

module.exports = dbConfig;