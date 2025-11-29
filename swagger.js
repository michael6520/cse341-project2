const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Library Api',
        description: 'Library Api'
    },
    host: 'cse341-project2-dn62.onrender.com',
    schemes: ['https']
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);