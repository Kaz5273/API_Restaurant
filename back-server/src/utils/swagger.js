const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST Documentation',
      version: '1.0.0',
      description: 'Documentation of my API for the GraphQL course',
    },
  },
  apis: ['./src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
