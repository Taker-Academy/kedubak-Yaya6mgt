let blacklistedTokens = new Set();

function ajouterTokenALaListeNoire(token)
{
    blacklistedTokens.add(token);
}

function verifierTokenDansListeNoire(token)
{
    return blacklistedTokens.has(token);
}

module.exports = {
    ajouterTokenALaListeNoire,
    verifierTokenDansListeNoire
};
