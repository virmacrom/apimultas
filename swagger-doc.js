const swaggerUi = require ('swagger-ui-express');
const swaggerJsDoc = require ('swagger-jsdoc');

const options = {
    // "swagger": "2.0",
    "openapi": "3.0.0",
    swaggerDefinition: {

        info: {
            title: 'API Multas',
            version: '1.0.0',
            description: 'Test Express API with swagger doc',    
        },
        basePath: '/',
        tags:[
            {
               name:'Multas',
               description:"API for multas"
            }
        ],
        schemes: [
            'http',
            'https'
        ],
        components: [
          {
            securityDefinitions:{
              APIKeyHeader: {
                "type": "apiKey",
                "in": "header",  
                "name": "apikey"  
              },
            },
          },
        ],

        security: {
            "APIKeyHeader": []
        },

        paths: {
            '/api/v1/multas': {
               post: {
                  tags: ['Multas'],
                  description: "Crear una nueva multa",
                  parameters: [
                    {
                      name :"Fine Parameters",
                      in: "body",
                      description: "Fine to add to the database",
                      required: true,
                    }
                  ],

                  responses: {
                    200: {
                      description: "create response",
                    }
                  }
               },
               get: {
                tags: ['Multas'],
                description: "Consultar las multas existentes",
                responses: {
                  200: {
                    description: "create response",
                  },
                
                },
                security:[{
                  APIKeyHeader: [],
                }
                ],
              },

              delete: {
                tags: ['Multas'],
                description: "Eliminar todas las multas",
                responses: {
                  200: {
                    description: "create response",
                  }
                }
              }

            },

            '/api/v1/multas/{dni}': { 
                get: {
                    tags: ['Multas'],
                    summary: 'Obtener multa por DNI',
                    parameters: [
                        {
                          name : 'dni',
                          in: "path",
                          description: "El dni de la multa a recuperar. Use 918289B para pruebas",
                          required: true,
                        }
                      ],
                      responses: {
                        200: {
                          description: "Operacion correcta"
                        },
                        400: {
                          description: "DNI inválido"
                        },
                        404: {
                          description: "Multa no encontrada"
                        }
                      }
                },
            },
            '/api/v1/multas/editar/{_id}': {
                put: {
                    tags: ['Multas'],
                    summary: 'Actualizar multa por id',
                    parameters: [
                        {
                          name: '_id',
                          in: "path",
                          description: "El id de la multa a actualizar",
                          required: true,
                          type: "string"
                        }
                      ],
                      responses: {
                        200: {
                          description: "Operacion correcta"
                        },
                        400: {
                          description: "Id inválido"
                        },
                        404: {
                          description: "Multa no encontrada"
                        }
                      }
                }
            },

            '/api/v1/multas/{_id}': {
              delete: {
                tags: ['Multas'],
                summary: 'Eliminar multas por id',
                parameters: [
                    {
                      name : '_id',
                      in: "path",
                      description: "El id de la multa a eliminar.",
                      required: true,
                    }
                  ],
                  responses: {
                    200: {
                      description: "Operacion correcta"
                    },
                    400: {
                      description: "Id inválido"
                    },
                    404: {
                      description: "Multa no encontrada"
                    }
                  }
               },
            }

        },
    },
    apis: ['server.js'],
};

const specs = swaggerJsDoc(options);

module.exports = (app) =>{ 
    app.use('/', swaggerUi.serve, swaggerUi.setup(specs));
}