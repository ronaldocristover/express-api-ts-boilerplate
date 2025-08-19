import { z } from 'zod';

// Helper function to create name validation
const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  );

// User creation validation schema
export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email address')
      .transform((val) => val.toLowerCase()),
    firstName: nameSchema,
    lastName: nameSchema,
    password: passwordSchema,
  }),
});

// User update validation schema
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Please provide a valid user ID'),
  }),
  body: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    isActive: z.boolean({ invalid_type_error: 'isActive must be a boolean value' }).optional(),
  }),
});

// User ID validation schema
export const userIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Please provide a valid user ID'),
  }),
});

// Pagination validation schema
export const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1, 'Page must be a positive integer')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a number')
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
      .optional(),
    sortBy: z
      .enum(['createdAt', 'updatedAt', 'email', 'firstName', 'lastName'], {
        errorMap: () => ({
          message: 'sortBy must be one of: createdAt, updatedAt, email, firstName, lastName',
        }),
      })
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'], {
        errorMap: () => ({ message: 'sortOrder must be either asc or desc' }),
      })
      .optional(),
    q: z
      .string()
      .trim()
      .min(1, 'Search query must be at least 1 character long')
      .max(100, 'Search query must not exceed 100 characters')
      .optional(),
  }),
});

// Export types for TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
