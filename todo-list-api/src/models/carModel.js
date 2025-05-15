import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        default: null,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'available'
    },
});

const CarModel = mongoose.model('car', carSchema);

export default CarModel;