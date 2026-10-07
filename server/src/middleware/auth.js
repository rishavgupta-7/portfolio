import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'stark_super_secret_jwt_key_99f2b8e3a1d047c6';

export const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const requireAdmin = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admin_token) {
      // Check HTTP-only cookie
      token = req.cookies.admin_token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Unauthorized. Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authorization token.' });
  }
};
