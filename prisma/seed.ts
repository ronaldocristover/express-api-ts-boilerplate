import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { 
  seedUsers, 
  developmentSeedUsers, 
  testSeedUsers, 
  productionSeedUsers,
  type SeedUser 
} from './seedData';

const prisma = new PrismaClient();

function getSeedDataForEnvironment(): SeedUser[] {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return productionSeedUsers;
    case 'test':
      return testSeedUsers;
    case 'development':
    default:
      return developmentSeedUsers;
  }
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function createUsers() {
  const usersData = getSeedDataForEnvironment();
  const env = process.env.NODE_ENV || 'development';
  
  console.log(`🌱 Seeding users for ${env} environment...`);
  console.log(`   📋 Found ${usersData.length} users to seed`);
  
  for (const userData of usersData) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`   ⚠️  User with email ${userData.email} already exists, skipping...`);
      continue;
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    console.log(`   ✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
  }
}

async function main() {
  console.log('🚀 Starting database seed...');
  
  try {
    await createUsers();
    
    console.log('✅ Database seeded successfully!');
    
    // Print summary
    const userCount = await prisma.user.count();
    const activeUserCount = await prisma.user.count({ where: { isActive: true } });
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total users: ${userCount}`);
    console.log(`   Active users: ${activeUserCount}`);
    console.log(`   Inactive users: ${userCount - activeUserCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('👋 Disconnected from database');
  });