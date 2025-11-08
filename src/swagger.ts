import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Life Plus API',
      version: '1.0.0',
      description:
        'API para gerenciamento de usuários, medicamentos, receitas e exames.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerJsDoc(options)

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
