import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { SubscryptionType } from './user.interface';

const UserSchema = new mongoose.Schema({
  username: { type: String, ruquired: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  subscriptionType: {
    type: String,
    enum: [SubscryptionType.standard, SubscryptionType.premium, SubscryptionType.vip],
    default: [SubscryptionType.standard],
    required: true,
  },
});

UserSchema.pre('save', async function (next) {
  const user: any = this;
  if (!user.isModified('password')) return next();
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      next(err);
    }
  }
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
