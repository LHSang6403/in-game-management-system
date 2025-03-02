export const extractHeadersForExecution = (
  context: any,
): Record<string, string> => {
  if (!context || !context.req || !context.req.headers) {
    console.warn('⚠️ Context or headers are missing in execution');
    return {};
  }

  return {
    'Content-Type': 'application/json',
    Authorization: context.req.headers['authorization'] || '',
    'X-User-Id': context.req.user?.id ? String(context.req.user.id) : '',
    'X-User-Role': context.req.user?.role || '',
    'X-User-Name': context.req.user?.name || '',
    'X-User-Organization-Id': context.req.user?.organizationId
      ? String(context.req.user.organizationId)
      : '',
  };
};

export const extractHeadersForRemoteSchema = (
  context: any,
): Record<string, string> => {
  if (!context || !context.contextValue || !context.contextValue.headers) {
    console.warn(
      '⚠️ Context or headers are missing in remote schema execution',
    );
    return {};
  }

  return {
    'Content-Type': 'application/json',
    Authorization: context.contextValue.headers['Authorization'] || '',
    'X-User-Id': context.contextValue.headers['X-User-Id'] || '',
    'X-User-Role': context.contextValue.headers['X-User-Role'] || '',
    'X-User-Name': context.contextValue.headers['X-User-Name'] || '',
    'X-User-Organization-Id':
      context.contextValue.headers['X-User-Organization-Id'] || '',
  };
};
