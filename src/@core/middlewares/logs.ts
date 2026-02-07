import { visitLogService } from "@shared/utils/visitLog";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const logsMiddleware = async (args: any, next: any) => {
  const url = args?.request?.url;

  if (url) {
    visitLogService.log({
      path: url.replace(FRONTEND_URL, ""),
    });
  }

  return await next();
};

export default logsMiddleware;
