// routes/dealershipRoutes.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  viewAllCars,
  viewSoldCars,
  addCars,
  viewDeals,
  viewSoldVehicles,
  addSoldVehicle,
  addDealToDealership,
} from '../controller/dealershipApi.js';

const router = express.Router();

router.post('/add-deal', authMiddleware, addDealToDealership);

// Route to add cars to a dealership
router.post('/add-cars', authMiddleware, addCars);

// Route to add vehicles to the sold list after a deal
router.post('/add-sold-vehicle', authMiddleware, addSoldVehicle);

// Route to view all cars in a dealership
router.get('/cars', authMiddleware, viewAllCars);

// Route to view all cars sold by a dealership
router.get('/sold-cars', authMiddleware, viewSoldCars);

// Route to view deals provided by a dealership
router.get('/deals', authMiddleware, viewDeals);

// Route to see all vehicles sold by a dealership
router.get('/sold-vehicles', authMiddleware, viewSoldVehicles);


export default router;
