import http from 'http';
import fs from 'fs';
import path from 'path';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import jsYaml from 'js-yaml';
import OpenApiValidator from 'express-openapi-validator';
import logger from './logger';
import config from './config';

interface ErrorWithStatus extends Error {
  status?: number;
  errors?: any;
}

export class ExpressServer {
  public app: Express;
  public port: number;
  public openApiPath: string;
  public schema: any;
  private server?: http.Server;

  constructor(port: number, openApiYaml: string) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;

    try {
      this.schema = jsYaml.load(fs.readFileSync(openApiYaml, 'utf8'));
    } catch (e: any) {
      logger.error('Failed to start Express Server', e.message);
    }

    this.setupMiddleware();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '14MB' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // Register your controllers
    this.app.use('/farmer', UserController);

    // Swagger UI
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));

    // Redirect routes
    this.app.get('/login-redirect', (req: Request, res: Response) => {
      res.status(200).json(req.query);
    });
    this.app.get('/oauth2-redirect.html', (req: Request, res: Response) => {
      res.status(200).json(req.query);
    });

    // OpenAPI Validator middleware
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openApiPath,
        operationHandlers: path.join(__dirname),
        fileUploader: { dest: config.FILE_UPLOAD_PATH },
      }),
    );
  }

  public launch() {
    // Global error handler
    this.app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500).json({
        message: err.message || err,
        errors: err.errors || '',
      });
    });

    this.server = http.createServer(this.app).listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }

  public async close() {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => (err ? reject(err) : resolve()));
      });
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}
