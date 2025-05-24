import { User, IUser } from "../models/User";
import { Types } from "mongoose";
import "dotenv/config";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";

import logger from "../utils/logger";

// CREATE
export async function createOneUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<IUser> {
  try {
    logger.debug(`createOneUser()`, {username:data.username, email:data.email})
    await User.deleteOne({username: data.username})
    logger.debug(`deleteOne`)
    const user = new User(data);
    user.hpass = await bcrypt.hash(data.password, 10);
    await user.save();
    return user;
  } catch (err) {
    logger.error(`Error in createOneUser()`)
    throw new Error(`Error creating user: ${err}`);
  }
}

// READ - Get all users
export async function getAllUsers(): Promise<IUser[]> {
  try {
    logger.debug(`getAllUsers()`)
    return await User.find();
  } catch (err) {
    logger.error(`Error in getAllUsers()`)
    throw new Error(`Error fetching users: ${err}`);
  }
}

// READ - Get user by ID
export async function getUserByUsername(
  username: string
): Promise<IUser | null> {
  try {
    logger.debug(`getUserByUsername()`, {username})
    // if (!Types.ObjectId.isValid(id)) return null; // validasi ID
    return await User.findOne({ username });
  } catch (err) {
    logger.error(`Error in getUserByUsername()`)
    throw new Error(`Error fetching user by ID: ${err}`);
  }
}

// READ - Get user by email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    logger.debug(`getUserByEmail()`, {email})
    return await User.findOne({ email });
  } catch (err) {
    logger.error(`Error in getUserByEmail()`)
    throw new Error(`Error fetching user by email: ${err}`);
  }
}

// READ - Get is username exist
export async function isUsernameExist(username: string): Promise<boolean> {
  try {
    logger.debug(`isUsernameExist()`, {username})
    const res = await User.findOne({ username });
    return !!res?.is_verified;
  } catch (err) {
    logger.error(`Error in isUsernameExist()`)
    throw new Error(`Error fetching user by username: ${err}`);
  }
}

// READ - Get is email exist
export async function isEmailExist(email: string): Promise<boolean> {
  try {
    logger.debug(`isEmailExist()`, {email})
    const res = await User.findOne({ email });
    return !!res?.is_verified;
  } catch (err) {
    logger.error(`Error in isEmailExist()`)
    throw new Error(`Error fetching user by email: ${err}`);
  }
}

// READ - Compare password by username
export async function comparePassByUsername(username: string, password: string): Promise<boolean> {
  try {
    logger.debug(`comparePassByUsername()`, {username, password})
    const resU = await User.findOne({ username }).lean();
    if(resU){
      return await bcrypt.compare(password, resU.hpass)
    }else{
      throw new Error(`username not found`);
    }
  } catch (err) {
    logger.error(`Error in comparePassByUsername()`)
    throw new Error(`Error compare user password: ${err}`);
  }
}

// READ - Compare password by username
export async function comparePassByEmail(email: string, password: string): Promise<boolean> {
  try {
    logger.debug(`comparePassByEmail()`, {email, password})
    const resU = await User.findOne({ email }).lean();
    if(resU){
      return await bcrypt.compare(password, resU.hpass)
    }else{
      throw new Error(`email not found`);
    }
  } catch (err) {
    logger.error(`Error in comparePassByEmail()`)
    throw new Error(`Error compare user password: ${err}`);
  }
}


// UPDATE - Update user data by ID
export async function updateUser(
  username: string,
  data: Partial<IUser>
): Promise<IUser | null> {
  try {
    logger.debug(`updateUser()`, {username, data})
    const res = await User.findOne({ username });
    if (res) {
      if (!Types.ObjectId.isValid(res.id)) return null;
      return await User.findByIdAndUpdate(res.id, data , { new: true });
    }
    return null;
  } catch (err) {
    logger.error(`Error in updateUser()`)
    throw new Error(`Error updating user: ${err}`);
  }
}

// DELETE - Delete user by ID
export async function deleteUser(
  username: string,
  password: string
): Promise<IUser | null> {
  try {
    logger.debug(`deleteUser()`, {username, password})
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
    logger.error(`Error in deleteUser()`)
    throw new Error(`Error deleting user: ${err}`);
  }
}
