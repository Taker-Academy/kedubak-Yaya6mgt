const jwt = require("jsonwebtoken");

async function createToken(user)
{
    const payload = {
        userId: user._id,
    };

    const secretKey = process.env.CRYPT_TOK;
    const options = { expiresIn: '2h' };

    const token = jwt.sign(payload, secretKey, options);
    return token;

}

async function verifyToken(myTok)
{
    return jwt.verify(myTok, process.env.CRYPT_TOK, (err, decoded) => {
        if (err) {
            return {
                code: 401,
            };
        } else {
            return {
                code: 200,
                data: decoded,
            };
        }
    });
}

module.exports= {createToken, verifyToken};
