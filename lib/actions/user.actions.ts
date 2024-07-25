'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import Order from '@/lib/database/models/order.model';
import Event from '@/lib/database/models/event.model';
import { handleError } from '@/lib/utils';

import { CreateUserParams, UpdateUserParams } from '@/types';

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log('Creating user:', user);

    const newUser = await User.create(user);
    console.log('User created:', newUser);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error('Error creating user:', error);
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();
    console.log('Fetching user by ID:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      throw new Error('User not found');
    }
    console.log('User fetched:', user);

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();
    console.log('Updating user with clerkId:', clerkId, 'with data:', user);

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });
    if (!updatedUser) {
      console.error('User update failed:', clerkId);
      throw new Error('User update failed');
    }
    console.log('User updated:', updatedUser);

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error('Error updating user:', error);
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();
    console.log('Deleting user with clerkId:', clerkId);

    const userToDelete = await User.findOne({ clerkId });
    if (!userToDelete) {
      console.error('User not found:', clerkId);
      throw new Error('User not found');
    }
    console.log('User to delete found:', userToDelete);

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ]);

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');
    console.log('User deleted:', deletedUser);

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.error('Error deleting user:', error);
    handleError(error);
  }
}
