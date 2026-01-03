import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

/**
 * GOOGLE INTERVIEW TIP: 
 * Use specific error messages for validation but generic messages 
 * for security-sensitive failures (like login) to prevent account enumeration.
 */

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validation check
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Registration failed: Missing required fields (username, email, or password)." 
            });
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: "Registration failed: A user with this email or username already exists." 
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({ username, email, password: hashedPassword });
        
        const response = user.toObject();
        delete response.password;

        return res.status(201).json({ 
            success: true,
            message: "User registered successfully.",
            data: {
                user: response, 
                token: generateToken(user.id) 
            }
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false,
            message: "An internal server error occurred during registration.",
            error: error.message 
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Login failed: Email and password are required." 
            });
        }

        const user = await User.findOne({ email }).select('+password');
        
        // SECURITY BEST PRACTICE: Use a generic message for invalid credentials
        if (!user || !(await verifyPassword(user.password!, password))) {
            return res.status(401).json({ 
                success: false,
                message: "Login failed: Invalid email or password." 
            });
        }

        return res.json({ 
            success: true,
            message: "Login successful. Welcome back!",
            token: generateToken(user.id) 
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false,
            message: "An error occurred during the login process.",
            error: error.message 
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ 
                success: false,
                message: "Delete failed: User account not found." 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "User account has been successfully deleted." 
        });
    } catch (error: any) {
        return res.status(500).json({ 
            success: false,
            message: "An error occurred while trying to delete the account." 
        });
    }
};

/**
 * GET PROFILE - The "Read" in CRUD
 * Access: Private (requires authenticate middleware)
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        // The ID is retrieved from the decoded JWT token attached by the middleware
        const userId = (req as any).user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found: User does not exist."
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully.",
            data: user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the profile.",
            error: error.message
        });
    }
};

/**
 * UPDATE PROFILE - The "Update" in CRUD
 * Access: Private (requires authenticate middleware)
 */
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const updates = req.body;

        // Security Check: If the user is updating their password, we MUST re-hash it.
        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        // Use { new: true } to return the document AFTER the update is applied
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Update failed: User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: updatedUser
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: "Update failed: Validation error or internal issue.",
            error: error.message
        });
    }
};
