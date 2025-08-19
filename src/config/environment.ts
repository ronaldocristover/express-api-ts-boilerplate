import dotenv from 'dotenv';
import { getEnvironment } from '@/utils/envValidator';

// Load environment variables from .env file
dotenv.config();

// Validate and export environment configuration
const environment = getEnvironment();

export default environment;
