
class CarController {
    constructor(carService) {
        this.carService = carService;
    }

    async createCar(req, res) {
        try {
            const { brand, type, price, image, status } = req.body;
            const car = await this.carService.addCar(brand, type, price, image, status);
            res.status(201).json(car);
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ message: 'Brand already exists' });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async getAllCars(req, res) {
        try {
            const cars = await this.carService.fetchCars();
            res.status(200).json(cars);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCarById(req, res) {
        try {
            const car = await this.carService.findCarById(req.params.id);
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.status(200).json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCarByBrand(req, res) {
        try {
            const car = await this.carService.findCarByBrand(req.params.brand);
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.status(200).json(car);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCar(req, res) {
        try {
            const car = await this.carService.modifyCar(req.params.id, req.body);
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.status(200).json(car);
        } catch (error) {
            if (error.code === 11000) {
                res.status(400).json({ message: 'Brand already exists' });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async deleteCar(req, res) {
        try {
            const car = await this.carService.removeCar(req.params.id);
            if (!car) {
                return res.status(404).json({ message: 'Car not found' });
            }
            res.status(200).json({ message: 'Car deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default CarController;