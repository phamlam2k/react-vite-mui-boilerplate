const authMiddleware = async (_args: any, next: any) => {
  return next();
};

export default authMiddleware;
