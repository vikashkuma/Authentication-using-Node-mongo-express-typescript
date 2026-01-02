import { create } from "domain";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    authentication: {
        password: { type: String, required: true , select: false  },
        salt: { type: String , select: false  },
        sessiontoken: { type: String , select: false  },
    }
});

export const UserModel = mongoose.model('User', userSchema);
export const getUsers = async () => {
    return UserModel.find();
};

export const getUserById = async (id: string) => {
    return UserModel.findById(id);
};

export const getUserByEmail = async (email: string) => {
    return UserModel.findOne({ email });
};

export const getUserBySessionToken = async (sessiontoken: string) => {
    return UserModel.findOne({ 'authentication.sessiontoken': sessiontoken });
};

export const createUser = async (username: string, email: string, password: string, salt: string) => {
    const user = new UserModel({
        username,
        email,
        authentication: {
            password,
            salt,
        },
    });
    await user.save();
    return user;
};

export const createUser1 = async (values: Record<string, any>) => new UserModel(values)
    .save()
    .then((user) => user.toObject());

export const updateUserById = async (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values, { new: true });

export const deleteUserById = async (id: string) => {
    return UserModel.findByIdAndDelete(id);
};


