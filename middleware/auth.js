// authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken; // Extract token from the cookie

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Token not found' });
  }

  // console.log('Raw Token:', token);

  // Use jwt.decode to decode the token without signature verification
  const decoded = jwt.decode(token);

  // console.log('Decoded token:', decoded);

  // Assuming the decoded object has userId, adminId, or dealershipId property
  req.userId = decoded.userId || null;
  req.adminId = decoded.adminId || null;
  req.dealershipId = decoded.dealershipId || null;

  next();
};

export default authMiddleware;
