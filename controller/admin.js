import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BLACKLISTED_TOKENS = new Set();

const generateToken = (adminId) => {
  return jwt.sign({ adminId }, 'process.env.JWT_SECRET', { expiresIn: '24h' });
};


const signup = async (req, res) => {
     const { adminId, password, role } = req.body;
   
     try {
       const hashedPassword = bcrypt.hashSync(password, 10);
   
       const newAdmin = await prisma.admin.create({
         data: {
           adminId,
           password: hashedPassword,
           role,
         },
       });
   
       const token = generateToken(newAdmin.adminId);
   
       res.json({ token });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };   

const login = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId },
    });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin.adminId);
    res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProfile = async (req, res) => {
     try {
       const admin = await prisma.admin.findUnique({
         where: { adminId: req.adminId },
       });
   
       if (!admin) {
         return res.status(404).json({ message: 'Admin not found' });
       }
   
       res.json({ admin });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };

   const logout = async (req, res) => {
     const token = req.headers.cookie;
   
     if (!token) {
       return res.status(401).json({ message: 'Unauthorized' });
     }
   
     BLACKLISTED_TOKENS.add(token);
     res.cookie('token', '', { httpOnly: true, maxAge: 0 });
     res.json({ message: 'Logout successful' });
   };
   

export { signup, login, getProfile, logout};
