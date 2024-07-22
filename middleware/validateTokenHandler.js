const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        res.status(401).json({message: "User is not authorized"});
        return;
      }
      req.user = decoded.user;
      next()
    });

    if(!token) {
        res.status(401).json({message: "Invalid auth token"});
    }
  } else {
    res.status(401).json({message: "Invalid auth token"});
  }
};

module.exports = validateToken;
