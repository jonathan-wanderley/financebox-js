const jwt = require('jsonwebtoken');

module.exports = {
    private: async (req, res, next) => {
        const { authorization } = req.headers;

        if(!authorization) {
            return res.status(401).json({notallowed: true});
        }

        const token = authorization.replace('Bearer', '').trim();

        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            const { id } = data;
            req.userId = id
            return next();
        }
        catch (error) {
            return res.status(401).json({notallowed: true});
        }
    }
}