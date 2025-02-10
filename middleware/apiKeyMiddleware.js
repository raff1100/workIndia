require('dotenv').config();

const apiKey = process.env.ADMIN_API_KEY; 

function verifyApiKey(req, res, next) {
  const apiKeyHeader = req.headers['x-api-key'];

  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();
}

module.exports = verifyApiKey;