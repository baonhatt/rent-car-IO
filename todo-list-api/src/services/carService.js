import mongoose from 'mongoose';
import CarModel from '../models/carModel.js';

class CarService {
    async addCar(brand, type, price, image, status = 'available') {
        const newCar = new CarModel({ brand, type, price, image, status });
        return await newCar.save();
    }

    async fetchCars() {
        return await CarModel.find();
    }

    async findCarById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await CarModel.findById(id);
    }

    async findCarByBrand(brand) {
        return await CarModel.findOne({ brand });
    }

    async modifyCar(id, updatedData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await CarModel.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async removeCar(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return await CarModel.findByIdAndDelete(id);
    }
}

export default CarService;