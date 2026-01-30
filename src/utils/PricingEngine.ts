import { VehicleType, PriceCalculation } from '../types/booking';

export const calculateShybayPrice = (vehicleType: VehicleType, distance: number): PriceCalculation => {
  if (distance > 21) {
    return { total: 0, base: 0, markup: 0, error: "Location outside 21km limit." };
  }

  const basePrices: Record<VehicleType, number> = {
    'Hatchback': 120,
    'Sedan': 150,
    'SUV': 180,
    'Minibus': 200,
    'Bakkie': 180
  };

  const base = basePrices[vehicleType] || 150;

  let markup = 0;
  if (distance > 5 && distance <= 10) markup = 50;
  else if (distance > 10 && distance <= 15) markup = 100;
  else if (distance > 15 && distance <= 21) markup = 150;

  return { total: base + markup, base, markup };
};