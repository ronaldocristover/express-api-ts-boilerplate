import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: 'PORT must be a valid port number between 1 and 65535',
    })
    .default('3000'),
  HOST: z.string().min(1, 'HOST is required').default('localhost'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid database URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[dhm]$/, 'JWT_EXPIRES_IN must be in format like "7d", "24h", "60m"')
    .default('7d'),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z
    .string()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .optional(),
  REDIS_PASSWORD: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  LOG_FILE_PATH: z.string().default('./logs/app.log'),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: 'RATE_LIMIT_WINDOW_MS must be a positive number',
    })
    .default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, {
      message: 'RATE_LIMIT_MAX_REQUESTS must be a positive number',
    })
    .default('100'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  API_VERSION: z.string().default('v1'),
});

export type Environment = z.infer<typeof envSchema>;

export const validateEnvironment = (): Environment => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        })
        .join('\n');

      console.error('❌ Environment validation failed:');
      console.error(errorMessages);
      console.error(
        '\nPlease check your .env file and ensure all required variables are set correctly.'
      );
      process.exit(1);
    }
    throw error;
  }
};

export const getEnvironment = (): Environment => {
  return validateEnvironment();
};
