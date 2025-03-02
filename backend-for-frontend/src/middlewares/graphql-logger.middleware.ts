import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GraphQLLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GraphQLLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;

    res.send = (body: any) => {
      this.logger.log('Load schema');
      return originalSend.call(res, body);
    };

    next();
  }
}
