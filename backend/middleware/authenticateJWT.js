
// import jwt from 'jsonwebtoken';

// export const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader?.split(' ')[1];

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ status: 'error', message: 'Forbidden' });
//       }

//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).json({ status: 'error', message: 'Unauthorized' });
//   }
// };

// middleware/authenticateJWT.js

import { verifyAccessToken } from '../utils/jwtUtils.js';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = verifyAccessToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error decoding or verifying JWT:', error);
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

