const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API EndPoints Documentation',
      version: '1.0.0',
      description: 'Documentation for your API endpoints',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;