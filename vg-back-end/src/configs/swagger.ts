import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Video Gallery API',
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./src/routes/**/*.routes.ts'],
}

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
