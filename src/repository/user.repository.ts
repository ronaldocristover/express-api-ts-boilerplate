import prisma from '@/config/database';
import { User, CreateUserDto, UpdateUserDto } from '@/models/User';
import { PaginationQuery } from '@/models/ApiResponse';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(query: PaginationQuery): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', q } = query;

    const skip = (page - 1) * limit;

    // Build where clause for search functionality
    const whereClause = q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    return { users, total };
  }

  async create(userData: CreateUserDto): Promise<User> {
    return await prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data: {
        ...userData,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<User | null> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!user;
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }
}
