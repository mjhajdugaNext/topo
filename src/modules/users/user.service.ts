import bcrypt from 'bcrypt';
import Joi, { Schema } from 'joi';
import {
  EncodeResult,
  IUser,
  IUserLogin,
  PartialUser,
  SubscryptionType,
  USER_DATA_TO_OMIT,
  User,
  UserToSave,
} from './user.interface';
import UserModel from './user.model';
import { ApiError, validate } from '../../shared/errors';
import { encodeSession } from './jwt.utils';
import { mongooseDbOperation } from '../../shared/mongoose.helpers';
import mongoose from 'mongoose';

export const getUsers = async (filter: any = undefined, toOmit: string[] = []): Promise<PartialUser[]> => {
  return mongooseDbOperation(() => UserModel.find(filter), [...USER_DATA_TO_OMIT, ...toOmit]) as Promise<PartialUser[]>;
};

export const getUserByEmail = (email: string): Promise<User | undefined> => {
  return mongooseDbOperation(() => UserModel.findOne({ email })) as Promise<User>;
};

export const getUserById = (id: string): Promise<PartialUser> => {
  return mongooseDbOperation(
    () => UserModel.findById(new mongoose.Types.ObjectId(id)),
    USER_DATA_TO_OMIT
  ) as Promise<PartialUser>;
};

const createUserValidationSchema: Schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  subscriptionType: Joi.string().optional(),
});

export const createUser = async (user: IUser): Promise<PartialUser> => {
  await validate(createUserValidationSchema, user);

  const userToSave: UserToSave = {
    email: user.email,
    username: user.username,
    password: user.password,
    subscriptionType: user.subscriptionType || SubscryptionType.standard,
  };

  return mongooseDbOperation(() => new UserModel(userToSave).save(), USER_DATA_TO_OMIT) as Promise<PartialUser>;
};

export const deleteUserById = (id: string): Promise<PartialUser> => {
  return mongooseDbOperation(() => UserModel.findOneAndDelete({ _id: id }), USER_DATA_TO_OMIT) as Promise<PartialUser>;
};

const updateUserValidationSchema: Schema = Joi.object()
  .keys({
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    username: Joi.string().optional(),
    subscriptionType: Joi.string().optional(),
  })
  .required()
  .min(1);

export const updateUserById = async (id: string, user: IUser): Promise<PartialUser> => {
  await validate(updateUserValidationSchema, user);

  const operation = async () => {
    const dbUser = await UserModel.findOne({ _id: id });

    dbUser.email = user.email || dbUser.email;
    dbUser.username = user.username || dbUser.username;
    dbUser.password = user.password || dbUser.password;
    dbUser.subscriptionType = user.subscriptionType || dbUser.subscriptionType || SubscryptionType.standard;

    return dbUser.save();
  };

  return mongooseDbOperation(operation, USER_DATA_TO_OMIT) as Promise<PartialUser>;
};


export const setSubscription = async (
  userId: string,
  subscriptionType: SubscryptionType
): Promise<{ updatedUser: PartialUser; updatedFriends: PartialUser[] }> => {

  const updatedFriends: PartialUser[] = [];

  const user: PartialUser = await getUserById(userId);
  const updatedUser: PartialUser = await updateUserById(userId, { subscriptionType });

  return {
    updatedUser,
    updatedFriends,
  };
};

const registerValidationSchema: Schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscriptionType: Joi.string().optional(),
}).unknown(true);

export const register = async (user: IUser): Promise<PartialUser> => {
  await validate(registerValidationSchema, user);

  const existingUser: User | undefined = await getUserByEmail(user.email);

  if (existingUser) {
    throw new ApiError({ message: 'User already exist', httpCode: 409 });
  }

  return createUser(user);
};

const comparePassword = async (candidatePassword: string, userPassword: string): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, userPassword);
};

const loginValidationSchema: Schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true);

export const login = async (userLogin: IUserLogin): Promise<EncodeResult> => {
  await validate(loginValidationSchema, userLogin);

  const { email, password }: IUserLogin = userLogin;

  const user: User = await getUserByEmail(email);

  if (!user) throw new ApiError({ message: 'User not exist', httpCode: 401 });

  const passowordMatching = await comparePassword(password, user.password);
  if (!passowordMatching) throw new ApiError({ message: 'Password is invalid', httpCode: 401 });

  const session: EncodeResult = encodeSession({
    _id: user._id,
    username: user.username,
    email: user.email,
  });

  return session;
};
