import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User.js';

export interface IRefreshToken extends Document {
  user_id: mongoose.Types.ObjectId | IUser;
  token: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
}

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false }
});

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
