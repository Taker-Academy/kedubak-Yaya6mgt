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

module.exports= {createToken};
