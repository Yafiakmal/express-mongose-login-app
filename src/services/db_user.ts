import { User, IUser } from "../models/User.js";
import { Types } from "mongoose";

// CREATE
export async function createUser(data: {
  username: string;
  email: string;
  hpass: string;
}): Promise<IUser> {
  try {
    const user = new User(data);
    await user.save();
    return user;
  } catch (err) {
    throw new Error(`Error creating user: ${err}`);
  }
}

// READ - Get all users
export async function getAllUsers(): Promise<IUser[]> {
  try {
    return await User.find();
  } catch (err) {
    throw new Error(`Error fetching users: ${err}`);
  }
}

// READ - Get user by ID
export async function getUserById(id: string): Promise<IUser | null> {
  try {
    if (!Types.ObjectId.isValid(id)) return null; // validasi ID
    return await User.findById(id);
  } catch (err) {
    throw new Error(`Error fetching user by ID: ${err}`);
  }
}

// READ - Get user by email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email });
  } catch (err) {
    throw new Error(`Error fetching user by email: ${err}`);
  }
}

// UPDATE - Update user data by ID
export async function updateUser(
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> {
  try {
    if (!Types.ObjectId.isValid(id)) return null; // validasi ID
    data.updated_at = new Date(); // pastikan field `updated_at` selalu di-update
    return await User.findByIdAndUpdate(id, data, { new: true });
  } catch (err) {
    throw new Error(`Error updating user: ${err}`);
  }
}

// DELETE - Delete user by ID
export async function deleteUser(id: string): Promise<IUser | null> {
  try {
    if (!Types.ObjectId.isValid(id)) return null; // validasi ID
    return await User.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(`Error deleting user: ${err}`);
  }
}
