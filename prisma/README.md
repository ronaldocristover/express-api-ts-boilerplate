# Database Seeding

This directory contains the database seeding functionality for the application.

## Files

- `seed.ts` - Main seed script that populates the database with initial data
- `seedData.ts` - Environment-specific seed data configuration
- `schema.prisma` - Database schema definition

## Usage

### Run Seed Script

```bash
# Seed the database with environment-specific data
npm run db:seed

# Or use Prisma's built-in seed command
npx prisma db seed
```

### Reset Database with Seed

```bash
# Reset database and run seed
npm run db:reset
```

### Environment-Specific Seeding

The seed script automatically selects appropriate data based on `NODE_ENV`:

- **Development**: Seeds 8 users including admin, test users, and some inactive users
- **Test**: Seeds minimal data (2 users) for testing purposes
- **Production**: Seeds only essential admin user (requires password change)

## Seed Data

### Development Users
- `admin@example.com` - Admin User (active)
- `john.doe@example.com` - John Doe (active)
- `jane.smith@example.com` - Jane Smith (active)
- `bob.wilson@example.com` - Bob Wilson (active)
- `alice.johnson@example.com` - Alice Johnson (inactive)
- `charlie.brown@example.com` - Charlie Brown (active)
- `diana.prince@example.com` - Diana Prince (active)
- `test.user@example.com` - Test User (active)

### Test Users
- `test@example.com` - Test User (active)
- `inactive@example.com` - Inactive User (inactive)

### Production Users
- `admin@yourcompany.com` - System Administrator (active) 
  - **Important**: Change the default password after first login

## Password Security

- All passwords are hashed using bcrypt with 12 salt rounds
- Default development password: `Password123!`
- Default admin password: `Admin123!`
- Production admin password: `ChangeMe123!` (must be changed)

## Safety Features

- Checks for existing users before creating to prevent duplicates
- Environment-specific data prevents accidental production data pollution
- Clear logging shows what data is being seeded
- Provides summary statistics after seeding

## Customization

To add new seed data:

1. Edit `seedData.ts` to add new users to the appropriate environment arrays
2. Follow the existing data structure with proper typing
3. Run the seed script to populate new data

## Notes

- Seed script is idempotent - safe to run multiple times
- Existing users are skipped to prevent duplicates
- All seed users follow the application's validation rules
- Passwords meet the security requirements defined in validators