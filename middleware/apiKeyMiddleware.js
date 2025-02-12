require('dotenv').config();

const apiKey = process.env.ADMIN_API_KEY; 

function verifyApiKey(req, res, next) {
  const apiKeyHeader = req.headers['x-api-key'];

  console.log("API Key Middleware running");
  console.log("API Key Header:", apiKeyHeader);
  console.log("Expected API Key:", apiKey);

  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    console.log("Invalid API key");
    return res.status(401).json({ message: 'Invalid API key' });
  }

  console.log("API Key Validated");
  next();
}

module.exports = verifyApiKey;