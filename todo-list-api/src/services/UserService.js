import UserModel from "../models/UserModel.js";

class UserService {
    async createUser(username, password) {
        const newUser = new UserModel({ username, password });
        return await newUser.save();
    }

    async findUserByUsername(username) {
        return await UserModel.findOne({ username });
    }

    async findUserById(id) {
        return await UserModel.findById(id);
    }

    async updateRefreshToken(userId, refreshToken) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // Token expires in 7 days
        
        return await UserModel.findByIdAndUpdate(
            userId,
            { 
                refreshToken,
                refreshTokenExpiry: expiryDate
            },
            { new: true }
        );
    }

    async removeRefreshToken(userId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            { 
                refreshToken: null,
                refreshTokenExpiry: null
            },
            { new: true }
        );
    }

    async validateRefreshToken(userId, refreshToken) {
        const user = await UserModel.findById(userId);
        if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
            return false;
        }
        
        // Check if token is expired
        if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
            await this.removeRefreshToken(userId);
            return false;
        }
        
        return true;
    }

    async getAllUsers() {
        return await UserModel.find();
    }
    
}

export default UserService;