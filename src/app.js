require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { swaggerCss, swaggerDocs } = require('./swagger-ui/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(apiRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerCss));

module.exports = app;