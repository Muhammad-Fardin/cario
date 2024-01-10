import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json({ cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCarsInDealership = async (req, res) => {
  const { dealershipId } = req.params;

  try {
    const carsInDealership = await prisma.car.findMany({
      where: { dealershipDealershipId: dealershipId },
    });

    res.json({ carsInDealership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDealershipWithCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const dealership = await prisma.dealership.findUnique({
      where: { cars: { some: { carId } } },
    });

    res.json({ dealership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOwnedVehicles = async (req, res) => {
  const { userId } = req;

  try {
    const ownedVehicles = await prisma.car.findMany({
      where: { userUserId: userId },
    });

    res.json({ ownedVehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDealershipsInRange = async (req, res) => {
  const { userLocation, range } = req.params;

  try {
    const dealershipsInRange = await prisma.dealership.findMany({
      where: {
        dealershipLocation: {
          near: { latitude: parseFloat(userLocation.split(',')[0]), longitude: parseFloat(userLocation.split(',')[1]) },
          distance: parseFloat(range),
        },
      },
    });

    res.json({ dealershipsInRange });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDealsOnCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const dealsOnCar = await prisma.deal.findMany({
      where: { carId },
    });

    res.json({ dealsOnCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDealsFromDealership = async (req, res) => {
  const { dealershipId } = req.params;

  try {
    const dealsFromDealership = await prisma.deal.findMany({
      where: { dealershipDealershipId: dealershipId },
    });

    res.json({ dealsFromDealership });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const buyCar = async (req, res) => {
  const { dealId } = req.params;

  try {
    const deal = await prisma.deal.findFirst({
      where: { dealId },
      include: { car: true },
    });

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.car.userUserId) {
      return res.status(400).json({ message: 'Car already owned' });
    }

    await prisma.deal.update({
      where: { dealId },
      data: { car: { update: { userUserId: req.userId } } },
    });

    res.json({ message: 'Car purchased successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAllCars,
  getCarsInDealership,
  getDealershipWithCar,
  getOwnedVehicles,
  getDealershipsInRange,
  getDealsOnCar,
  getDealsFromDealership,
  buyCar,
};
