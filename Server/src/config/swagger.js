import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MERN Auth API',
            version: '1.0.0',
            description: 'API documentation for the MERN Auth application',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routers/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;