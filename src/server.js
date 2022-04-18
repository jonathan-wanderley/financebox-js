require('dotenv').config();
const express = require('express');
const apiRoutes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRoutes);

app.listen(process.env.PORT, () => {
    console.log("🔥 Servidor rodando");
});