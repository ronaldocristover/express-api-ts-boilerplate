import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import environment from '@/config/environment';
import logger from '@/config/logger';
import { errorHandler } from '@/middlewares/errorHandler';
import { requestLogger } from '@/middlewares/requestLogger';
import { generalLimiter } from '@/middlewares/rateLimiter';
import prisma from './config/database';
import routes from '@/routes';

class App {
  public app: Application;
  public log;

  constructor() {
    this.app = express();
    this.log = logger;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: environment.CORS_ORIGIN,
        credentials: true,
      })
    );

    // Performance middlewares
    this.app.use(compression());

    // Rate limiting
    this.app.use(generalLimiter);

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    this.app.use(requestLogger);

    // Trust proxy (for accurate IP addresses behind reverse proxy)
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check endpoint with database status
    this.app.get('/health', async (req: Request, res: Response) => {
      try {
        const connectPrisma = await prisma.$connect();
        logger.info('Connected to the database successfully.');
        res.status(200).json({
          success: true,
          message: 'Server is healthy',
          environment: environment.NODE_ENV,
          database: {
            connected: connectPrisma,
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed', errorMessage);
        res.status(503).json({
          success: false,
          message: 'Database connection failed',
          database: {
            connected: false,
          },
        });
      }

      logger.info('Connected to the database successfully.');
    });

    // API routes
    this.app.use(`/api/${environment.API_VERSION}`, routes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          message: `Route ${req.originalUrl} not found`,
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app
      .listen(environment.PORT, () => {
        logger.info(`Server is running on ${environment.HOST}:${environment.PORT}`);
        logger.debug(`Environment: ${environment.NODE_ENV}`);
        logger.info(`API Version: ${environment.API_VERSION}`);
      })
      .on('error', (err) => {
        logger.error(err);
        process.exit(1);
      });
  }
}

export default App;
