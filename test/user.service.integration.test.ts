import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import * as userService from '../src/modules/users/user.service';
import { integrationTestSetup } from './setup';
import { PartialUser, User, UserToSave, IUser, SubscryptionType } from '../src/modules/users/user.interface';

integrationTestSetup();

describe('getUsers', () => {
  test('can return list of users', async () => {
    const users = await userService.getUsers();
    expect(users).toEqual([]);
  });
});

describe('getUserByEmail', () => {
  test('returns undefined when no user founded', async () => {
    const user = await userService.getUserByEmail('some email');
    expect(user).toBeUndefined();
  });

  test('returns user when exists in db', async () => {
    const userData: IUser = {
      email: 'email@email.com',
      username: 'mjhajduga',
      password: 'password',
      subscriptionType: SubscryptionType.standard,
    };
    await userService.createUser(userData);

    const user = await userService.getUserByEmail(userData.email);
    expect(user).toEqual({
      __v: expect.any(Number),
      _id: expect.any(String),
      username: userData.username,
      email: userData.email,
      password: expect.any(String),
      subscriptionType: SubscryptionType.standard,
    });
  });
});

describe('getUserById', () => {
  test('returns user when exists in db', async () => {
    const userData = {
      email: 'email@email.com',
      username: 'mjhajduga',
      password: 'password',
      subscriptionType: SubscryptionType.standard,
    };
    const { _id } = await userService.createUser(userData);

    const user = await userService.getUserById(_id);
    expect(user).toEqual({
      __v: expect.any(Number),
      _id,
      username: userData.username,
      email: userData.email,
      subscriptionType: SubscryptionType.standard,
    });
  });
});

describe('createUser', () => {
  test('creates and returns created user', async () => {
    const userData = {
      email: 'email@email.com',
      username: 'mjhajduga',
      password: 'password',
      subscriptionType: SubscryptionType.standard,
    };
    const savedUser = await userService.createUser(userData);
    const usersInDb = await userService.getUsers();

    expect(usersInDb).toEqual([
      {
        __v: expect.any(Number),
        _id: expect.any(String),
        username: userData.username,
        email: userData.email,
        subscriptionType: SubscryptionType.standard,
      },
    ]);

    expect(savedUser).toEqual({
      __v: expect.any(Number),
      _id: expect.any(String),
      username: userData.username,
      email: userData.email,
      subscriptionType: SubscryptionType.standard,
    });
  });

  test('throws an error when no email passed', async () => {
    const userData = {
      username: 'mjhajduga',
      password: 'password',
      subscriptionType: SubscryptionType.standard,

    };
    await expect(userService.createUser(userData)).rejects.toThrow('"email" is required');
  });

  test('throws an error when no username passed', async () => {
    const userData = {
      email: 'email@email.com',
      password: 'password',
      subscriptionType: SubscryptionType.standard,
    };
    await expect(userService.createUser(userData)).rejects.toThrow('"username" is required');
  });

  test('throws an error when no password passed', async () => {
    const userData = {
      email: 'email@email.com',
      username: 'mjhajduga',
      subscriptionType: SubscryptionType.standard,
    };
    await expect(userService.createUser(userData)).rejects.toThrow('"password" is required');
  });
});

describe('updateUserById', () => {
  let user: PartialUser;

  beforeEach(async () => {
    user = await userService.createUser({
      email: 'email@email.com',
      username: 'mjhajduga',
      password: 'password',
      subscriptionType: SubscryptionType.standard,
    });
  });

  test('updates email', async () => {
    const userData = {
      email: 'email2@email.com',
    };

    const updatedUser: PartialUser = await userService.updateUserById(user._id, userData);

    expect(updatedUser).toEqual({
      __v: expect.any(Number),
      _id: user._id,
      username: user.username,
      email: userData.email,
      subscriptionType: SubscryptionType.standard,
    });
  });

  test('updates username', async () => {
    const userData = {
      username: 'username2',
    };

    const updatedUser: PartialUser = await userService.updateUserById(user._id, userData);

    expect(updatedUser).toEqual({
      __v: expect.any(Number),
      _id: user._id,
      username: userData.username,
      email: user.email,
      subscriptionType: SubscryptionType.standard,
    });
  });

  test('updates password', async () => {
    const userData = {
      password: 'password2',
    };

    const userBeforeUpdate: User | undefined = await userService.getUserByEmail(user.email);
    const updatedUser: PartialUser = await userService.updateUserById(user._id, userData);
    const updatedUserFromDb = await userService.getUserByEmail(user.email);

    expect(updatedUser).toEqual({
      __v: expect.any(Number),
      _id: user._id,
      username: user.username,
      email: user.email,
      subscriptionType: SubscryptionType.standard,
    });

    expect(updatedUserFromDb).toEqual({
      __v: expect.any(Number),
      _id: user._id,
      username: user.username,
      password: expect.any(String),
      email: user.email,
      subscriptionType: SubscryptionType.standard,
    });

    expect(updatedUserFromDb?.password).not.toEqual(userData.password); // expect data to be hashed
    expect(userBeforeUpdate?.password).not.toEqual(updatedUserFromDb?.password); // expect hash to be different than before update
  });

  test('updates subscriptionType', async () => {
    const userData = {
      subscriptionType: SubscryptionType.premium,
    };

    const updatedUser: PartialUser = await userService.updateUserById(user._id, userData);

    expect(updatedUser).toEqual({
      __v: expect.any(Number),
      _id: user._id,
      username: user.username,
      email: user.email,
      subscriptionType: SubscryptionType.premium,
    });
  });

  test('throws an error when invalid object passed to update', async () => {
    const userData = {};

    await expect(userService.updateUserById(user._id, userData)).rejects.toThrow('"value" must have at least 1 key');
  });
});

describe('deleteUserById', () => {
  test('deletes user', async () => {
    const userData = {
      email: 'email@email.com',
      username: 'mjhajduga',
      password: 'password',
    };
    const { _id } = await userService.createUser(userData);

    const user = await userService.deleteUserById(_id);

    expect(user).toEqual({
      __v: expect.any(Number),
      _id,
      username: userData.username,
      email: userData.email,
      subscriptionType: SubscryptionType.standard,
    });

    const usersInDb = await userService.getUsers();

    expect(usersInDb).toEqual([]);
  });
});
