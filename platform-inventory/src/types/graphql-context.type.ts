import { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request & {
    headers: {
      authorization?: string;
      'x-user-id'?: string;
      'x-user-role'?: string;
      'x-user-name'?: string;
      'x-user-organization-id'?: string;
    };
  };
  res: Response;
  user?: {
    id: number;
    organizationId: number;
    name: string;
    email: string;
    role: string;
  };
}
