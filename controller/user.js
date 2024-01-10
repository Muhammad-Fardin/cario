import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BLACKLISTED_TOKENS = new Set();

const generateToken = (userId) => {
     return jwt.sign({ userId }, 'process.env.JWT_SECRET', { expiresIn: '24h' });
   };

   const login = async (req, res) => {
     const { userEmail, password } = req.body;
   
     try {
       const user = await prisma.user.findFirst({
         where: { userEmail },
       });
   
       if (!user || !bcrypt.compareSync(password, user.password)) {
         return res.status(401).json({ message: 'Invalid credentials' });
       }
   
       const token = generateToken(user.userId);
       res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
       res.json({ token });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };
   
   const signup = async (req, res) => {
     const { userEmail, password, userLocation, userInfo } = req.body;
   
     try {
       const hashedPassword = bcrypt.hashSync(password, 10);
   
       await prisma.user.create({
         data: {
           userEmail,
           userLocation,
           userInfo,
           password: hashedPassword,
         },
       });
   
      //  const token = generateToken(userId);
   
       res.status(200).json({message: 'signed up successfully'});
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
   

   const getProfile = async (req, res) => {
     const userId = req.params;
   
     try {
       const user = await prisma.user.findUnique({
         where: { userId },
       });
   
       if (!user) {
         return res.status(404).json({ message: 'User not found' });
       }
   
       // You can customize the response based on your user schema
       const userProfile = {
         userId: user.userId,
         userLocation: user.userLocation,
         userInfo: user.userInfo,
         vehicleInfo: user.vehicleInfo
       };
   
       res.json({ userProfile });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };

   export { login, signup, logout, getProfile };