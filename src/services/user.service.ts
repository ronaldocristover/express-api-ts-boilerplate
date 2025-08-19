import { UserRepository } from '@/repository/user.repository';
import { User, CreateUserDto, UpdateUserDto, UserResponse } from '@/models/User';
import { PaginationQuery, PaginatedResponse } from '@/models/ApiResponse';
import { createError } from '@/middlewares/errorHandler';
import logger from '@/config/logger';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(query: PaginationQuery): Promise<PaginatedResponse<UserResponse>> {
    try {
      const { page = 1, limit = 10, q } = query;
      const { users, total } = await this.userRepository.findAll(query);

      const userResponses: UserResponse[] = users.map(this.formatUserResponse);

      const pages = Math.ceil(total / limit);

      const message = q ? `Found ${total} users matching "${q}"` : 'Users retrieved successfully';

      return {
        success: true,
        message,
        data: userResponses,
        pagination: {
          page,
          limit,
          total,
          pages,
          hasNext: page < pages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      throw createError('Failed to retrieve users', 500);
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw createError('User not found', 404);
      }

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        throw error;
      }
      logger.error('Error in getUserById:', error);
      throw createError('Failed to retrieve user', 500);
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw createError('User not found', 404);
      }

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        throw error;
      }
      logger.error('Error in getUserByEmail:', error);
      throw createError('Failed to retrieve user', 500);
    }
  }

  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    try {
      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }

      const user = await this.userRepository.create(userData);
      logger.info(`User created successfully: ${user.id}`);

      return this.formatUserResponse(user);
    } catch (error) {
      if (error instanceof Error && error.message === 'User with this email already exists') {
        throw error;
      }
      logger.error('Error in createUser:', error);
      throw createError('Failed to create user', 500);
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserResponse> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw createError('User not found', 404);
      }

      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        throw createError('Failed to update user', 500);
      }

      logger.info(`User updated successfully: ${id}`);
      return this.formatUserResponse(updatedUser);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === 'User not found' || error.message === 'Failed to update user')
      ) {
        throw error;
      }
      logger.error('Error in updateUser:', error);
      throw createError('Failed to update user', 500);
    }
  }

  async deleteUser(id: string, soft: boolean = true): Promise<void> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw createError('User not found', 404);
      }

      if (soft) {
        await this.userRepository.softDelete(id);
        logger.info(`User soft deleted successfully: ${id}`);
      } else {
        await this.userRepository.delete(id);
        logger.info(`User hard deleted successfully: ${id}`);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        throw error;
      }
      logger.error('Error in deleteUser:', error);
      throw createError('Failed to delete user', 500);
    }
  }

  async getUserCount(): Promise<number> {
    try {
      return await this.userRepository.count();
    } catch (error) {
      logger.error('Error in getUserCount:', error);
      throw createError('Failed to get user count', 500);
    }
  }

  private formatUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
