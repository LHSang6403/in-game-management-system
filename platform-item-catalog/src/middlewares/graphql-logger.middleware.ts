import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GraphQLLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GraphQLLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;

    res.send = (body: any) => {
      try {
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        this.logger.log(
          `[GraphQL] Response:\n${JSON.stringify(parsedBody, null, 2)}`,
        );
      } catch (error) {
        this.logger.log(`[GraphQL] Raw Response:\n${body}`);
      }

      return originalSend.call(res, body);
    };

    next();
  }
}
