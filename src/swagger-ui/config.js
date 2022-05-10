const swaggerDoc = require('./swagger.json');

module.exports = {
    swaggerCss: {
        customCss: `
            .topbar-wrapper img {
                content:url(../logo.png);
                width:200px;
                height:auto;
            }
            .swagger-ui .topbar {
                background-color: #000000;
                border-bottom: 10px solid #0AC77E;
            }
        `,
        customSiteTitle: "FinanceBox API",
        customfavIcon: '../favicon.ico'
    },
    swaggerDocs: swaggerDoc
}