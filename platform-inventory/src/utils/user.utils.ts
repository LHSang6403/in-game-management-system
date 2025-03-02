import { GraphQLContext } from 'src/types/graphql-context.type';

export interface UserInfo {
  id: number;
  role: string;
  name: string;
  organizationId: number;
}

export const extractUserInfo = (context: GraphQLContext): UserInfo => {
  if (!context || !context.req || !context.req.headers) {
    console.warn('⚠️ Context or headers are missing');
    return { id: 0, role: '', name: '', organizationId: 0 };
  }

  return {
    id: parseInt(context.req.headers['x-user-id'], 10) || 0,
    role: context.req.headers['x-user-role'] || '',
    name: context.req.headers['x-user-name'] || '',
    organizationId:
      parseInt(context.req.headers['x-user-organization-id'], 10) || 0,
  };
};
