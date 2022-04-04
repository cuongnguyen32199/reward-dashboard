import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  email: string,
  password: string,
  name: string,
};

const UserSchema = new Schema<IUser>({
  name: { type: String, required: false },
  email: { type: String, index: true, unique: true, required: true },
  password: {type: String, required: true, select: false },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const UserModel = model<IUser>('users', UserSchema);

export default UserModel;
