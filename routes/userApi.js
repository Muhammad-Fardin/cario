import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getAllCars,
  getCarsInDealership,
  getDealershipWithCar,
  getOwnedVehicles,
  getDealershipsInRange,
  getDealsOnCar,
  getDealsFromDealership,
  buyCar,
} from '../controller/userApi.js';

const router = express.Router();

router.get('/cars', authMiddleware, getAllCars);
router.get('/cars/dealership/:dealershipId', authMiddleware, getCarsInDealership);
router.get('/dealership/car/:carId', authMiddleware, getDealershipWithCar);
router.get('/vehicles/owned', authMiddleware, getOwnedVehicles);
router.get('/dealerships/inrange/:userLocation/:range', authMiddleware, getDealershipsInRange);
router.get('/deals/car/:carId', authMiddleware, getDealsOnCar);
router.get('/deals/dealership/:dealershipId', authMiddleware, getDealsFromDealership);
router.post('/buy/car/:dealId', authMiddleware, buyCar);

export default router;
