const jwt = require("jsonwebtoken");
const listTok = require('../blackToken/blackToken');

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
    if (listTok.verifierTokenDansListeNoire(myTok)) {
        return { code: 401 };
    }
    try {
        const decoded = jwt.verify(myTok, process.env.CRYPT_TOK);
        if (decoded) {
            return {
                code: 200,
                data: decoded
            };
        }
        return { code: 401 };
    } catch (err) {
        return { code: 401 };
    }
}

module.exports= {createToken, verifyToken};
