import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password);
};

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
    return await argon2.verify(hash, password);
};

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};
