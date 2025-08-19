import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/services/user.service';
import { CreateUserDto, UpdateUserDto } from '@/models/User';
import { PaginationQuery, ApiResponse } from '@/models/ApiResponse';
import { asyncHandler } from '@/middlewares/errorHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAllUsers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const query: PaginationQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as string) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        q: req.query.q as string,
      };

      const result = await this.userService.getAllUsers(query);
      res.status(200).json(result);
    }
  );

  public getUserById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };

      res.status(200).json(response);
    }
  );

  public getUserByEmail = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { email } = req.query;
      const user = await this.userService.getUserByEmail(email as string);

      const response: ApiResponse = {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };

      res.status(200).json(response);
    }
  );

  public createUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const userData: CreateUserDto = req.body;
      const user = await this.userService.createUser(userData);

      const response: ApiResponse = {
        success: true,
        message: 'User created successfully',
        data: user,
      };

      res.status(201).json(response);
    }
  );

  public updateUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;

      const user = await this.userService.updateUser(id, userData);

      const response: ApiResponse = {
        success: true,
        message: 'User updated successfully',
        data: user,
      };

      res.status(200).json(response);
    }
  );

  public deleteUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;
      const { hard } = req.query;

      await this.userService.deleteUser(id, hard !== 'true');

      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully',
      };

      res.status(200).json(response);
    }
  );

  public getUserStats = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const totalUsers = await this.userService.getUserCount();

      const response: ApiResponse = {
        success: true,
        message: 'User statistics retrieved successfully',
        data: {
          totalUsers,
        },
      };

      res.status(200).json(response);
    }
  );
}
