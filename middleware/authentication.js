const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const auth =async (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success : false,
            msg : 'Access Denied'
        })
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success : false,
            msg : 'No token'
        })
    }
    else {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next()
        }
        catch(error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success : false,
                msg : 'Server Error'
            })
        }
    }
}

module.exports = auth