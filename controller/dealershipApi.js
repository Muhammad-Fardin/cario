// controllers/dealershipController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const viewAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      where: { dealershipDealershipId: req.dealershipId },
    });
    res.json({ cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addDealToDealership = async (req, res) => {
     try {
       const { carId, dealInfo } = req.body;
   
       const newDeal = await prisma.deal.create({
         data: {
           car: { connect: { carId } },
           dealInfo,
           dealership: { connect: { dealershipId: req.dealershipId } },
         },
       });
   
       res.status(201).json({ message: 'Deal added to dealership successfully', deal: newDeal });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Internal Server Error' });
     }
   };

const viewSoldCars = async (req, res) => {
  try {
    const soldCars = await prisma.soldVehicle.findMany({
      where: { dealershipDealershipId: req.dealershipId },
    });
    res.json({ soldCars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addCars = async (req, res) => {
  try {
    const { type, name, model, carInfo, dealershipId } = req.body;
//     console.log(req.dealershipId)
    const newCar = await prisma.car.create({
      data: {
        type,
        name,
        model,
        carInfo,
        Dealership: { connect: { dealershipId } },
      },
    });
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const viewDeals = async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { dealershipDealershipId: req.dealershipId },
    });
    res.json({ deals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const viewSoldVehicles = async (req, res) => {
  try {
    const soldVehicles = await prisma.soldVehicle.findMany({
      where: { dealershipDealershipId: req.dealershipId },
    });
    res.json({ soldVehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addSoldVehicle = async (req, res) => {
  try {
    const { carId, vehicleInfo } = req.body;
    const newSoldVehicle = await prisma.soldVehicle.create({
      data: {
        car: { connect: { carId } },
        vehicleInfo,
        dealership: { connect: { dealershipId: req.dealershipId } },
      },
    });
    res.status(201).json({ message: 'Vehicle added to sold list successfully', soldVehicle: newSoldVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  viewAllCars,
  viewSoldCars,
  addCars,
  viewDeals,
  addDealToDealership,
  viewSoldVehicles,
  addSoldVehicle,
};
