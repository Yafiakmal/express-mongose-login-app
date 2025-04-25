import { User, IUser } from "../models/User.js";
import { Types } from "mongoose";
import "dotenv/config";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";

// CREATE
export async function createOneUser(data: {
  username: string;
  email: string;
  hpass: string;
}): Promise<IUser> {
  try {
    const user = new User(data);
    user.hpass = await bcrypt.hash(data.hpass, 10);
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
export async function getUserByUsername(
  username: string
): Promise<IUser | null> {
  try {
    // if (!Types.ObjectId.isValid(id)) return null; // validasi ID
    return await User.findOne({ username });
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

// READ - Get is username exist
export async function isUsernameExist(username: string): Promise<boolean> {
  try {
    const res = await User.findOne({ username });
    return !!res?.is_verified;
  } catch (err) {
    throw new Error(`Error fetching user by username: ${err}`);
  }
}

// READ - Get is email exist
export async function isEmailExist(email: string): Promise<boolean> {
  try {
    const res = await User.findOne({ email });
    return !!res?.is_verified;
  } catch (err) {
    throw new Error(`Error fetching user by email: ${err}`);
  }
}

// READ - Compare password
export async function isPasswordValid(username: string, password: string): Promise<boolean> {
  try {
    const res = await User.findOne({ username });
    if(res){
      return await bcrypt.compare(password, res.hpass)
    }else{
      throw new Error(`username not found`);
    }
  } catch (err) {
    throw new Error(`Error compare user password: ${err}`);
  }
}

// UPDATE - Update user data by ID
export async function updateUser(
  username: string,
  data: Partial<IUser>
): Promise<IUser | null> {
  try {
    const res = await User.findOne({ username });
    if (res) {
      if (!Types.ObjectId.isValid(res.id)) return null;
      return await User.findByIdAndUpdate(res.id, { data }, { new: true });
    }
    return null;
  } catch (err) {
    throw new Error(`Error updating user: ${err}`);
  }
}

// DELETE - Delete user by ID
export async function deleteUser(
  username: string,
  password: string
): Promise<IUser | null> {
  try {
    const res = await User.findOne({ username });
    if (res) {
      if (await bcrypt.compare(password, res.hpass)) {
        if (!Types.ObjectId.isValid(res.id)) return null;
        return await User.findByIdAndDelete(res.id);
      } else {
        throw new Error("Password not valid");
      }
    }
    return null;
  } catch (err) {
    throw new Error(`Error deleting user: ${err}`);
  }
}
