// Seed data configuration
export interface SeedUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
}

export const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'Admin123!',
    isActive: true,
  },
  {
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'bob.wilson@example.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'alice.johnson@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    password: 'Password123!',
    isActive: false,
  },
  {
    email: 'charlie.brown@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'diana.prince@example.com',
    firstName: 'Diana',
    lastName: 'Prince',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'test.user@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!',
    isActive: true,
  },
];

// Environment-specific seed data
export const developmentSeedUsers = seedUsers;

export const testSeedUsers: SeedUser[] = [
  {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'Password123!',
    isActive: true,
  },
  {
    email: 'inactive@example.com',
    firstName: 'Inactive',
    lastName: 'User',
    password: 'Password123!',
    isActive: false,
  },
];

export const productionSeedUsers: SeedUser[] = [
  {
    email: 'admin@yourcompany.com',
    firstName: 'System',
    lastName: 'Administrator',
    password: 'ChangeMe123!',
    isActive: true,
  },
];