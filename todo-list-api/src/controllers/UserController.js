import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async register(req, res) {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userService.createUser(username, hashedPassword);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            console.log('Login attempt for username:', username);
            
            const user = await this.userService.findUserByUsername(username);
            if (!user) {
                console.log('User not found');
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Invalid password');
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            
            console.log('Password valid, generating tokens...');
            
            // Check if JWT secrets are configured
            if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
                console.error('JWT secrets not configured');
                return res.status(500).json({ message: 'Server configuration error' });
            }
            
            // Generate access token and refresh token
            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15s' });
            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
            
            console.log('Tokens generated, saving refresh token...');
            
            // Save refresh token to database
            await this.userService.updateRefreshToken(user.id, refreshToken);
            
            console.log('Refresh token saved, sending response...');
            
            res.status(200).json({ 
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is required' });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            
            // Validate refresh token in database
            const isValid = await this.userService.validateRefreshToken(decoded.id, refreshToken);
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            // Generate new access token
            const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            res.status(200).json({ 
                accessToken,
                user: {
                    id: decoded.id
                }
            });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }
            res.status(500).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            const userId = req.userId;
            await this.userService.removeRefreshToken(userId);
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default UserController;