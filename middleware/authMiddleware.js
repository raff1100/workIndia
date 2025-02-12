const jwtUtils = require('../utils/jwtUtils');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.log("Authentication: No Authorization header provided");
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log("Authentication: Invalid Authorization header format");
    return res.status(401).json({ message: 'Invalid Authorization header format.  Expected: Bearer <token>' });
  }

  const token = parts[1];

  if (!token) {
    console.log("Authentication: Token missing from Authorization header");
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const user = jwtUtils.verifyToken(token); 
  if (!user) {
    console.log("Authentication: Invalid or expired token");
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  console.log("Authentication: User authenticated successfully:", req.user); 
  next();
}

function authorizeRole(roles) {
  return (req, res, next) => {
    console.log("Authorization: Checking roles. Allowed roles:", roles);

    if (!req.user) {
      console.error("Authorization: req.user is undefined.  Authentication middleware likely failed.");
      return res.status(401).json({ message: 'Unauthorized: Missing user information.  Authentication required.' }); // Or 403, depending on your desired behavior
    }

    if (!req.user.role) {
        console.error("Authorization: req.user.role is undefined. User object malformed.");
        return res.status(403).json({message: 'Unauthorized: User role is undefined.'});
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Authorization: User role "${req.user.role}" is not authorized for this resource.`);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    console.log(`Authorization: User role "${req.user.role}" authorized successfully.`);
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };