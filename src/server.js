require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const cssOptions = require('./swagger-ui/css') 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRoutes);

const response = fs.readFileSync(path.join(__dirname, './swagger-ui/swagger.json'));
const swaggerDocs = JSON.parse(response);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, cssOptions));

app.listen(process.env.PORT, () => {
    console.log("🔥 Servidor rodando");
});