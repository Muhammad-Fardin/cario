import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BLACKLISTED_TOKENS = new Set();

const generateToken = (userId) => {
     return jwt.sign({ userId }, 'process.env.JWT_SECRET', { expiresIn: '24h' });
   };

   const login = async (req, res) => {
     const { dealershipEmail, password } = req.body;
   
     try {
       const dealership = await prisma.dealership.findFirst({
         where: { dealershipEmail },
       });
   
       if (!dealership || !bcrypt.compareSync(password, dealership.password)) {
         return res.status(401).json({ message: 'Invalid credentials' });
       }
   
       const token = generateToken(dealership.dealershipId);
       res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
       res.status(200).json({ message: 'logged in successfully' });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };
   
   const signup = async (req, res) => {
     const { dealershipEmail, password, dealershipLocation, dealershipName, dealershipInfo } = req.body;
   
     try {
       const hashedPassword = bcrypt.hashSync(password, 10);
   
       await prisma.dealership.create({
         data: {
           dealershipEmail,
           dealershipLocation,
           dealershipName,
           dealershipInfo,
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
     const dealershipId = req.dealershipId;
   
     try {
       const dealership = await prisma.dealership.findUnique({
         where: { dealershipId },
       });
   
       if (!dealership) {
         return res.status(404).json({ message: 'User not found' });
       }
   
       // You can customize the response based on your dealership schema
       const dealershipProfile = {
         dealershipId: dealership.dealershipId,
         dealershipLocation: dealership.dealershipLocation,
         dealershipInfo: dealership.dealershipInfo,
         dealershipEmail: dealership.dealershipEmail,
         dealershipName: dealership.dealershipName,
         cars: dealership.cars,
         deals: dealership.deals,
         soldVehicles: dealership.soldVehicles,
       };
   
       res.json({ dealershipProfile });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal server error' });
     }
   };

   export { login, signup, logout, getProfile };